const blogsRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const Blog = require("../models/blog");
const User = require("../models/user");
const middleware = require("../utils/middleware");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog
    .find({}).populate("author");
  response.json(blogs);
});
  
blogsRouter.post("/", middleware.userExtractor, async (request, response, next) => {
  const body = request.body;

  if (!body.title || !body.url) {
    return response.status(400).end();
  }

  const user = request.user;

  const blog = new Blog({
    ...body,
    likes: body.likes ? body.likes : 0,
    author: user.id
  });

  try {
    const newBlog = await blog.save();
    user.blogs = user.blogs.concat(newBlog.id);
    await user.save();
    response.status(201).json(newBlog);
  } catch (error) {
    console.log("controller error: ", error);
    next(error);
  }
});

blogsRouter.delete("/:id", middleware.userExtractor, async (request, response, next) => {
  const user = request.user;

  const blog = await Blog.findById(request.params.id).populate("author");
  if (blog.author.id.toString() === user.id.toString()) {
    try {
      await Blog.findByIdAndRemove(request.params.id);
      user.blogs = user.blogs.filter(b => b.id !== blog.id);
      await user.save();
      response.status(204).end();
    } catch (error) {
      next(error);
    }
  } else {
    return response.status(401).json({ error: "Token invalid" });
  }
});

blogsRouter.put("/:id", async (request, response, next) => {
  const body = request.body;

  const changedBlog = {
    title: body.title,
    author: body.author,
    likes: body.likes
  }

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      changedBlog,
      { new: true }
    );
    response.json(updatedBlog);
  } catch (error) {
    next(error);
  }
});

module.exports = blogsRouter;

