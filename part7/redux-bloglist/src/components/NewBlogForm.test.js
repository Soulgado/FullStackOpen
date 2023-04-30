import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NewBlogForm from "./NewBlogForm";

test("NewBlogForm calls onSubmit with correct parameter values", async () => {
  const mockCreateNewForm = jest.fn();
  const user = userEvent.setup();

  const { container } = render(<NewBlogForm createNewBlog={mockCreateNewForm} />);

  const titleInput = container.querySelector("#title");
  const authorInput = container.querySelector("#author");
  const urlInput = container.querySelector("#url");
  const submitButton = screen.getByText("Create");

  await user.type(titleInput, "test title");
  await user.type(authorInput, "test author");
  await user.type(urlInput, "test url");
  await user.click(submitButton);

  expect(mockCreateNewForm.mock.calls).toHaveLength(1);

  expect(mockCreateNewForm.mock.calls[0][0]).toMatchObject({
    title: "test title",
    author: "test author",
    url: "test url"
  });
});