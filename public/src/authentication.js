"use strict";
;
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    return parts[1];
}
async function fetchLogin() {
    const url = 'http://localhost:3001/login';
    const headers = {
        'Content-type': 'application/json'
    };
    const data = { username: 'empty', password: 'empty' };
    const token = getCookie('JWT');
    console.log("---", token, "----");
    if (token !== null && token !== undefined && token !== '') {
        headers['Authorization'] = 'Bearer ' + token;
    }
    else {
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
    }
    else {
        const passwordField = document.getElementById('password');
        passwordField.value = '';
        passwordField.placeholder = 'Wrong password';
    }
}
async function fetchLogout() {
    const url = 'http://localhost:3001/logout';
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
    }
    else {
    }
}
//# sourceMappingURL=authentication.js.map