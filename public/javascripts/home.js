function getRandChefRecipes() {
    // Go through uses
    for (let [index, user] of users.entries()) {
        // Get recipes of user
        const userRecipes = recipes.filter(recipe => recipe.chef === user._id);

        // Select random recipe
        const chosenRecipeIndex = Math.floor(Math.random() * userRecipes.length);
        const chosenRecipe = recipes[chosenRecipeIndex];

        // Get fields to update
        const link = document.querySelector(`#user-${index}-recipe-link`);
        const image = document.querySelector(`#user-${index} .info .recipe .image`);
        const title = document.querySelector(`#user-${index} .recipe-text .title`);
        const description = document.querySelector(`#user-${index}  .recipe-text .description`);

        // Update fields
        link.href = `/recipes/${chosenRecipe._id}`;

        if (chosenRecipe.images.length > 0) image.src = chosenRecipe.images[0];
        else image.src = 'https://res.cloudinary.com/db6vrbjgz/image/upload/v1607685732/FamilyRecipes/no-image-icon-23485_zd81b3.png';
        
        title.innerHTML = chosenRecipe.title;
        description.innerHTML = chosenRecipe.description;
    }
}