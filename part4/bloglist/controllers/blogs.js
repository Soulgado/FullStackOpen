const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});
  
blogsRouter.post('/', async (request, response) => {
  const body = request.body;

  if (!body.title || !body.url) {
    return response.status(400).end();
  }

  const blog = new Blog({
    ...body,
    likes: body.likes ? likes : 0
  });

  try {
    const newBlog = await blog.save();
    response.status(201).json(newBlog);
  } catch (error) {
    console.log("controller error: ", error);
    next(error);
  }
});

module.exports = blogsRouter;

