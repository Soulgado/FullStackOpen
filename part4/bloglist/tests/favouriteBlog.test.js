const listHelper = require("../utils/list_helper");
const { 
  listWithOneBlog,
  listWithManyBlogs 
} = require("./test_helper");

describe("favourite blog", () => {
  test("when the list is empty, returns nothing", () => {
    expect(listHelper.favouriteBlog([])).toBeUndefined();
  });

  test("list with one blog, returns that blog", () => {
    expect(listHelper.favouriteBlog(listWithOneBlog)).toEqual({
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      likes: 5,
    });
  });

  test("list of several blogs, returns blog with the most likes", () => {
    expect(listHelper.favouriteBlog(listWithManyBlogs)).toEqual({
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12,
    });
  });
});