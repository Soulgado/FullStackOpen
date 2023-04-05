const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const api = supertest(app);

const Blog = require("../models/blog");
const testHelper = require("./test_helper");

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = testHelper.initialTestBlogs.map(blog => new Blog(blog));
  const promiseArray = blogObjects.map(blog => blog.save());
  await Promise.all(promiseArray);
});

test("blogs are returned in json format", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
}, 100000);

test("request to api/blogs returns all blogs", async () => {
  const response = await api.get("/api/blogs");

  expect(response.body).toHaveLength(testHelper.initialTestBlogs.length);
});

test("blogs have id property", async () => {
  const response = await api.get("/api/blogs");

  response.body.forEach(blog => {
    expect(blog.id).toBeDefined();
  });
});

test("a blog can be added to the database", async () => {
  const newBlog = {
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const newResponse = await Blog.find({});
  const newBlogList = newResponse.map(response => response.toJSON());

  expect(newBlogList).toHaveLength(testHelper.initialTestBlogs.length + 1);
  
  const blogsTitles = newBlogList.map(blog => blog.title);
  expect(blogsTitles).toContain("First class tests");
});

afterAll(async () => {
  await mongoose.connection.close();
});