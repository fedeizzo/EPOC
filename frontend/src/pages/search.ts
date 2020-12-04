document.getElementById("searchBar")!.onkeydown = function (e) {
  if (e.code === "Enter") {
    const element = <HTMLInputElement>document.getElementById("searchBar");
    const query = encodeURIComponent(element.value);
    search(query);
  }
};

const queryFromHome = window.location.href.split("searchString=")[1];
if (queryFromHome !== undefined) {
  // window.history.pushState("", "", '/search');
  search(queryFromHome);
}

async function search(query: string) {
  const recipeResponse = await fetch(`/api/v1/search/recipe?searchString=${query}`);
  const j = await recipeResponse.json();
  const recipes: Partial<Recipe>[] = j["recipes"];
  const recipeElements = recipes.map((r) => recipeCard(r));
  const recipeContainer = document.getElementById("recipeContainer")!;
  for (const e of recipeElements) {
    recipeContainer.appendChild(e);
  }

  const planResponse = await fetch(`/api/v1/search/plan?searchString=${query}`);
  const plans: Partial<Plan>[] = (await planResponse.json())["plan"];
  const planElements = plans.map((p) => planCard(p));
  const planContainer = document.getElementById("planContainer")!;
  for (const e of planElements) {
    planContainer.appendChild(e);
  }
  
  function recipeCard(r: Partial<Recipe>): HTMLElement {
    const card = document.createElement("li");
    card.className = "media item-list";
    const image = <HTMLImageElement>document.createElement("img");
    image.src = r.image ?? "https://via.placeholder.com/250";
    image.className = "mr-3 rounded";
    const central = document.createElement("div");
    central.className = "media-body";
    central.innerHTML = `<h3 class="mt-0 mb-1">${r.name ?? ""}</h3><p>${
      r.description ?? ""
    }</p>`;
    card.appendChild(image);
    card.appendChild(central);
    card.onclick = () => {
      window.location.href = `/recipe/${(r as any).id}`;
    };

    return card;
  }
  
  function planCard(p: Partial<Plan>): HTMLElement {
    console.log(p);
    const card = document.createElement("li");
    card.className = "media item-list";
    const image = <HTMLImageElement>document.createElement("img");
    image.src = "https://via.placeholder.com/250";
    image.className = "mr-3 rounded";
    const central = document.createElement("div");
    central.className = "media-body";
    central.innerHTML = `<h3 class="mt-0 mb-1">${p.name ?? ""}</h3><p>${
      p.recipes ?? ""
    }</p>`;
    card.appendChild(image);
    card.appendChild(central);
    card.onclick = () => {
      window.location.href = `/plan/${(p as any)._id}`;
    };

    return card;
  }
}
