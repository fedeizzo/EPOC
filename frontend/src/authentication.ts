
interface SignupData {
  firstName: string;
  secondName: string;
  email: string;
  username: string;
  password: string;
}

interface LoginData {
  username: string;
  password: string;
}

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  return parts[1];
}

function showNotification(message: string) {
  const content = message || "Invalid request";

  document.getElementById('toast-message')!.innerText = content;
  (<any>$(".toast")).toast({
    delay: 2000
  });
  (<any>$('.toast')).toast('show')
}

async function fetchSignUp() {
  const url: string = "/api/v2/signup";
  const headers = {
    "Content-type": "application/json",
  };

  const data: SignupData = {
    firstName: (<HTMLInputElement>document.getElementById("firstName")).value,
    secondName: (<HTMLInputElement>document.getElementById("secondName")).value,
    email: (<HTMLInputElement>document.getElementById("email")).value,
    username: (<HTMLInputElement>document.getElementById("username")).value,
    password: (<HTMLInputElement>document.getElementById("password")).value,
  };

  const response = await fetch(url, {
    method: "POST",
    mode: "same-origin",
    cache: "no-cache",
    redirect: "follow",
    credentials: "same-origin",
    headers,
    body: JSON.stringify(data),
  });

  if (response.ok) {
    window.location.replace("/");
  } else {
    showNotification((await response.json())["text"]);
  }
}

async function fetchLogin() {
  const url: string = "/api/v2/login";
  const headers = {
    "Content-type": "application/json",
  };

  const data: LoginData = {
    username: (<HTMLInputElement>document.getElementById("username")).value,
    password: (<HTMLInputElement>document.getElementById("password")).value,
  };

  const response = await fetch(url, {
    method: "POST",
    mode: "same-origin",
    cache: "no-cache",
    redirect: "follow",
    credentials: "same-origin",
    headers,
    body: JSON.stringify(data),
  });
  if (response.status == 200) {
    window.location.replace("/");
  } else {
    showNotification((await response.json())["text"]);
    (<HTMLInputElement>document.getElementById("password")).value = "";
  }
}

async function fetchLogout() {
  const url: string = "/api/v2/logout";
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
  });
  if (response.status == 200) {
    window.location.replace("/");
  } else {
    console.log(await response.json()["text"]);
  }
}

async function fetchDelete() {
  const url: string = "/api/v2/deleteUser";
  const headers = {
    "Content-type": "application/json",
  };

  const token = getCookie("JWT");

  if (token !== null && token !== undefined) {
    headers["Authorization"] = "Bearer " + token;
  }

  const data: LoginData = {
    username: (<HTMLInputElement>document.getElementById("username")).value,
    password: (<HTMLInputElement>document.getElementById("password")).value,
  };

  const response = await fetch(url, {
    method: "DELETE",
    mode: "same-origin",
    cache: "no-cache",
    redirect: "follow",
    credentials: "same-origin",
    headers,
    body: JSON.stringify(data),
  });
  if (response.status == 200) {
    window.location.replace("/");
  } else {
    showNotification((await response.json())["text"]);
  }
}
