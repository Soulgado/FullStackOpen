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
      cy.login({
        username: "admin",
        password: "admin"
      });
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

    describe("and when blog has been created", function() {
      beforeEach(function() {
        cy.createBlog({
          title: "Testing with cypress",
          author: "Jack Black",
          url: "https://cypress.com"
        });
      });

      it("user can like a blog", function() {
        cy.contains("view").click();
        cy.contains("Like").click();
      });

      it("user that created blog, can delete it", function() {
        cy.on("window:confirm", function() {
          return true;
        });
        cy.contains("view").click();
        cy.contains("Remove").click();
      });

      it("user that didn't create that blog, cannot delete it", function() {
        cy.get("#logoutButton").click();
        cy.createUser({
          username: "Jack",
          name: "Jack",
          password: "Jack"
        });
        cy.login({
          username: "Jack",
          password: "Jack"
        });
        cy.contains("view").click();
        cy.contains("Remove").should("not.exist");
      });

      it("blogs are ordered according to number of likes", function() {
        cy.createBlog({
          title: "Blog with most likes",
          author: "John Snow",
          url: "https://likeableblog.com"
        });

        cy.contains("Blog with most likes").as("mostLikesBlog");
        cy.get("@mostLikesBlog").siblings().contains("view").click();
        cy.get("@mostLikesBlog").siblings().contains("Like").as("likeButton");
        cy.get("@likeButton").click();
        cy.get("@likeButton").click();
        cy.get(".blog").eq(0).should("contain", "Blog with most likes");
        cy.get(".blog").eq(1).should("contain", "Testing with cypress");
      });
    });
  });
});