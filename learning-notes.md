#Music Map - Learning Notes:

##HTML
    What belongs in head vs. body?
        **head** contains info about the page - character encoding, brwser=tab title, links to CSS and JavScript
        **body** contains the page contents - headings, paragraphs, buttons, images, and charts
    What does UTF-8 mean?
        **Unicode Transformation Format--8-bit** (UTF-8). Encodes Unicode chars with bytes

##CSS
    What are selectors, properties, and values?
        **Selector**: selects the elements to style (Ex: button)
        **Property**: Specifies which aspect to change (Ex: color)
        **Value**: Specifies the setting (Ex: black)
    What's padding?
        **padding** is the space between element's content and its border
    What does inherit do?
        **inherit** tells element to use whatever the parent element is using (Ex: button inherits body's font)

##JavaScript
    Facts:
        Even with const, arrays and objects can still change
    Java methods vs. JavaScript methods:
        Java methods belong to classes and declare parameter and return types
        JavaScript can have standalone functions without declared parameter or return types
        JavaScript uses the type "function" instead of declaring the return type
    What is a callback?
        A **callback** is a function passed to other code so that code can call it (Ex: When making an eventListener, you add the function that will be used when the click occurs)
    What is a Promise? 
        A **Promise** is an object representing an operation's eventual result.
        It can be:
        Pending - not finished
        Fulfilled - succeded with a value
        Rejected - failed with a reason, usually an error
    What does async do?
        **async** makes a function return a Promise and allows **await** inside that function
    What does await do?
        **await** pauses the async function, not the whole browser, until the awaited Promise settles
    What is a caller? 
        The **caller** is the code that invokes a function
    Spotify Login and PKCE:
        Client ID - Identifies Music Map to Spotify (not a client secret or a user's password)
        Redirect URI - The address Spotify returns to on browser after authentication
        Scope - A permission I request. **user-top-read** requests access to the user's top artists and tracks.
        The code verifier and code challenge work together to protect the exchange that happens after Spotify login. Ensures that someone who intercepts the authorization code can't easily use it.
        **PKCE** (pronounced pixy) stands for **Proof Key for Code Exchange** and both the verifier and challenge are part of it.
    What's a code verifier?
        The verifier is a cryptographically random string created for a log in attempt. Mine generates a 32 random byte and converts it to 64-char hexadecimal string.
    How a code challange is created:
        Function:
        1. Encodes the verifier string as UTF-8 bytes
        2. Calculates the SHA-256 has of those bytes
        3. Encodes the hash as Base64
        4. Replaces + with -, replaces / with _, and removes trailing = padding.
        The result is a 43-char Base64URL string that gets sent when starting authorization.
    Hashing vs. Encryption:
        **Hashing** produces a fingerprint and is designed to be one-way. There is no decryption key.
        **Encryption** protects info in a form tthat can be decrypted using the appropriate key
    New Concepts from handleLogin():
        **state** is another independently generated random string. Spotify returns it with its response. 
        **sessionStorage.setItem(key,value)** saves string in browser storage for this site and tab
        

    

