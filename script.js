const clientId = "f272e57b923f473ab79320313fd90071";
const redirectUri = "http://127.0.0.1:5500/index.html";
const scopes = "user-top-read";

const loginButton = document.getElementById('login-button');
let accessToken = null;

// Begin Spotify authorization when the button is clicked.
async function handleLogin() {
    loginButton.disabled = true;

    try {
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
    } catch (error) {
        sessionStorage.removeItem('code_verifier');
        sessionStorage.removeItem('oauth_state');
        console.error('Could not start login:', error.message);
        loginButton.disabled = false;
    }
}

// Generate 32 random bytes and represent them as 64 hex characters.
function generateCodeVerifier() {
    const randomBytes = new Uint8Array(32);
    crypto.getRandomValues(randomBytes);

    return Array.from(randomBytes, function(byte) {
        return byte.toString(16).padStart(2, '0');
    }).join('');
}

// Hash the verifier and encode the result as Base64URL.
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

// Validate Spotify's response before using its authorization code.
function handleRedirect() {
    const params = new URLSearchParams(window.location.search);

    const code = params.get('code');
    const returnedState = params.get('state');
    const error = params.get('error');

    if (!code && !error) {
        return null;
    }

    const savedState = sessionStorage.getItem('oauth_state');

    // Remove authorization parameters without reloading the page.
    window.history.replaceState(null, '', window.location.pathname);
    sessionStorage.removeItem('oauth_state');

    if (!savedState || returnedState !== savedState) {
        sessionStorage.removeItem('code_verifier');
        console.error('Login could not be verified. Please try again.');
        return null;
    }

    if (error) {
        sessionStorage.removeItem('code_verifier');
        console.error('Spotify authorization was not completed.');
        return null;
    }

    console.log('Authorization response verified.');
    return code;
}

// Exchange the authorization code and verifier for an access token.
async function exchangeCodeForToken(code) {
    const verifier = sessionStorage.getItem('code_verifier');

    if (!verifier) {
        throw new Error('Missing code verifier. Please log in again.');
    }

    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            client_id: clientId,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: redirectUri,
            code_verifier: verifier
        })
    });

    if (!response.ok) {
        throw new Error(
            'Token exchange failed. HTTP status: ' + response.status
        );
    }

    const data = await response.json();

    if (!data.access_token) {
        throw new Error('Spotify did not return an access token.');
    }

    sessionStorage.removeItem('code_verifier');

    return data.access_token;
}

// Check for a Spotify response whenever the page loads.
async function initializeApp() {
    const authorizationCode = handleRedirect();

    if (!authorizationCode) {
        return;
    }

    loginButton.disabled = true;

    try {
        accessToken = await exchangeCodeForToken(authorizationCode);
        console.log('Access token received. Ready to request music data.');
    } catch (error) {
        sessionStorage.removeItem('code_verifier');
        console.error(error.message);
    } finally {
        loginButton.disabled = false;
    }
}

loginButton.addEventListener('click', handleLogin);
initializeApp();