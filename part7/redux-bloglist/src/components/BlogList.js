import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import Togglable from "./components/Togglable";
import NewBlogForm from "./components/NewBlogForm";
import Notification from "./components/Notification";
import blogService from "../services/blogs";
import {
  setNotification,
  resetNotification,
} from "./reducers/notificationReducer";
import { setBlogs, createBlog } from "./reducers/blogReducer";

const BlogList = () => {
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs);
  const notification = useSelector((state) => state.notifications);
  const user = useSelector((state) => state.users);
  const blogFormRef = useRef();

  const createNewBlog = async (blogToAdd) => {
    try {
      const newBlog = await blogService.create(blogToAdd, user.token);
      dispatch(createBlog(newBlog));
      dispatch(
        setNotification({
          type: "success",
          message: `a new blog ${newBlog.title} by ${newBlog.author} added`,
        })
      );
      blogFormRef.current.toggleVisibility();
      setTimeout(() => {
        dispatch(resetNotification());
      }, 5000);
    } catch (error) {
      dispatch(
        setNotification({
          type: "error",
          message: "Error creating blog",
        })
      );
      setTimeout(() => {
        dispatch(resetNotification());
      }, 5000);
    }
  };

  useEffect(() => {
    blogService.getAll().then((blogs) => dispatch(setBlogs(blogs)));
  }, []);

  return (
    <>
      <Notification info={notification} />
      <Togglable buttonLabel="Create new Blog" ref={blogFormRef}>
        <NewBlogForm createNewBlog={createNewBlog} />
      </Togglable>
      <h2>blogs</h2>
      <div className="bloglist">
        {[...blogs]
          .sort((blog1, blog2) => blog2.likes - blog1.likes)
          .map((blog) => (
            <Link to={`/blogs/${blog.id}`} key={blog.id}>
              {blog.title}
            </Link>
          ))}
      </div>
    </>
  );
};

export default BlogList;
