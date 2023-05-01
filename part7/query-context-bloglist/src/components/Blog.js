import { useState } from "react";
import PropTypes from "prop-types";

const Blog = ({ blog, currentUser, handleLikeClick, handleDeleteClick }) => {
  const [detailsVisible, setDetailsVisible] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5
  };

  return (
    <div style={blogStyle} className="blog">
      <div>{blog.title}</div>
      <div>{blog.author}</div>
      <button type="button" onClick={() => setDetailsVisible(!detailsVisible)}>
        {detailsVisible ? "hide" : "view"}
      </button>
      {detailsVisible &&
        <div>
          <div>{blog.url}</div>
          <div>
            Likes {blog.likes}
            <button
              type="button"
              onClick={() => handleLikeClick({ ...blog, likes: blog.likes + 1 })}
            >
              Like
            </button>
          </div>
          {currentUser && currentUser.username === blog.user.username
            ? <button type="button" onClick={() => handleDeleteClick(blog)}>Remove</button>
            : null
          }
        </div>
      }
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  handleLikeClick: PropTypes.func.isRequired,
  handleDeleteClick: PropTypes.func.isRequired
};

export default Blog;