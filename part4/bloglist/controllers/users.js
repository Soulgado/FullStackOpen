const usersRouter = require("express").Router();
const bcrypt = require("bcrypt");

const User = require("../models/user");

usersRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;

  const saltRounds = 15;
  const passwordHash = bcrypt.hash(password, saltRounds);

  const newUser = new User({
    username,
    name,
    passwordHash
  });

  const savedUser = await newUser.save();

  response.status(201).json(savedUser);
});

usersRouter.get("/", async (request, response) => {
  const users = await User.find({});
  response.json(users);
})

module.exports = usersRouter;

