function prepareLists() {
    prepareIngredients();
    prepareSteps();
}

function prepareIngredients() {
    let ingredients = document.querySelector("#ingredients-list").children;
    for (let ingredient of ingredients) {
        const tag = document.createElement("input");
        tag.type = "hidden";
        tag.name = "ingredients[]";
        tag.value = ingredient.textContent;

        ingredient.appendChild(tag);
    }
}

function prepareSteps() {
    let steps = document.querySelector("#steps-list").children;
    for (let step of steps) {
        const tag = document.createElement("input");
        tag.type = "hidden";
        tag.name = "steps[]";
        tag.value = step.textContent;

        step.appendChild(tag);
    }
}

function addIngredient() {
    let ingredient = document.querySelector("#ingredient");
    let ingredientList = document.querySelector("#ingredients-list");

    const index = ingredientList.childElementCount;

    const newIngredient = document.createElement("li");
    newIngredient.textContent = ingredient.value;
    newIngredient.id = "ingredient-" + index;

    const deleteButton = document.createElement("i");
    deleteButton.classList.add("fa");
    deleteButton.classList.add("fa-close");
    deleteButton.classList.add("fa-lg");
    deleteButton.classList.add("ms-2");
    deleteButton.onclick = function () {
        deleteIngredient(index);
    };

    newIngredient.appendChild(deleteButton);
    ingredientList.appendChild(newIngredient);
    ingredient.value = "";
}

function addStep() {
    let steps = document.querySelector("#step");
    let stepList = document.querySelector("#steps-list");

    const index = stepList.childElementCount;

    const newStep = document.createElement("li");
    newStep.textContent = step.value;
    newStep.id = "step-" + index;

    const deleteButton = document.createElement("i");
    deleteButton.classList.add("fa");
    deleteButton.classList.add("fa-close");
    // deleteButton.classList.add("fa-lg");
    deleteButton.classList.add("ms-2");
    deleteButton.onclick = function () {
        deleteStep(index);
    };

    newStep.appendChild(deleteButton);
    stepList.appendChild(newStep);
    step.value = "";
}

function deleteIngredient(index) {
    let ingredient = document.querySelector("#ingredient-" + index);
    let ingredientList = document.querySelector("#ingredients-list");

    ingredientList.removeChild(ingredient);
}

function deleteStep(index) {
    let ingredient = document.querySelector("#step-" + index);
    let ingredientList = document.querySelector("#steps-list");

    ingredientList.removeChild(ingredient);
}


/*  ==========================================
    SHOW UPLOADED IMAGE
* ========================================== */
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#imageResult')
                .attr('src', e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

$(function () {
    $('#upload').on('change', function () {
        readURL(input);
    });
});

/*  ==========================================
    SHOW UPLOADED IMAGE NAME
* ========================================== */
var input = document.getElementById('upload');
var infoArea = document.getElementById('upload-label');

input.addEventListener('change', showFileName);
function showFileName(event) {
    var input = event.srcElement;
    var fileName = input.files[0].name;
    infoArea.textContent = 'File name: ' + fileName;
}