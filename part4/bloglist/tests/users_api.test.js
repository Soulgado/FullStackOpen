const bcrypt = require("bcrypt");
const supertest = require("supertest");
const mongoose = require("mongoose");
const User = require("../models/user");
const app = require("../app");

const api = supertest(app);

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("secret", 10);
    const user = new User({ 
      username: "admin",
      name: "admin",
      passwordHash
    });

    await user.save();
  });

  test("can successfully create new users", async () => {
    const usersInDb = await User.find({});

    const newUser = {
      username: "super",
      name: "newGuy",
      password: "12345678"
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const newUsersInDb = await User.find({});
    expect(newUsersInDb).toHaveLength(usersInDb.length + 1);

    const usernames = newUsersInDb.map(user => user.username);
    expect(usernames).toContain(newUser.username);
  });

  test("creation falls with correct message and code if username is taken", async () => {
    const usersAtStart = await User.find({});

    const newUser = {
      username: usersAtStart[0].username,
      name: "admin",
      password: "admin"
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("expected `username` to be unique");

    const newUsers = await User.find({});
    expect(newUsers).toEqual(usersAtStart);
  });

  test("creation falls with correct message and code if no username is provided", async () => {
    const usersAtStart = await User.find({});

    const newUser = {
      name: "admin",
      password: "admin"
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("Path `username` is required");

    const newUsers = await User.find({});
    expect(newUsers).toEqual(usersAtStart);
  });

  test("creation falls with correct message and code if username is too short", async () => {
    const usersAtStart = await User.find({});

    const newUser = {
      username: "El",
      name: "El",
      password: "qwerty"
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error)
      .toContain(`Path \`username\` (\`${newUser.username}\`) is shorter than the minimum allowed length`);

    const newUsers = await User.find({});
    expect(newUsers).toEqual(usersAtStart);
  });

  test("creation falls with correct message and code if password is not provided", async () => {
    const usersAtStart = await User.find({});

    const newUser = {
      username: "John",
      name: "admin",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error)
      .toContain("Password is required");

    const newUsers = await User.find({});
    expect(newUsers).toEqual(usersAtStart);
  });

  test("creation falls with correct message and code if password is too short", async () => {
    const usersAtStart = await User.find({});

    const newUser = {
      username: "John",
      name: "admin",
      password: "jk"
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error)
      .toContain("Password is too short");

    const newUsers = await User.find({});
    expect(newUsers).toEqual(usersAtStart);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
