import { useState } from "react";

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
  }

  return (
    <>
    <h2>Create new blog</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>
          <input 
            type="text"
            value={title}
            name="title"
            id="title"
            onChange={event => setTitle(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="author">Author</label>
          <input 
            type="text"
            value={author}
            name="author"
            id="title"
            onChange={event => setAuthor(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="url">URL</label>
          <input 
            type="text"
            value={url}
            name="url"
            id="url"
            onChange={event => setUrl(event.target.value)}
          />
        </div>
        <button type="submit">Create</button>
      </form>
    </>
  );
}

export default NewBlogForm;