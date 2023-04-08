const usersRouter = require("express").Router();
const bcrypt = require("bcrypt");

const User = require("../models/user");

usersRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;

  if (!password) {
    return response.status(400).json({ error: "Password is required"});
  } else if (password.length < 3) {
    return response.status(400).json({ error: "Password is too short" });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const newUser = new User({
    username,
    name,
    passwordHash
  });

  try {
    const savedUser = await newUser.save();
    response.status(201).json(savedUser);
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
});

usersRouter.get("/", async (request, response) => {
  const users = await User.find({});
  response.json(users);
})

module.exports = usersRouter;

