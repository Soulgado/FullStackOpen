const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});
  
blogsRouter.post("/", async (request, response, next) => {
  const body = request.body;

  if (!body.title || !body.url) {
    return response.status(400).end();
  }

  const blog = new Blog({
    ...body,
    likes: body.likes ? body.likes : 0
  });

  try {
    const newBlog = await blog.save();
    response.status(201).json(newBlog);
  } catch (error) {
    console.log("controller error: ", error);
    next(error);
  }
});

blogsRouter.delete("/:id", async (request, response, next) => {
  try {
    await Blog.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } catch (error) {
    next(error);
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

