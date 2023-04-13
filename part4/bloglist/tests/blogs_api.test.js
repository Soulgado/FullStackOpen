const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const api = supertest(app);

const Blog = require("../models/blog");
const User = require("../models/user");
const testHelper = require("./test_helper");

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  const testUser = await testHelper.createTestUser();
  const blogsWithUser = testHelper.initialTestBlogs.map(blog => {
    blog.author = testUser.id;
    return blog;
  });
  const blogObjects = blogsWithUser.map(blog => new Blog(blog));
  const promiseArray = blogObjects.map(blog => blog.save());
  await Promise.all(promiseArray);
});

describe("when there is initially some blogs", () => {
  test("blogs are returned in json format", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });
  
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
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html",
      likes: 10,
    };

    const userToken = await testHelper.getTestUserToken();
  
    const response = await api
      .post("/api/blogs")
      .send(newBlog)
      .set("Authorization", `Bearer ${userToken}`)
      .expect(201)
      .expect("Content-Type", /application\/json/);
  
    const newBlogList = await Blog.find({});
  
    expect(newBlogList).toHaveLength(testHelper.initialTestBlogs.length + 1);
    
    const blogsTitles = newBlogList.map(blog => blog.title);
    expect(blogsTitles).toContain("First class tests");
  });
  
  test("if likes property is missing from POST request, it defaults to value 0", async () => {
    const newBlog = {
      _id: "5a422b891b54a676234d17fa",
      title: "First class tests",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html",
    };

    const userToken = await testHelper.getTestUserToken();
  
    await api
      .post("/api/blogs")
      .send(newBlog)
      .set("Authorization", `Bearer ${userToken}`)
  
    const response = await Blog.find({ title: "First class tests" });
    const blog = response[0];
  
    expect(blog.likes).toBe(0);
  });
  
  test("if url or title are missing from POST request, server returns 400 Bad Request", async () => {
    const newBlogWithoutTitle = {
      _id: "5a422b891b54a676234d17fa",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html",
      likes: 10,
    };
  
    const newBlogWithoutUrl = {
      _id: "5a422b891b54a676234d17fa",
      title: "First class tests",
      likes: 10,
    };

    const userToken = await testHelper.getTestUserToken();
  
    await api
      .post("/api/blogs")
      .send(newBlogWithoutTitle)
      .set("Authorization", `Bearer ${userToken}`)
      .expect(400);
  
    await api
      .post("/api/blogs")
      .send(newBlogWithoutUrl)
      .set("Authorization", `Bearer ${userToken}`)
      .expect(400);
  });

  test("if token is not provided, POST request fails with 401 HTTP code", async () => {
    const newBlog = {
      _id: "5a422b891b54a676234d17fa",
      title: "First class tests",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html",
      likes: 10,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      // .set("Authorization", "Bearer ")
      .expect(401)
  });
});

describe("deleting blogs", () => {
  test("request correctly deletes blog from the database", async () => {
    const dbBlogs = await Blog.find({});
    const blogToDelete = dbBlogs[0];

    const userToken = await testHelper.getTestUserToken();

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", `Bearer ${userToken}`)
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
});

afterAll(async () => {
  await mongoose.connection.close();
});