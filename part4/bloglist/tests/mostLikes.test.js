const listHelper = require("../utils/list_helper");
const { 
  listWithOneBlog,
  listWithManyBlogs 
} = require("./test_helper");

describe("most likes by author", () => {
  test("list with no blogs, returns nothing", () => {
    expect(listHelper.mostLikes([])).toBeUndefined();
  });

  test("list with one blog, returns the author and number of likes for this blog", () => {
    expect(listHelper.mostLikes(listWithOneBlog)).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 5
    });
  });

  test("list with many blogs, returns author of most popular and his total number of likes", () => {
    expect(listHelper.mostLikes(listWithManyBlogs)).toEqual({
      author: "Edsger W. Dijkstra",
      likes: 17
    });
  });
});