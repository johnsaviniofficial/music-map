const clientId = "f272e57b923f473ab79320313fd90071";
const redirectUri = "http://127.0.0.1:5500/index.html";
const scopes = "user-top-read";
const loginButton = document.getElementById('login-button');

function handleLogin() {
    console.log('Login button clicked');
}

loginButton.addEventListener('click', handleLogin);