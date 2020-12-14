async function fetchAddFavorites() {
  const url: string = "/api/v2/favorites";
  const headers = {
    "Content-type": "application/json",
  };

  const token = getCookie("JWT");

  if (token !== null && token !== undefined) {
    headers["Authorization"] = "Bearer " + token;
  }
  const response = await fetch(url, {
    method: "POST",
    mode: "same-origin",
    cache: "no-cache",
    redirect: "follow",
    credentials: "same-origin",
    headers,
    body: JSON.stringify({ planId: planId }),
  });
  if (response.status == 200) {
    const isFavorite = true;
    manageFavorite(isFavorite);
  }
}

async function fetchRemoveFavorites() {
  const url: string = "/api/v2/favorites";
  const headers = {
    "Content-type": "application/json",
  };

  const token = getCookie("JWT");

  if (token !== null && token !== undefined) {
    headers["Authorization"] = "Bearer " + token;
  }
  const response = await fetch(url, {
    method: "DELETE",
    mode: "same-origin",
    cache: "no-cache",
    redirect: "follow",
    credentials: "same-origin",
    headers,
    body: JSON.stringify({ planId: planId }),
  });
  if (response.status == 200) {
    const isFavorite = false;
    manageFavorite(isFavorite);
  }
}

async function isFavoritePlan() {
  const url: string = "/api/v2/favorites/isFavorite?planId=" + planId;
  const headers = {
    "Content-type": "application/json",
  };

  const token = getCookie("JWT");

  if (token !== null && token !== undefined) {
    headers["Authorization"] = "Bearer " + token;
  }
  const response = await fetch(url, {
    method: "GET",
    mode: "same-origin",
    cache: "no-cache",
    redirect: "follow",
    credentials: "same-origin",
    headers,
  });
  if (response.status == 200) {
    const json = await response.json();
    const isFavorite = json.favorite;
    if (isFavorite)
      manageFavorite(isFavorite);
  }
}

async function manageFavorite(isFavorite: boolean) {
  const emptyHearth = document.getElementById("notFavorite");
  const filledHearth = document.getElementById("favorite");
  if (emptyHearth && filledHearth) {
    if (isFavorite) {
      emptyHearth.style.display = "none";
      filledHearth.style.display = "inline";
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
  await isFavoritePlan();
  const fragments = window.location.toString().split("/");
  const planId = fragments[fragments.length - 1];
  const response = await fetch(`/api/v2/plan?planId=${planId}`);
  const plan = await response.json();
  const recipes: Array<any> = [];
  const ids: Array<string> = [];
  for (const recipeId of plan.recipes) {
    const response = await fetch(`/api/v2/recipe/${recipeId}`);
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
if (isCookieSet) {
  document!.getElementById("favoritesIcon")!.hidden = false;
} else {
  document!.getElementById("favoritesIcon")!.hidden = true;
}

loadAndShow();
