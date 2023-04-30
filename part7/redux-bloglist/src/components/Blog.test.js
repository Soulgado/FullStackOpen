import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

describe("<Blog />", () => {
  let likeClickMock;

  beforeEach(() => {
    const blog = {
      title: "Using react-testing-library in react applications",
      author: "John Black",
      url: "https://react.com",
      likes: 11,
      user: {
        username: "John Black"
      }
    };

    const currentUser = {
      username: "John Black"
    };

    likeClickMock = jest.fn();
    const deleteClickMock = jest.fn();

    render(
      <Blog
        blog={blog}
        currentUser={currentUser}
        handleDeleteClick={deleteClickMock}
        handleLikeClick={likeClickMock}
      />
    );
  });

  test("not renders blog's url and likes by default", () => {
    const titleElement = screen.getByText("Using react-testing-library in react applications");
    expect(titleElement).toBeDefined();

    const authorElement = screen.getByText("John Black");
    expect(authorElement).toBeDefined();

    const urlElement = screen.queryByText("https://react.com");
    expect(urlElement).toBeNull();

    const likesElement = screen.queryByText("Likes 11");
    expect(likesElement).toBeNull();
  });

  test("after details button clicked, component shows url and likes", async () => {
    const user = userEvent.setup();
    const showButton = screen.getByText("view");
    await user.click(showButton);

    const urlElement = screen.getByText("https://react.com");
    expect(urlElement).toBeDefined();

    const likesElement = screen.getByText("Likes 11");
    expect(likesElement).toBeDefined();
  });

  test("like button event handler is called twice, if this button is clicked two times", async () => {
    const user = userEvent.setup();

    // first - show details
    const showButton = screen.getByText("view");
    await user.click(showButton);

    // then - click like button
    const likeButton = screen.getByText("Like");
    expect(likeButton).toBeDefined();
    await user.click(likeButton);
    await user.click(likeButton);

    expect(likeClickMock.mock.calls).toHaveLength(2);
  });
});