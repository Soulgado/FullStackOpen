const listHelper = require("../utils/list_helper");
const { 
  listWithOneBlog,
  listWithManyBlogs 
} = require("./test_helper");

describe("total likes", () => {
  test("when list is empty, returns 0", () => {
    expect(listHelper.totalLikes([])).toBe(0);
  });

  test("when list has only one blog, equals the likes of that", () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    expect(result).toBe(5);
  });

  test("when list has several blogs, equals the sum of likes of that", () => {
    const result = listHelper.totalLikes(listWithManyBlogs);
    expect(result).toBe(36);
  });
});