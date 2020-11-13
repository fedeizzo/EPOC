interface LoginData {
  username: string;
  password: string;
};

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  return parts[1]
}

async function fetchLogin() {
  const url: string = 'http://localhost:3001/login'
  const headers = {
    'Content-type': 'application/json'
  };
  const data: LoginData = { username: 'empty', password: 'empty' };
  const token = getCookie('JWT');

  console.log("---", token, "----")
  if (token !== null && token !== undefined && token !== '') {
    headers['Authorization'] = 'Bearer ' + token;
  } else {
    const username = (<HTMLInputElement>document.getElementById('username')).value;
    const password = (<HTMLInputElement>document.getElementById('password')).value;
    data['username'] = username;
    data['password'] = password;
  }
  const response = await fetch(url, {
    method: 'POST',
    mode: 'same-origin',
    cache: 'no-cache',
    redirect: 'follow',
    credentials: 'same-origin',
    headers,
    body: JSON.stringify(data)
  });
  if (response.status == 200) {
    window.location.replace(response.url);
  } else {
    const passwordField = (<HTMLInputElement>document.getElementById('password'));
    passwordField.value = '';
    passwordField.placeholder = 'Wrong password';
  }
}

async function fetchLogout() {
  const url: string = 'http://localhost:3001/logout'
  const headers = {
    'Content-type': 'application/json'
  };

  const token = getCookie('JWT');

  if (token !== null && token !== undefined) {
    headers['Authorization'] = 'Bearer ' + token;
  }
  const response = await fetch(url, {
    method: 'POST',
    mode: 'same-origin',
    cache: 'no-cache',
    redirect: 'follow',
    credentials: 'same-origin',
    headers,
  });
  if (response.status == 200) {
    window.location.replace(response.url);
  } else {
  }
}
