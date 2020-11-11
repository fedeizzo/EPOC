document.onload = fetchLogin();
async function fetchLogin() {
    const url = 'http://localhost:3001/login'
    const headers = {
        'Content-type': 'application/json'
    };
    const data = {};
    const token = document.cookie.split(";")[2].split("=")[1];

    console.log(token)
    if (token !== null) {
        headers['Authorization'] = 'Bearer ' + token;
        data['username'] = '';
        data['password'] = '';
    } else {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
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
    } else (
        console.log(response)
    )
    // if (data.response) {
    // } else if (data.code == 303) {
    //     alert("user not found");
    // } else if (data.token) {
    //     console.log(document.cookie);
    //     token = data.token;
    // }
}
