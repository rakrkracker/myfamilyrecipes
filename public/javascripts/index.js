const allFilters = [];

function addFilter() {
    // Get elements
    const filtersTitle = document.querySelector('#filters-title');
    const filters = document.querySelector('#filters');
    const searchBar = document.querySelector('#search-value');
    const searchValue = searchBar.value.toLowerCase();
    const searchCategory = document.querySelector('#search-category .active p').innerHTML.toLowerCase();

    // Create filter data
    const filter = document.createElement('button');
    filter.classList.add('btn');
    filter.classList.add('filter');
    filter.classList.add('me-3');
    filter.classList.add('mb-2');
    filter.innerHTML = searchValue + ', ' + searchCategory;

    // Click to remove
    filter.addEventListener('click', deleteFilter);

    // Add filter
    filters.appendChild(filter);
    allFilters.push([searchValue, searchCategory]);

    // Update recipes with filter
    updateRecipes();

    // If first filter, Add filters title
    if (allFilters.length === 1) filtersTitle.classList.remove('invisible');

    // Clear search text
    searchBar.value = '';
}

function deleteFilter(e) {
    // Get filters title
    const filtersTitle = document.querySelector('#filters-title');

    // Get filter and remove from list
    const filterInfo = e.target.innerHTML.split(',');
    allFilters.splice(allFilters.indexOf([filterInfo[0], filterInfo[1]]));

    // Update recipes
    updateRecipes();

    // If last filter, remove filters title
    if (allFilters.length === 0) filtersTitle.classList.add('invisible');

    // Remove filter element
    e.target.remove();
}

function updateRecipes() {
    // Go through all filters
    let isRecipeValid = Array(recipes.length).fill(true);
    let isChef = [];
    let isTitle = [];
    let isIng = [];
    let isTime = [];
    for (const filter of allFilters) {
        const value = filter[0];
        const category = filter[1];

        switch (category) {
            case 'all categories':
                isChef = isChefValid(recipes, value);
                isTitle = isTitleValid(recipes, value);
                isIng = isIngValid(recipes, value);
                isTime = isTimeValid(recipes, value);

                isRecipeValid = isRecipeValid.map((isValid, index) => isValid && (isChef[index] || isTitle[index] || isIng[index] || isTime[index]));

                break;

            case 'chef':
                isChef = isChefValid(recipes, value);
                isRecipeValid = isRecipeValid.map((isValid, index) => isValid && isChef[index]);
                break;

            case 'title':
                isTitle = isTitleValid(recipes, value);
                isRecipeValid = isRecipeValid.map((isValid, index) => isValid && isTitle[index]);

                break;

            case 'ingredient':
                isIng = isIngValid(recipes, value);
                isRecipeValid = isRecipeValid.map((isValid, index) => isValid && isIng[index]);
                break;

            case 'time':
                isTime = isTimeValid(recipes, value);
                isRecipeValid = isRecipeValid.map((isValid, index) => isValid && isTime[index]);
                break;

            default:
                break;
        }
    }

    // Filter recipes
    const recipeCards = document.querySelectorAll('.recipe-card');
    for (const [i, isValid] of isRecipeValid.entries()) {
        recipeCards[i].hidden = !isValid;
    }
}

function isChefValid(recipes, chef) {
    return Array.from(recipes, recipe => recipe.chef.username.toLowerCase().includes(chef));
}

function isTitleValid(recipes, title) {
    return isRecipeValid = Array.from(recipes, recipe => recipe.title.toLowerCase().includes(title));
}

function isIngValid(recipes, ingredient) {
    return isRecipeValid = Array.from(recipes, recipe => recipe.ingredients.some(ing => ing.toLowerCase().includes(ingredient)));
}

function isTimeValid(recipes, time_string) {
    return Array.from(recipes, recipe => {
        const recipeTime = parseInt(recipe.time.match(/(\d+)/));
        const searchTime = parseInt(time_string);
        return (recipeTime - (searchTime - 10)) * (recipeTime - (searchTime + 10)) <= 0;
    });
}