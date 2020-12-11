let userPreferences: PreferencesClass;

document.getElementById("submitButton")!.onclick = generatePlanAndRedirect;

document.getElementById("usePreferences")!.onclick = async function () {
  const preferencePanelDiv = document.getElementById(
    "preferences_panel_div"
  )! as HTMLDivElement;
  const usePreferencesSwitch = document.getElementById(
    "usePreferences"
  )! as HTMLInputElement;

  if (usePreferencesSwitch.checked) {
    const preferencePanel = await getPreferencesAndDraw();
    preferencePanelDiv.appendChild(preferencePanel);
  } else {
    preferencePanelDiv.innerHTML = "";
  }
};

async function generatePlanAndRedirect() {
  // Get name for the plan
  const nameInput = document.getElementById("name")! as HTMLInputElement;
  const name = nameInput.value;

  // Get number of meals for the plan
  const howManyMealsInput = document.getElementById(
    "number"
  )! as HTMLInputElement;
  const howManyMeals = Number.parseInt(howManyMealsInput.value);

  // Get cost level for the plan
  const costLevelInput = document.getElementById(
    "costLevel"
  )! as HTMLInputElement;
  let costLevel = CostLevelsEnum.none;
  switch (costLevelInput.value) {
    case "veryLow":
      costLevel = CostLevelsEnum.veryLow;
      break;
    case "low":
      costLevel = CostLevelsEnum.low;
      break;
    case "medium":
      costLevel = CostLevelsEnum.medium;
      break;
    case "high":
      costLevel = CostLevelsEnum.high;
      break;
    case "veryHigh":
      costLevel = CostLevelsEnum.veryHigh;
      break;
    default:
      break;
  }

  // Get preferences for the generation of the plan
  const usePreferencesInput = document.getElementById(
    "usePreferences"
  )! as HTMLInputElement;
  const usingPreferences = usePreferencesInput.checked;
  if (usingPreferences) {
    userPreferences.positive.priceRange = costLevel;
  }

  // Building the request
  const reqBody = {
    name: name,
    numberOfMeals: howManyMeals,
    budget: costLevel,
    usingPreferences: usingPreferences,
    preferences: usingPreferences ? userPreferences : {},
  };

  const jwt = _getCookie("JWT");
  const jwtPresent = jwt != null && jwt !== "";

  //Showing loading screen
  const previousContent = document.getElementsByName("central_card")[0];
  const bodyContainer = document.getElementsByName("body_container")[0]!;
  const newContent = document
    .getElementById("loader_container")!
    .cloneNode(true);
  bodyContainer.replaceChild(newContent, previousContent);

  // Sending the request
  const response = await fetch("/api/v2/plan", {
    method: "POST",
    mode: "same-origin",
    cache: "no-cache",
    redirect: "follow",
    credentials: "same-origin",
    headers: jwtPresent ? { Authorization: `Bearer ${jwt}` } : {},
    body: JSON.stringify(reqBody),
  });

  // Managing the result
  if (response.ok) {
    const json = await response.json();
    const id = json.plan._id;
    location.reload();
    window.location.href = `/plan/${id}`;
  } else {
    bodyContainer.replaceChild(previousContent, newContent);
    const json = await response.json();
    const text = json.text;
    var notification: any = document.querySelector(".mdl-js-snackbar");
    notification!.MaterialSnackbar.showSnackbar({
      message: text,
    });
  }
}

async function getPreferencesAndDraw(): Promise<HTMLDivElement> {
  userPreferences = new PreferencesClass();

  // Composing preferences
  const token = _getCookie("JWT");
  if (token) {
    // real preferences if logged
    const res = await fetch(`/api/v2/preference`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
    });
    userPreferences = (await res.json()).content;
    // Update immediatly Cost preference
    const costDiv = document.getElementById("costLevel") as HTMLInputElement;
    switch (userPreferences.positive.priceRange as CostLevelsEnum) {
      case CostLevelsEnum.veryLow:
        costDiv!.value = "veryLow";
        break;
      case CostLevelsEnum.low:
        costDiv!.value = "low";
        break;
      case CostLevelsEnum.medium:
        costDiv!.value = "medium";
        break;
      case CostLevelsEnum.high:
        costDiv!.value = "high";
        break;
      case CostLevelsEnum.veryHigh:
        costDiv!.value = "veryHigh";
        break;
      default:
        costDiv!.value = "None";
        break;
    }
  } else {
    // Empty userPreferences otherwise
    userPreferences.positive = new PositivePreferences();
    userPreferences.positive.ingredients = [];
    userPreferences.positive.recipes = [];
    userPreferences.positive.labels = [];
    userPreferences.negative = new NegativePreferences();
    userPreferences.negative.ingredients = [];
    userPreferences.negative.labels = [];
    userPreferences.negative.recipes = [];
  }

  return buildPreferencesPanel();
}

function buildPreferencesPanel(): HTMLDivElement {
  const preferencesPanel = document.createElement("div");

  const positive = userPreferences.positive;
  const negative = userPreferences.negative;

  preferencesPanel.classList.add(
    "prefences_div",
    "card",
    "container-lg",
    "mx-auto"
  );

  /** Construction of headers */
  const headerRow = document.createElement("div");
  headerRow.className += "row w-100 text-center m-3";

  const favTitle = document.createElement("h2");
  favTitle.textContent = "Mi piace";
  const favTitleDiv = document.createElement("div");
  favTitleDiv.className = "col-md-6 w-50";
  favTitleDiv.append(favTitle);

  const negTitle = document.createElement("h2");
  negTitle.textContent = "Non mi piace";
  const negTitleDiv = document.createElement("div");
  negTitleDiv.className = "col-md-6 w-50";
  negTitleDiv.append(negTitle);

  headerRow.append(favTitleDiv, negTitleDiv);

  /* Construction of Recipe row */
  const favRecipesTitle = getHeadingPlan("Ricette");
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
  recipesPosCol.append(listToDivsPlan(favRecipes, "recipes", true));

  // Constructing negative recipes
  const recipesNegCol = document.createElement("div");
  recipesNegCol.className += "col-md-6 ";

  const negRecipes: String[] = negative.recipes;
  recipesNegCol.append(listToDivsPlan(negRecipes, "recipes", false));

  // Putting together positive and negative
  recipesRow.append(recipesPosCol, recipesNegCol);

  /* Construction of Ingredients row */
  const ingredientsTitle = getHeadingPlan("Ingredienti");
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
  ingredientsPosOnly.append(
    listToDivsPlan(favIngredients, "ingredients", true)
  );

  // Construction of negative ingredients
  const ingredientsNegOnly = document.createElement("div");
  ingredientsNegOnly.className += "col-md-6 ";

  const negIngredients: String[] = negative.ingredients;
  ingredientsNegOnly.append(
    listToDivsPlan(negIngredients, "ingredients", false)
  );

  ingredientsRow.append(ingredientsPosOnly, ingredientsNegOnly);

  /** Labels row */
  const labelsTitle = getHeadingPlan("Etichette");
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
  labelsPositiveColumn.append(listToDivsPlan(favLabels, "labels", true));

  // Negative Labels
  const labelsNegativeColumn = document.createElement("div");
  labelsNegativeColumn.className += "col-md-6";

  const negLabels: String[] = negative.labels;
  labelsNegativeColumn.append(listToDivsPlan(negLabels, "labels", false));

  labelsRow.append(labelsPositiveColumn, labelsNegativeColumn);

  preferencesPanel.append(
    headerRow,
    recipesRowTitle,
    recipesRow,
    ingredientsRowTitle,
    ingredientsRow,
    labelsRowTitle,
    labelsRow
  );
  // TODO: insert loading?
  // document.getElementById("loading_div")?.remove();
  return preferencesPanel;
}

function listToDivsPlan(
  prefs: String[],
  listName: string,
  positive: boolean
): HTMLDivElement {
  const container = document.createElement("div");
  container.className = positive
    ? "preferences_list_" + listName
    : "negative_list_" + listName;
  for (const i of prefs) {
    const d = getSinglePrefDiv(i, listName, positive);
    container.append(d);
  }

  const div = document.createElement("div");
  const input = document.createElement("input") as HTMLInputElement;
  input.placeholder = "add";

  const addPreference = async () => {
    const preference = input.value;
    const last = container.children[container.children.length - 1];
    input.value = "";
    if (possibleToInsert(preference, listName)) {
      container.removeChild(last);
      container.append(getSinglePrefDiv(preference, listName, positive), last);

      if (positive) {
        userPreferences.positive[listName].push(preference);
      } else {
        userPreferences.negative[listName].push(preference);
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
    "text-break",
    "preference-card"
  );

  add.style.marginRight = ".4em";
  add.innerText = "+";
  add.onclick = addPreference;
  div.append(input, add);
  container.appendChild(div);
  return container;

  function getSinglePrefDiv(i: String, listName: string, positive: boolean) {
    const placeholder = document.createElement("div");
    placeholder.classList.add(
      "preference",
      "card",
      "d-inline-flex",
      "m-2",
      "align-self-start"
    );
    placeholder.style.minWidth = "25%";
    const d = document.createElement("div");
    d.innerText = i.valueOf();
    d.classList.add("grid-child");
    const deleteButton = document.createElement("span");
    deleteButton.classList.add("grid-child");
    deleteButton.innerHTML =
      '<svg  viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>';
    placeholder.append(d, deleteButton);
    deleteButton.onclick = async () => {
      placeholder.remove();

      if (positive) {
        userPreferences.positive[listName] = arrayRemove(
          userPreferences.positive[listName],
          i
        );
      } else {
        userPreferences.negative[listName] = arrayRemove(
          userPreferences.negative[listName],
          i
        );
      }
    };
    return placeholder;
  }
}

function getHeadingPlan(text: String) {
  const heading = document.createElement("h3");
  heading.innerText = text.valueOf();
  return heading;
}

function _getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  return parts[1];
}

enum CostLevelsEnum {
  none = "None",
  veryLow = "molto basso",
  low = "basso",
  medium = "medio",
  high = "elevato",
  veryHigh = "molto elevata",
}

abstract class CommonPreferences {
  public recipes: String[];
  public ingredients: String[];
  public labels: String[];
}

class PositivePreferences extends CommonPreferences {
  public priceRange: CostLevelsEnum;
}

class NegativePreferences extends CommonPreferences {}

class PreferencesClass {
  public positive: PositivePreferences;
  public negative: NegativePreferences;
}

function arrayRemove(arr, value) {
  return arr.filter(function (ele) {
    return ele != value;
  });
}

function possibleToInsert(preference: string, category: string) {
  let possible = true;
  if (userPreferences.positive[category].indexOf(preference) > -1) {
    showNotificationPlan("Preference already present in positive preferences");
    possible = false;
  } else if (userPreferences.negative[category].indexOf(preference) > -1) {
    showNotificationPlan("Preference already present in negative preferences");
    possible = false;
  }
  return possible;
}

function showNotificationPlan(message: string) {
  const content = message || "Invalid request";
  var notification: any = document.querySelector(".mdl-js-snackbar");
  notification!.MaterialSnackbar.showSnackbar({
    message: content,
  });
}
