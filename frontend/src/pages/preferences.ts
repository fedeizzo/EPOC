const token = getJwtCookie("JWT");

//Retrieves user's preferences from the server
async function getUserPreferences() {
  if (token != undefined) {
    const res = await fetch(`/api/v1/preference`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
    });

    const prefs = (await res.json()).content;
    const positive = prefs.positive;
    const negative = prefs.negative;

    const mainDiv = document.createElement("div");
    mainDiv.classList.add("prefences_div", "card", "container-lg", "mx-auto");

    /** Construction of headers */
    const headerRow = document.createElement("div");
    headerRow.className += "row w-100 text-center";

    const favTitle = document.createElement("h2");
    favTitle.textContent = "Mi piace";
    const favTitleDiv = document.createElement("div");
    favTitleDiv.className = "col-md-6 w-100";
    favTitleDiv.append(favTitle);

    const negTitle = document.createElement("h2");
    negTitle.textContent = "Non mi piace";
    const negTitleDiv = document.createElement("div");
    negTitleDiv.className = "col-md-6 w-100";
    negTitleDiv.append(negTitle);

    headerRow.append(favTitleDiv, negTitleDiv);

    /* Construction of Recipe row */
    const favRecipesTitle = getHeading("Ricette");
    const recipesRowTitle = document.createElement("div");
    recipesRowTitle.className += "row w-100";
    const recipesColumnTitle = document.createElement("div");
    recipesColumnTitle.className += "col-md-12";
    recipesColumnTitle.append(favRecipesTitle);
    recipesRowTitle.append(recipesColumnTitle);

    const recipesRow = document.createElement("div");
    recipesRow.className += "row d-flex align-content-end flex-wrap w-100";

    // Constructing favourite recipes
    const recipesPosCol = document.createElement("div");
    recipesPosCol.className += "col-md-6 align-self-center";

    const favRecipes: String[] = positive.recipes;
    recipesPosCol.append(listToDivs(favRecipes, "recipes", true));

    // Constructing negative recipes
    const recipesNegCol = document.createElement("div");
    recipesNegCol.className += "col-md-6 ";

    const negRecipes: String[] = negative.recipes;
    recipesNegCol.append(listToDivs(negRecipes, "recipes", false));

    // Putting together positive and negative
    recipesRow.append(recipesPosCol, recipesNegCol);

    /* Construction of Ingredients row */
    const ingredientsTitle = getHeading("Ingredienti");
    const ingredientsRowTitle = document.createElement("div");
    ingredientsRowTitle.className += "row w-100";
    const ingredientsColumnTitle = document.createElement("div");
    ingredientsColumnTitle.className += "col-md-12";
    ingredientsColumnTitle.append(ingredientsTitle);
    ingredientsRowTitle.append(ingredientsColumnTitle);

    const ingredientsRow = document.createElement("div");
    ingredientsRow.className += "row d-flex align-content-end flex-wrap w-100";

    // Construction of positive ingredients
    const ingredientsPosOnly = document.createElement("div");
    ingredientsPosOnly.className += "col-md-6 ";

    const favIngredients: String[] = positive.ingredients;
    ingredientsPosOnly.append(listToDivs(favIngredients, "ingredients", true));

    // Construction of negative ingredients
    const ingredientsNegOnly = document.createElement("div");
    ingredientsNegOnly.className += "col-md-6 ";

    const negIngredients: String[] = negative.ingredients;
    ingredientsNegOnly.append(listToDivs(negIngredients, "ingredients", true));

    ingredientsRow.append(ingredientsPosOnly, ingredientsNegOnly);

    /** Labels row */
    const labelsTitle = getHeading("Etichette");
    const labelsRowTitle = document.createElement("div");
    labelsRowTitle.className += "row w-100";
    const labelsColumnTitle = document.createElement("div");
    labelsColumnTitle.className += "col-md-12";
    labelsColumnTitle.append(labelsTitle);
    labelsRowTitle.append(labelsColumnTitle);

    const labelsRow = document.createElement("div");
    labelsRow.className += "row d-flex align-content-end flex-wrap w-100";

    // Positive Labels
    const labelsPositiveColumn = document.createElement("div");
    labelsPositiveColumn.className += "col-md-6";

    const favLabels: String[] = positive.labels;
    labelsPositiveColumn.append(listToDivs(favLabels, "labels", true));

    // Negative Labels
    const labelsNegativeColumn = document.createElement("div");
    labelsNegativeColumn.className += "col-md-6";

    const negLabels: String[] = negative.labels;
    labelsNegativeColumn.append(listToDivs(negLabels, "labels", false));

    labelsRow.append(labelsPositiveColumn, labelsNegativeColumn);

    /** Cost row */
    const costTitle = getHeading("Fascia di prezzo");
    const costRowTitle = document.createElement("div");
    costRowTitle.className += "row w-100";
    const costColumnTitle = document.createElement("div");
    costColumnTitle.className += "col-md-12";
    costColumnTitle.append(costTitle);
    costRowTitle.append(costColumnTitle);

    const costRow = document.createElement("div");
    costRow.className += "row d-flex align-content-end flex-wrap w-100";
    const costColumn = document.createElement("div");
    costColumn.className += "col-md-12 w-100";

    const costSelect = document.createElement("select");
    costSelect.className += "form-select";
    costSelect.addEventListener("change", function () {
      updateCostPreference(this.value);
    });

    for (var i = 0; i < costLevelsArray.length; i++) {
      var option = document.createElement("option");
      option.setAttribute("value", costLevelsArray[i]);
      option.text = costLevelsArray[i];
      costSelect.appendChild(option);
    }

    costColumn.append(costSelect);
    costRow.appendChild(costColumn);

    mainDiv.append(
      headerRow,
      recipesRowTitle,
      recipesRow,
      ingredientsRowTitle,
      ingredientsRow,
      labelsRowTitle,
      labelsRow,
      costTitle,
      costRow
    );
    document.getElementById("loading_div")?.remove();
    document.body.append(mainDiv);
  }
}

function getHeading(text: string) {
  const heading = document.createElement("h4");
  heading.innerText = text;

  const wrapper = document.createElement("div");
  wrapper.className += "w-100";

  wrapper.appendChild(heading);
  return wrapper;
}

function listToDivs(
  prefs: String[],
  listName: String,
  positive: boolean
): HTMLDivElement {
  const container = document.createElement("div");
  container.className = positive
    ? "preferences_list" + listName
    : "negative_list_" + listName;
  for (const i of prefs) {
    const d = getSinglePrefDiv(i);
    container.append(d);
  }
  const div = document.createElement("div");
  const input = document.createElement("input") as HTMLInputElement;
  input.placeholder = "add";

  const addPreference = async () => {
    const preference = input.value;
    if (preference.length > 0) {
      const body = {
        category: listName,
        content: preference,
      };
      const res = await fetch(
        `/api/v1/preference/${positive ? "positive" : "negative"}`,
        {
          method: "POST",
          body: JSON.stringify(body),
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-type": "application/json",
          },
        }
      );
      if (res.status === 200) {
        const last = container.children[container.children.length - 1];
        input.value = "";
        container.removeChild(last);
        container.append(getSinglePrefDiv(preference), last);
      } else {
        alert("Preference could not be added");
      }
    }
  };

  input.onkeypress = (e) => {
    if (e.code === "Enter") {
      addPreference();
    }
  };

  const add = document.createElement("div");
  div.classList.add(
    "preference",
    "card",
    "clickable",
    "d-sm-inline-flex",
    "m-2",
    "align-self-start",
    "text-break"
  );
  add.innerText = "+";
  add.onclick = addPreference;
  div.append(input, add);
  container.appendChild(div);
  return container;

  function getSinglePrefDiv(i: String) {
    const d = document.createElement("div");
    d.innerText = i.valueOf();
    d.classList.add(
      "preference",
      "card",
      "d-sm-inline-flex",
      "m-2",
      "w-25",
      "align-self-start",
      "text-break"
    );
    const deleteButton = document.createElement("div");
    deleteButton.className = "clickable";
    deleteButton.innerHTML =
      '<svg width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>';
    d.appendChild(deleteButton);
    deleteButton.onclick = async () => {
      // console.log(`Removing ${i} from ${listName}, positive? ${positive}`);
      const success = await deletePreference(i, listName, positive);
      if (success) {
        d.remove();
      }
    };
    return d;
  }
}

async function deletePreference(
  preference: String,
  listName: String,
  positive: boolean
) {
  const body = {
    category: listName,
    content: preference,
  };
  const res = await fetch(
    `/api/v1/preference/${positive ? "positive" : "negative"}`,
    {
      method: "DELETE",
      body: JSON.stringify(body),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
    }
  );
  return res.status === 200;
}

function getJwtCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  return parts[1];
}

async function updateCostPreference(newPreferredCost: string) {
  let cost: CostLevels = CostLevels.veryHigh;
  switch (newPreferredCost) {
    case "Nessuna":
      cost = CostLevels.none;
      break;
    case "Molto bassa":
      cost = CostLevels.veryLow;
      break;
    case "Bassa":
      cost = CostLevels.low;
      break;
    case "Media":
      cost = CostLevels.medium;
      break;
    case "Alta":
      cost = CostLevels.high;
      break;
  }

  const body = {
    category: "priceRange",
    content: (cost = cost),
  };
  const res = await fetch("/api/v1/preference/positive", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  return res.status === 200;
}

enum CostLevels {
  none = "None",
  veryLow = "molto basso",
  low = "basso",
  medium = "medio",
  high = "elevato",
  veryHigh = "molto elevata",
}

const costLevelsArray: string[] = [
  "Nessuna",
  "Molto bassa",
  "Bassa",
  "Media",
  "Alta",
  "Molto Alta",
];

getUserPreferences();
