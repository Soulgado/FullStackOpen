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

describe("when there is initially some blogs", () => {
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
});

describe("adding blogs to the database", () => {
  test("a blog can be added to the database", async () => {
    const newBlog = {
      _id: "5a422b891b54a676234d17fa",
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html",
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
  
  test("if likes property is missing from POST request, it defaults to value 0", async () => {
    const newBlog = {
      _id: "5a422b891b54a676234d17fa",
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html",
    };
  
    await api.post("/api/blogs").send(newBlog);
  
    const response = await Blog.find({ title: "First class tests" });
    const blog = response[0];
  
    expect(blog.likes).toBe(0);
  });
  
  test("if url or title are missing from POST request, server returns 400 Bad Request", async () => {
    const newBlogWithoutTitle = {
      _id: "5a422b891b54a676234d17fa",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html",
      likes: 10,
    };
  
    const newBlogWithoutUrl = {
      _id: "5a422b891b54a676234d17fa",
      title: "First class tests",
      author: "Robert C. Martin",
      likes: 10,
    };
  
    await api
      .post("/api/blogs")
      .send(newBlogWithoutTitle)
      .expect(400);
  
    await api
      .post("/api/blogs")
      .send(newBlogWithoutUrl)
      .expect(400);
  }, 100000);
});

describe("deleting blogs", () => {
  test("request correctly deletes blog from the database", async () => {
    const newBlog = {
      _id: "5a422b891b54a676234d17fa",
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html",
      likes: 10,
    };

    await api.post("/api/blogs").send(newBlog);

    await api
      .delete(`api/blogs/${newBlog._id}`)
      .expect(204);
    
    const allBlogs = await Blog.find({});
    expect(allBlogs).toHaveLength(testHelper.initialTestBlogs.length);

    expect(allBlogs).not.toContainEqual(newBlog);
  });
});

describe("updating individual blog posts", () => {
  test("correctly updating number of likes", async () => {
    const newBlog = {
      _id: "5a422b891b54a676234d17fa",
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html",
      likes: 10,
    };

    await newBlog.save();

    await api
      .put(`api/blogs/${newBlog._id}`)
      .send({ ...newBlog, likes: 5 })
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const response = await Blog.findById(newBlog._id);
    const changedBlog = response.body;

    expect(changedBlog.likes).toBe(5);
  });
});



afterAll(async () => {
  await mongoose.connection.close();
});