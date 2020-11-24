async function loadAndShow() {
  const fragments = window.location.toString().split("/");
  const planId = fragments[fragments.length - 1];
  const response = await fetch(`/api/v1/plan/get?planId=${planId}`);
  const plan = await response.json();
  const div = document.createElement("div");
  div.className = "planContainer";
  const name = document.createElement("h3");
  name.innerText = plan.name;
  div.appendChild(name);
  if(plan.author != undefined){
    const authorDiv = document.createElement("p");
    authorDiv.innerText = `Author: ${plan.author}`;
    div.appendChild(authorDiv);
  }
  const recipesText = document.createElement("p");
  recipesText.innerText = "Recipes";
  div.appendChild(recipesText);
  for (const recipeId of plan.recipes) {
    const response = await fetch(`/api/v1/recipe/${recipeId}`);
    const j = await response.json();
    div.appendChild(getRecipeCard(j.recipe, recipeId));
  }
  document.getElementsByTagName("body")[0].appendChild(div);
}

function getRecipeCard(r: Recipe, id: string): HTMLElement {
  const div = document.createElement("div");
  div.className = "recipe_card";
  div.onclick = () => (window.location.href = `/recipe/${id}`);
  const img: HTMLImageElement = document.createElement("img");
  img.className = "recipe_thumbnail";
  img.src = r.image;
  const recipeTextDiv = document.createElement("div");
  const recipeTitle = document.createElement("h3");
  recipeTitle.innerText = r.name;
  const recipeDescr = document.createElement("div");
  recipeDescr.innerText = r.description;
  div.appendChild(img);
  recipeTextDiv.appendChild(recipeTitle);
  recipeTextDiv.appendChild(recipeDescr);
  div.appendChild(recipeTextDiv);
  return div;
}

loadAndShow();
