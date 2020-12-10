async function getRecipeAndPopulate(): Promise<void> {
  const fragments = window.location.toString().split("/");
  const recipeId = fragments[fragments.length - 1];
  const res = await fetch(`/api/v1/recipe/${recipeId}`);
  const json = await res.json();

  const recipeText = document.getElementById("recipeText");
  const title = document.getElementById("recipeTitle");
  const image = document.getElementById("recipeImage");
  const table = document.getElementById("ingredientsTableContent");
  if (image) {
    image.innerHTML = `<img class="card-img-top mx-auto d-bloc" src='${json.recipe.image}'></img>`;
  }
  if (title && recipeText && table) {
    title.innerText = json.recipe.name;
    recipeText.append(json.recipe.description);
    const tableContent = json.recipe.ingredients.reduce(
      (previous, v) =>
        `${previous}<tr><td>${v.name}</td><td>${v.quantity}</td><td>${v.unitOfMeasure}</td></tr>`,
      ""
    );
    table.innerHTML = tableContent;
  }
}
window.onload = getRecipeAndPopulate;
