interface LoginData {
  username: string;
  password: string;
};

async function fetchLogin() {
  const url: string = 'http://localhost:3001/login'
  const headers = {
    'Content-type': 'application/json'
  };
  const data: LoginData = { username: 'empty', password: 'empty' };
  // const token = document.cookie.split(";")[2].split("=")[1];
  const token = null;

  console.log(token)
  if (token !== null) {
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
