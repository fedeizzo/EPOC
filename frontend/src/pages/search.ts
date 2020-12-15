document.getElementById("searchBar")!.onkeydown = function (e) {
  if (e.code === "Enter") {
    const element = <HTMLInputElement>document.getElementById("searchBar");
    const query = encodeURIComponent(element.value);
    if (query.length > 0) {
      search(query);
    }
  }
};

const queryFromHome = window.location.href.split("searchString=")[1];
if (queryFromHome !== undefined && queryFromHome.length > 0) {
  // window.history.pushState("", "", '/search');
  search(queryFromHome);
}

async function search(query: string) {
  const recipeResponse = await fetch(
    `/api/v2/search/recipe?searchString=${query}`
  );
  const j = await recipeResponse.json();
  const recipes: Partial<Recipe>[] = j["recipes"];
  const recipeElements = recipes.map((r) => recipeCard(r));
  const recipeContainer = document.getElementById("recipeContainer")!;
  if (recipeElements.length === 0) {
    recipeContainer.appendChild(nothingFound(query));
  } else {
    for (const e of recipeElements) {
      recipeContainer.appendChild(e);
    }
  }

  const planResponse = await fetch(`/api/v2/search/plan?searchString=${query}`);
  const plans: Partial<Plan>[] = (await planResponse.json())["plan"];
  const planElements = plans.map((p) => planCard(p));
  const planContainer = document.getElementById("planContainer")!;
  if (plans.length === 0) {
    planContainer.appendChild(nothingFound(query));
  } else {
    for (const e of planElements) {
      planContainer.appendChild(await e);
    }
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

  async function planCard(p: Partial<Plan>): Promise<HTMLElement> {
    const card = document.createElement("li");
    card.className = "media item-list";
    const image = <HTMLImageElement>document.createElement("img");
    image.src = "https://via.placeholder.com/250";
    image.className = "mr-3 rounded";
    const central = document.createElement("div");
    central.className = "media-body";
    const heading = document.createElement("h3");
    heading.classList.add("mt-0", "mb-1");
    heading.innerText = p.name?.valueOf() ?? "";
    const numMeals = document.createElement("p");
    numMeals.innerText = `${p.numRecipes} ricette`;
    const par = document.createElement("p");
    par.innerText = p.recipes?.toString() ?? "";

    const recipes: Recipe[] = [];
    for (const id of p.recipes ?? []) {
      const resp = await fetch(`/api/v2/recipe/${id}`);
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
      window.location.href = `/plan/${(p as any)._id}`;
    };

    return card;
  }

  function nothingFound(query: String): HTMLElement {
    const notfoundDiv = document.createElement("div");
    notfoundDiv.id = "nothingFound";

    const image = <HTMLElement>(
      document.getElementById("notFoundImage")!.cloneNode(true)
    );
    const well = document.createElement("h4");
    well.innerText = "Well, that was a tough one";
    const nothignHereFor = document.createElement("span");
    nothignHereFor.innerText = `We have nothing here for "${query}"`;
    notfoundDiv.append(image, well, nothignHereFor);
    return notfoundDiv;
  }
}
