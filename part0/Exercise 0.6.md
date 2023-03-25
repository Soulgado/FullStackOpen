```mermaid
sequenceDiagram
    participant browser
    participant server

    Note right of browser: user writes some input and presses "Submit" button

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    server-->>browser: JSON file {message: "note created"}
    deactivate server
```
