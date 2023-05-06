import { useState } from "react";
import PropTypes from "prop-types";
import { Button, Form } from "react-bootstrap";

const NewBlogForm = (props) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    props.createNewBlog({
      title,
      author,
      url
    });

    setTitle("");
    setAuthor("");
    setUrl("");
  };

  return (
    <>
      <h2>Create new blog</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label htmlFor="title">Title</Form.Label>
          <Form.Control
            type="text"
            value={title}
            name="title"
            id="title"
            onChange={event => setTitle(event.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label htmlFor="author">Author</Form.Label>
          <Form.Control
            type="text"
            value={author}
            name="author"
            id="author"
            onChange={event => setAuthor(event.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label htmlFor="url">URL</Form.Label>
          <Form.Control
            type="text"
            value={url}
            name="url"
            id="url"
            onChange={event => setUrl(event.target.value)}
          />
        </Form.Group>
        <Button id="newBlogButton" type="submit">Create</Button>
      </Form>
    </>
  );
};

NewBlogForm.propTypes = {
  createNewBlog: PropTypes.func.isRequired
};

export default NewBlogForm;