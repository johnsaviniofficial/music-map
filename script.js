const clientId = "f272e57b923f473ab79320313fd90071";
const redirectUri = "http://127.0.0.1:5500/index.html";
const scopes = "user-top-read";
const loginButton = document.getElementById('login-button');

function handleLogin() {
    const verifier = generateCodeVerifier();
    console.log('Verifier length:', verifier.length);
}

function generateCodeVerifier() {
    const randomBytes = new Uint8Array(32);
    crypto.getRandomValues(randomBytes);

    return Array.from(randomBytes, function(byte) {
        return byte.toString(16).padStart(2, '0');
    }).join('');
}

loginButton.addEventListener('click', handleLogin);