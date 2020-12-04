async function manageFavorite() {
  const emptyHearth = document.getElementById("notFavorite");
  const filledHearth = document.getElementById("favorite");
  if (emptyHearth && filledHearth) {
    if (filledHearth.style.display == "none") {
      emptyHearth.style.display = "none";
      filledHearth.style.display = "inline";
      console.log(planId)
      // const response = await fetch(`/api/v1/favorites/add?planId=${planId}`);
      // const plan = await response.json();
    } else {
      filledHearth.style.display = "none";
      emptyHearth.style.display = "inline";
    }
  }
}

async function populatePlanRecipes(recipes: Array<any>, ids: Array<string>) {
  const elements: Array<HTMLElement> = [];
  for (let i = 0; i < recipes.length; i++) {
    elements.push(recipeCard(recipes[i], ids[i]));
  }
  const container = document.getElementById("recipeContainer");
  if (container) {
    for (const e of elements) {
      container.appendChild(e);
    }
    const a = document.getElementsByClassName('recipeContainer');
    for (let i = 0; i < a.length; i++) {
      a[i].remove();
      document.getElementsByTagName("body")[0].appendChild(container);
    }
  }


  function recipeCard(r: Partial<Recipe>, rId: string): HTMLElement {
    const card = document.createElement("li");
    card.className = "media item-list";
    const image = <HTMLImageElement>document.createElement("img");
    image.src = r.image ?? "https://via.placeholder.com/250";
    image.className = "mr-3 rounded"
    image.setAttribute("src", r.image ?? "https://via.placeholder.com/250");
    const central = document.createElement("div");
    central.className = "media-body";
    central.innerHTML = `<h3 class="mt-0 mb-1">${r.name ?? ""}</h3><p>${r.description ?? ""}</p>`;
    card.appendChild(image);
    card.appendChild(central);
    card.onclick = () => {
      window.location.href = `/recipe/${rId}`;
    };

    return card;
  }
}

async function loadAndShow() {
  const fragments = window.location.toString().split("/");
  const planId = fragments[fragments.length - 1];
  const response = await fetch(`/api/v1/plan/get?planId=${planId}`);
  const plan = await response.json();
  const recipes: Array<any> = [];
  const ids: Array<string> = [];
  for (const recipeId of plan.recipes) {
    const response = await fetch(`/api/v1/recipe/${recipeId}`);
    const j = await response.json();
    recipes.push(j.recipe);
    ids.push(recipeId);
  }
  populatePlanRecipes(recipes, ids);
  const title = document.getElementById("planTitle");
  if (title) {
    title.innerText = "Plan name: " + plan.name;
  }
}

const url = window.location.pathname.split("/");
const planId = url.pop();
loadAndShow();
