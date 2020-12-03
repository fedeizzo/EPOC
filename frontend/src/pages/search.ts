document.getElementById("searchBar")!.onkeydown = function(e) {
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
  const response = await fetch(`/api/v1/search?searchString=${query}`);
  const j = await response.json();
  const recipes: Partial<Recipe>[] = j["recipes"];
  const elements = recipes.map((r) => recipeCard(r));
  console.log('elements: ', elements)
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


  // <li class="media item-list">
  //   <img src="https://www.giallozafferano.it/images/ricette/223/22324/foto_hd/hd650x433_wm.jpg" class="mr-3 rounded" alt="...">
  //   <div class="media-body">
  //     <h3 class="mt-0 mb-1">Nome della ricetta</h3>
  //     Descrizione Descrizione Descrizione Descrizione Descrizione Descrizione Descrizione Descrizione Descrizione Descrizione
  //   </div>
  // </li>
  function recipeCard(r: Partial<Recipe>): HTMLElement {
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
      window.location.href = `/recipe/${(r as any).id}`;
    };

    return card;
  }
}
