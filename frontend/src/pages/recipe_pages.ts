const nutritionalInfos = {
  calories: 100,
  carbohydrate: 100,
  cholesterol: 100,
  fat: 100,
  fiber: 100,
  saturedFat: 100,
  sodium: 100,
  sugar: 100,
};

const ingredient1 = {
  name: "tunafish",
  quantity: 100,
  unitOfMeasure: "grams",
};
const ingredient2 = {
  name: "pasta",
  quantity: 220,
  unitOfMeasure: "grams",
};

const _recipe = {
  name: "Tuna Pasta",
  dateModified: new Date(2020, 11, 10),
  estimatedCost: "low",
  image: "https://images.unsplash.com/photo-1499028344343-cd173ffc68a9",
  categories: ["cheap", "fish dishes"],
  description: "Classic, easy and cheap recipe",
  prepTime: 10,
  cookTime: 15,
  totalTime: 25,
  conservationTime: 9,
  peopleFor: 2,
  ingredients: [ingredient1, ingredient2],
  keywords: ["test", "test2"],
  lables: ["first dish"],
  averageRating: 3.6,
  nutritionalInfos: nutritionalInfos,
  numberOfRatings: 400,
  requiredTools: [],
};

async function getRecipeAndPopulate(): Promise<void> {
  //const response = await fetch("endpoint");
  const recipe = _recipe; //TODO: await response.json();

  const leftmost = _getLeftmostDiv(recipe);
  const centralDiv = _getCentralDiv(recipe);
  const rightmost = _getRightmostDiv(recipe);

  const mainContainer = document.createElement("div");
  mainContainer.classList.add("recipe_container");
  mainContainer.append(leftmost, centralDiv, rightmost);

  document.body.appendChild(mainContainer);

  function _getLeftmostDiv(recipe): HTMLElement {
    const leftmost = document.createElement("div");
    leftmost.classList.add("leftmost");
    leftmost.innerHTML = `<img class='recipe_thumbnail' src='${recipe.image}'></img>`;
    return leftmost;
  }

  function _getCentralDiv(recipe): HTMLElement {
    const centralDiv = document.createElement("div");
    centralDiv.classList.add("centralDiv");

    const tableContent = recipe.ingredients.reduce(
      (previous: string, v) =>
        `${previous}<tr><td>${v.name}</td><td>${v.quantity}</td><td>${v.unitOfMeasure}</td></tr>`,
      ""
    );
    const table = `<table>${tableContent}</table>`;

    centralDiv.innerHTML = `<h2>${recipe.name}</h2>
      <span>Ingredients</span>
      ${table}
      <p class='description'>${recipe.description}</p>`;
    return centralDiv;
  }

  function _getRightmostDiv(recipe): HTMLElement {
    const rightmost = document.createElement("div");
    rightmost.classList.add("rightmost");
    rightmost.style.backgroundImage = recipe.image;
    return rightmost;
  }
}
window.onload = getRecipeAndPopulate;
