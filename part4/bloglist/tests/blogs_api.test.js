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
  
    const response = await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    console.log(response);
  
    const newBlogList = await Blog.find({});
  
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
    const dbBlogs = await Blog.find({});
    const blogToDelete = dbBlogs[0];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204);
    
    const allBlogs = await Blog.find({});
    expect(allBlogs).toHaveLength(testHelper.initialTestBlogs.length - 1);

    expect(allBlogs).not.toContainEqual(blogToDelete);
  });
});

describe("updating individual blog posts", () => {
  test("correctly updates number of likes", async () => {
    const dbBlogs = await Blog.find({});
    const blogToChange = dbBlogs[0];

    await api
      .put(`/api/blogs/${blogToChange.id}`)
      .send({ ...blogToChange, likes: blogToChange.likes + 1 })
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const changedBlog = await Blog.findById(blogToChange.id);

    expect(changedBlog.likes).toBe(blogToChange.likes + 1);
  });

  test("correctly updates title of blog", async () => {
    const dbBlogs = await Blog.find({});
    const blogToChange = dbBlogs[0];

    await api
      .put(`/api/blogs/${blogToChange.id}`)
      .send({ ...blogToChange, title: "Unique title" })
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const changedBlog = await Blog.findById(blogToChange.id);

    expect(changedBlog.title).not.toBe(blogToChange.title);
    expect(changedBlog.title).toBe("Unique title");
  });

  test("correctly updates author of blog", async () => {
    const dbBlogs = await Blog.find({});
    const blogToChange = dbBlogs[0];

    await api
      .put(`/api/blogs/${blogToChange.id}`)
      .send({ ...blogToChange, author: "Unique author" })
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const changedBlog = await Blog.findById(blogToChange.id);

    expect(changedBlog.author).not.toBe(blogToChange.author);
    expect(changedBlog.author).toBe("Unique author");
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});