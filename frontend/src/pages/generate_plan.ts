document.getElementById("submitButton")!.onclick = generatePlanAndRedirect;

async function generatePlanAndRedirect() {
  const nameInput = document.getElementById("name")! as HTMLInputElement;
  const name = nameInput.value;
  const howManyMealsInput = document.getElementById(
    "number"
  )! as HTMLInputElement;
  const howManyMeals = Number.parseInt(howManyMealsInput.value);
  const costLevelInput = document.getElementById(
    "costLevel"
  )! as HTMLInputElement;
  let costLevel = CostLevels.none;
  switch (costLevelInput.value) {
    case "veryLow":
      costLevel = CostLevels.veryLow;
      break;
    case "low":
      costLevel = CostLevels.low;
      break;
    case "medium":
      costLevel = CostLevels.medium;
      break;
    case "high":
      costLevel = CostLevels.high;
      break;
    case "veryHigh":
      costLevel = CostLevels.veryHigh;
      break;
    default:
      break;
  }
  const usePreferencesInput = document.getElementById(
    "usePreferences"
  )! as HTMLInputElement;
  const usePreferences = usePreferencesInput.value === "true" ? true : false;
  const reqBody = {
    name: name,
    numberOfMeals: howManyMeals,
    budget: costLevel,
    usingPreferences: usePreferences,
    preferences: {},
  };
  const jwt = _getCookie("JWT");
  const doWeHavejwt = jwt != null && jwt !== "";
  const response = await fetch("/api/v1/plan/generate", {
    method: "POST",
    mode: "same-origin",
    cache: "no-cache",
    redirect: "follow",
    credentials: "same-origin",
    headers: doWeHavejwt ? { Authorization: `Bearer ${jwt}` } : {},
    body: JSON.stringify(reqBody),
  });
  if (response.ok) {
    const json = await response.json();
    const id = json.content._id;
    window.location.href = `/plan/${id}`;
  } else {
    var notification : any = document.querySelector('.mdl-js-snackbar');
    notification!.MaterialSnackbar.showSnackbar(
      {
        message: 'Error: this name is yet used by another plan'
      }
    );
  }
}

function _getCookie(name: string) {
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
