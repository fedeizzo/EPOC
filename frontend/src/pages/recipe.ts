async function getRecipeAndPopulate(): Promise<void> {
  const fragments = window.location.toString().split("/");
  const recipeId = fragments[fragments.length - 1];
  const res = await fetch(`/recipe/api/${recipeId}`);
  const json = await res.json();
  const recipe: Recipe = json["recipe"];

  const leftmost = _getLeftmostDiv(recipe);
  const centralDiv = _getCentralDiv(recipe);
  const rightmost = _getRightmostDiv(recipe);

  const mainContainer = document.createElement("div");
  mainContainer.classList.add("recipe_container");
  mainContainer.append(leftmost, centralDiv, rightmost);

  document.body.appendChild(mainContainer);

  function _getLeftmostDiv(recipe: Recipe): HTMLElement {
    const leftmost = document.createElement("div");
    leftmost.classList.add("leftmost");
    leftmost.innerHTML = `<img class='recipe_thumbnail' src='${recipe.image}'></img>`;
    return leftmost;
  }

  function _getCentralDiv(recipe: Recipe): HTMLElement {
    const centralDiv = document.createElement("div");
    centralDiv.classList.add("centralDiv");

    const tableContent = recipe.ingredients.reduce(
      (previous, v) =>
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

  function _getRightmostDiv(recipe: Recipe): HTMLElement {
    const rightmost = document.createElement("div");
    rightmost.classList.add("rightmost");
    rightmost.style.backgroundImage = recipe.image;
    return rightmost;
  }
}
window.onload = getRecipeAndPopulate;
