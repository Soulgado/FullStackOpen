import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import blogService from "../services/blogs";
import { likeBlog, deleteBlog } from "../reducers/blogReducer";
import {
  setNotification,
  resetNotification,
} from "../reducers/notificationReducer";

const Blog = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [blog, setBlog] = useState(null);
  const user = useSelector((state) => state.users);

  const handleLikeClick = async (data) => {
    try {
      const changedBlog = await blogService.changeBlog(data);
      dispatch(likeBlog(changedBlog));
    } catch (error) {
      dispatch(
        setNotification({
          type: "error",
          message: "Error occured while changing amount of likes",
        })
      );
      setTimeout(() => {
        dispatch(resetNotification());
      }, 5000);
    }
  };

  const handleDeleteClick = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      try {
        await blogService.deleteBlog(blog.id, user.token);
        dispatch(deleteBlog(blog.id));
        dispatch(
          setNotification({
            type: "success",
            message: "Blog has been successfully removed",
          })
        );
        setTimeout(() => {
          dispatch(resetNotification());
        }, 5000);
      } catch (error) {
        dispatch(
          setNotification({
            type: "error",
            message: "Error occured while changing deleting blog",
          })
        );
        setTimeout(() => {
          dispatch(resetNotification());
        }, 5000);
      }
    }
  };

  useEffect(() => {
    blogService.getBlog(id).then((response) => {
      setBlog(response);
    });
  }, []);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  if (!blog) return null;

  return (
    <div style={blogStyle} className="blog">
      <h1>
        {blog.title} {blog.author}
      </h1>
      <div>
        <div>{blog.url}</div>
        <div>
          {blog.likes} likes
          <button
            type="button"
            onClick={() => handleLikeClick({ ...blog, likes: blog.likes + 1 })}
          >
            Like
          </button>
        </div>
        {user && user.username === blog.user.username ? (
          <button type="button" onClick={() => handleDeleteClick(blog)}>
            Remove
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default Blog;
