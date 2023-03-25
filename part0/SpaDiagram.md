```mermaid
sequenceDiagram
    participant browser
    participant server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/spa
    server activates
    server-->>browser: HTML document
    server deactivates

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    server activates
    server-->>browser: CSS file
    server deactivates

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/spa.js
    server activates
    server-->>browser: JavaScript file
    server deactivates

    Note right of browser: Browser executes JavaScript file, which requests JSON data file

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    server activates
    server-->>browser: JSON file
    server deactivates

    Note right of browser: After receiving JSON file, browser parse it and renders the data
```