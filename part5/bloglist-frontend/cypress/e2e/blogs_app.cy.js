describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3003/api/testing/reset");
    const user = {
      username: "admin",
      name: "admin",
      password: "admin"
    };
    cy.request("POST", "http://localhost:3003/api/users", user);
    cy.visit("http://localhost:3000");
  });

  it("Login form is shown", function() {
    cy.contains("Log in to application");
  });

  describe("Login", function() {
    it("succeds with correct credentials", function() {
      cy.get("#username").type("admin");
      cy.get("#password").type("admin");
      cy.get("#loginButton").click();

      cy.contains("admin logged in");
    });

    it("fails with wrong credentials", function() {
      cy.get("#username").type("admin");
      cy.get("#password").type("12345678");
      cy.get("#loginButton").click();

      cy.get("#notification")
        .contains("invalid username or password")
        .and("have.css", "color", "rgb(255, 0, 0)");
    });
  });

  describe("when user logged in", function() {
    beforeEach(function() {
      cy.get("#username").type("admin");
      cy.get("#password").type("admin");
      cy.get("#loginButton").click();
    });

    it("a blog can be created", function() {
      cy.contains("Create new Blog").click();

      cy.get("input#title").type("Testing with cypress");
      cy.get("input#author").type("Jack Black");
      cy.get("input#url").type("https://cypress.com");
      cy.get("button#newBlogButton").click();

      cy.contains("Testing with cypress");
      cy.contains("Jack Black");
    });

    it("user can like a blog", function() {
      cy.contains("Create new Blog").click();

      cy.get("input#title").type("Testing with cypress");
      cy.get("input#author").type("Jack Black");
      cy.get("input#url").type("https://cypress.com");
      cy.get("button#newBlogButton").click();

      cy.contains("view").click();
      cy.contains("Like").click();
    });
  });
});