document.getElementById("searchBar")!.onkeydown = function (e) {
  if (e.code === "Enter") {
    search();
  }
};

async function search() {
  const element = <HTMLInputElement>document.getElementById("searchBar");
  const query = encodeURIComponent(element.value);
  const response = await fetch(`/search/api?searchString=${query}`);
  const j = await response.json();
  const recipes: Partial<Recipe>[] = j["recipes"];
  const elements = recipes.map((r) => recipeCard(r));
  const container = document.createElement("div");
  container.className = "recipeContainer";
  for (const e of elements) {
    container.appendChild(e);
  }
  document.getElementsByTagName("body")[0].appendChild(container);

  function recipeCard(r: Partial<Recipe>): HTMLElement {
    console.log(r);
    const card = document.createElement("div");
    card.className = "recipe_card";
    const image = <HTMLImageElement>document.createElement("img");
    image.src = r.image ?? "https://via.placeholder.com/250";
    image.setAttribute("src", r.image ?? "https://via.placeholder.com/250");
    const central = document.createElement("div");
    central.innerHTML = `<h1>${r.name ?? ""}</h1><p>${r.description ?? ""}</p>`;
    card.appendChild(image);
    card.appendChild(central);
    card.onclick = () => {
      window.location.href = `/recipe/${(r as any).id}`;
    };

    return card;
  }
}
