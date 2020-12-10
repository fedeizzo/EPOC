onload = async () => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; JWT=`);
  const token: string = parts[1];

  const response = await fetch("/api/v1/favorites/getFavoritePlans", {
    method: "GET",
    mode: "same-origin",
    cache: "no-cache",
    redirect: "follow",
    credentials: "same-origin",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.ok) {
    const json = await response.json();
    await drawFavoritesList(json.planList);
  } else {
    const json = await response.json();
    const text = json.text;
    showNotificationFavPlans(text);
  }
};

async function drawFavoritesList(favoritePlansList) {
  const container = document.getElementById("central_container");
  document.getElementById("loading_row")!.remove();
  container!.style.backgroundColor = "white";

  for (const plan of favoritePlansList) {
    const plan_row = document.createElement("div");
    plan_row.classList.add("row", "m-2");
    const plan_col = document.createElement("div");
    plan_col.classList.add("col-10");
    const plan_card = await planCard(plan);
    const favoriteHeart = document.createElement("div");
    favoriteHeart.classList.add("col-2", "clickable");
    favoriteHeart.innerHTML =
      '<svg width="2em" height="2em" viewBox="0 0 16 16" class="bi bi-heart-fill" fill="red" fill-opacity="0.7"\
      xmlns="http://www.w3.org/2000/svg"> \
      <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/></svg>';
    favoriteHeart.onclick = () => deleteFromFavorites(plan, plan_row);
    plan_col.append(plan_card);
    plan_row.append(plan_col, favoriteHeart);

    // TODO: insert here missing logic for plans
    container!.appendChild(plan_row);
  }
}

async function planCard(p): Promise<HTMLElement> {
  const card = document.createElement("li");
  card.className = "media item-list";
  const image = <HTMLImageElement>document.createElement("img");
  image.src = "https://via.placeholder.com/250";
  image.className = "mr-3 rounded w-25";
  const central = document.createElement("div");
  central.className = "media-body";
  const heading = document.createElement("h3");
  heading.classList.add("mt-0", "mb-1");
  heading.innerText = p.info.name?.valueOf() ?? "";
  const numMeals = document.createElement("p");
  numMeals.innerText = `${p.info.numRecipes} ricette`;
  const par = document.createElement("p");
  par.innerText = p.info.recipes?.toString() ?? "";

  const recipes: Recipe[] = [];
  for (const id of p.info.recipes ?? []) {
    const resp = await fetch(`/api/v1/recipe/${id}`);
    if (resp.status == 200) {
      const rec = (await resp.json())["recipe"];
      recipes.push(rec);
    }
  }
  image.src = recipes[0].image ?? image.src;
  par.innerText = recipes
    .reduce((prev, i) => `${prev}, ${i.name}`, "")
    .substr(1);

  central.append(heading, numMeals, par);
  card.appendChild(image);
  card.appendChild(central);
  card.onclick = () => {
    window.location.href = `/plan/${(p as any).id}`;
  };

  return card;
}

function showNotificationFavPlans(message: string) {
  const content = message || "Invalid request";

  document.getElementById("toast-message")!.innerText = content;
  (<any>$(".toast")).toast({
    delay: 2000,
  });
  (<any>$(".toast")).toast("show");
}

class Plan {
  name: String;
  user: String;
  numRecipes: number;
  estimatedCost: CostLevels;
  recipes: String[];
}

async function deleteFromFavorites(plan, plan_row) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; JWT=`);
  const token: string = parts[1];

  const response = await fetch("/api/v1/favorites/remove", {
    method: "POST",
    mode: "same-origin",
    cache: "no-cache",
    redirect: "follow",
    credentials: "same-origin",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify({ planId: plan.id }),
  });

  if (response.ok) {
    plan_row.remove();
  } else {
    const json = await response.json();
    const text = json.text;
    showNotificationFavPlans(text);
  }
}
