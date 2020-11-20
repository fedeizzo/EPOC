const fakePlan = {
  name: "Sample Plan #1",
  author: "Flinn",
  recipes: [
    "5fb2e3b95875a9951a44c2af",
    "5fb2e3b95875a9951a44c2b1",
    "5fb2e3b95875a9951a44c2b2",
    "5fb2e3b95875a9951a44c2b3",
    "5fb2e3b95875a9951a44c2b4",
    "5fb2e3b95875a9951a44c2b5",
    "5fb2e3b95875a9951a44c2b6",
    "5fb2e3b95875a9951a44c2b7",
    "5fb2e3b95875a9951a44c2b8",
  ],
};

async function loadAndShow() {
  const fragments = window.location.toString().split("/");
  const planId = fragments[fragments.length - 1];
  //TODO: add type once we have a model
  const plan = fakePlan; //? (await fetch(`api/v1/plans/${planId}`));
  const div = document.createElement("div");
  div.className = "planContainer";
  const name = document.createElement("h3");
  name.innerText = plan.name;
  div.appendChild(name);
  const authorDiv = document.createElement("p");
  authorDiv.innerText = `Author: ${plan.author ?? 'user deleted'}`;
  div.appendChild(authorDiv);
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
