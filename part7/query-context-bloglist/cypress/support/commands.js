Cypress.Commands.add("createBlog", (note) => {
  cy.request({
    url: "http://localhost:3003/api/blogs",
    method: "POST",
    body: note,
    headers: {
      "Authorization": `Bearer ${JSON.parse(localStorage.getItem("loggedBlogAppUser")).token}`
    }
  });

  cy.visit("http://localhost:3000");
});

Cypress.Commands.add("createUser", (user) => {
  cy.request({
    url: "http://localhost:3003/api/users",
    method: "POST",
    body: user
  });

  cy.visit("http://localhost:3000");
});

Cypress.Commands.add("login", (credentials) => {
  cy.request({
    url: "http://localhost:3003/api/login",
    method: "POST",
    body: credentials
  }).then(({ body }) => {
    localStorage.setItem("loggedBlogAppUser", JSON.stringify(body));
    cy.visit("http://localhost:3000");
  });
});