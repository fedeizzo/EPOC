async function getRecipeAndPopulate(): Promise<void> {
  const fragments = window.location.toString().split("/");
  const recipeId = fragments[fragments.length - 1];
  const res = await fetch(`/api/v1/recipe/${recipeId}`);
  const json = await res.json();

  const recipeText = document.getElementById("recipeText");
  const title = document.getElementById("recipeTitle");
  const image = document.getElementById("recipeImage");
  const ingTable = document.getElementById("ingredientsTableContent");
  const nutInfoTable = document.getElementById("nutrInfoTableContent");
  if (image) {
    image.innerHTML = `<img class="card-img-top mx-auto d-bloc" src='${json.recipe.image}'></img>`;
  }
  if (title && recipeText && ingTable && nutInfoTable) {
    title.innerText = json.recipe.name;
    recipeText.append(json.recipe.description);
    const ingTableContent = json.recipe.ingredients.reduce(
      (previous, v) =>
        `${previous}<tr><td>${v.name}</td><td>${v.quantity !== null ? v.quantity : ""}</td><td>${v.unitOfMeasure !== null ? v.unitOfMeasure : ""}</td></tr>`,
      ""
    );
    const keys = Object.keys(json.recipe.nutritionalInfos);
    const nutInfo = keys.map((key, index) => {
      return { k: key, v: json.recipe.nutritionalInfos[key] }
    });
    delete nutInfo[0]
    const nutInfoTableContent = nutInfo.reduce(
      (previous, v) =>
        `${previous}<tr><td>${v.k}</td><td>${v.v !== null ? v.v : ""}</td>`,
      ""
    );
    console.log('nutInfoTableContent: ', nutInfoTableContent)
    ingTable.innerHTML = ingTableContent;
    nutInfoTable.innerHTML = nutInfoTableContent;
  }
}
window.onload = getRecipeAndPopulate;
