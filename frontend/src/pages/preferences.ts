const token = getJwtCookie("JWT");

//Retrieves user's preferences from the server
async function getUserPreferences() {
  if (token != undefined) {
    // const res = await fetch(`/api/v1/preferenes`); const prefs = (await res.json()).content;
    const prefs = {
      positive: {
        recipes: ["9w9218w892", "uno", "due", "tre"],
        ingredients: ["zucchine", "porri", "barbabietole"],
        priceRange: CostLevels.medium,
      },
      negative: {
        recipes: ["9w9218w891"],
        ingredients: ["zucche", "melanzane", "zenzero"],
        categories: ["bio", "verdura", "easy"],
        plans: ["Frutta di stagione", "settimana vegana"],
        labels: ["pasta", "facile", "difficile", "medio"],
      },
    };
    const mainDiv = document.createElement("div");
    mainDiv.classList.add("main_div", "card");
    const positiveDiv = document.createElement("div");
    const negativeDiv = document.createElement("div");
    positiveDiv.className = "positive_div";
    negativeDiv.className = "negative_div";

    const positive = prefs.positive;
    const favRecipes: String[] = positive.recipes;
    const favRecipesTitle = getHeading("Recipes");
    const favIngredients: String[] = positive.ingredients;
    const favIngredTitle = getHeading("Ingredients");
    const favPrice: CostLevels = positive.priceRange;
    const favCostTitle = getHeading("Cost");
    positiveDiv.append(
      favRecipesTitle,
      listToDivs(favRecipes, "recipes", true),
      favIngredTitle,
      listToDivs(favIngredients, "ingredients", true),
      favCostTitle,
      favPrice
    );

    const negative = prefs.negative;
    const negRecipes: String[] = negative.recipes;
    const negRecipesTitle = getHeading("Recipes");
    const negIngredients: String[] = negative.ingredients;
    const negRecipesIngredients = getHeading("Ingredients");
    const negCategories: String[] = negative.categories;
    const negRecipesCategories = getHeading("Categories");
    const negPlans: String[] = negative.plans;
    const negRecipesPlans = getHeading("Plans");
    const negLabels: String[] = negative.labels;
    const negRecipesLabels = getHeading("Labels");
    negativeDiv.append(
      negRecipesTitle,
      listToDivs(negRecipes, "recipes", false),
      negRecipesIngredients,
      listToDivs(negIngredients, "ingredients", false),
      negRecipesCategories,
      listToDivs(negCategories, "categories", false),
      negRecipesPlans,
      listToDivs(negPlans, "plans", false),
      negRecipesLabels,
      listToDivs(negLabels, "labels", false)
    );

    mainDiv.append(positiveDiv, negativeDiv);
    document.getElementById("loading_div")?.remove();
    document.body.append(mainDiv);
  }
}

function getHeading(text: String) {
  const heading = document.createElement("h3");
  heading.innerText = text.valueOf();
  return heading;
}

function listToDivs(
  prefs: String[],
  listName: String,
  positive: boolean
): HTMLDivElement {
  const container = document.createElement("div");
  container.className = "preferences_list";
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
  div.classList.add("preference", "card", "clickable");
  add.innerText = "+";
  add.onclick = addPreference;
  div.append(input, add);
  container.appendChild(div);
  return container;

  function getSinglePrefDiv(i: String) {
    const d = document.createElement("div");
    d.innerText = i.valueOf();
    d.classList.add("preference", "card");
    const deleteButton = document.createElement("div");
    deleteButton.className = "clickable";
    deleteButton.innerHTML =
      '<svg width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>';
    d.appendChild(deleteButton);
    deleteButton.onclick = async () => {
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
    }
  );
  return res.status === 200;
}

function getJwtCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  return parts[1];
}

enum CostLevels {
  none = "None",
  veryLow = "molto basso",
  low = "basso",
  medium = "medio",
  high = "elevato",
  veryHigh = "molto elevata",
}

getUserPreferences();
