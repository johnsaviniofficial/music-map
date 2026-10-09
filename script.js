const clientId = "f272e57b923f473ab79320313fd90071"; //Spotify App's Identifier
const redirectUri = "http://127.0.0.1:5500/index.html";
const scopes = "user-top-read";
const loginButton = document.getElementById('login-button');

async function handleLogin() { 
    const verifier = generateCodeVerifier();
    const challenge = await generateCodeChallenge(verifier);
    const state = generateCodeVerifier();

    sessionStorage.setItem('code_verifier', verifier);
    sessionStorage.setItem('oauth_state', state);

    const authUrl = new URL('https://accounts.spotify.com/authorize');

    authUrl.search = new URLSearchParams({
        client_id: clientId,
        response_type: 'code',
        redirect_uri: redirectUri,
        scope: scopes,
        code_challenge_method: 'S256',
        code_challenge: challenge,
        state: state
    }).toString();

    window.location.assign(authUrl.toString());
}

function generateCodeVerifier() {
    const randomBytes = new Uint8Array(32);
    crypto.getRandomValues(randomBytes);

    return Array.from(randomBytes, function(byte) {
        return byte.toString(16).padStart(2, '0');
    }).join('');
}

async function generateCodeChallenge(verifier) {
const encoder = new TextEncoder();
const data = encoder.encode(verifier);

const hash = await crypto.subtle.digest('SHA-256', data);

const bytes = new Uint8Array(hash);
const binary = String.fromCharCode(...bytes);

return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

loginButton.addEventListener('click', handleLogin);