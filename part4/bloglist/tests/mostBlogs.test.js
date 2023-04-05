const listHelper = require("../utils/list_helper");
const { 
  listWithOneBlog,
  listWithManyBlogs 
} = require("./test_helper");

describe("most blogs", () => {
  test("with empty list, returns nothing", () => {
    expect(listHelper.mostBlogs([])).toBeUndefined();
  });

  test("list with one blog, returns the author of this blog and 1", () => {
    expect(listHelper.mostBlogs(listWithOneBlog)).toEqual({
      author: 'Edsger W. Dijkstra',
      blogs: 1
    });
  });

  test("list with many blogs, returns the author of most and correct number of blogs", () => {
    expect(listHelper.mostBlogs(listWithManyBlogs)).toEqual({
      author: "Robert C. Martin",
      blogs: 3
    });
  });
});