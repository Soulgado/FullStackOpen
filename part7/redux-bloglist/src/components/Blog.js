import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import blogService from "../services/blogs";
import { setBlog, likeBlog, createComment } from "../reducers/blogReducer";
import {
  setNotification,
  resetNotification,
} from "../reducers/notificationReducer";
import { Button, Card } from "react-bootstrap";

const Blog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.users);
  const blog = useSelector((state) => state.blogs.blog);
  const [commentText, setCommentText] = useState("");

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
        // dispatch(deleteBlog(blog.id));
        dispatch(
          setNotification({
            type: "success",
            message: "Blog has been successfully removed",
          })
        );
        setTimeout(() => {
          dispatch(resetNotification());
        }, 5000);
        navigate("/blogs");
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

  const handleAddCommentClick = async () => {
    try {
      const newComment = await blogService.createComment(blog.id, commentText, user.token);
      dispatch(createComment(newComment));
      setCommentText("");
    } catch (error) {
      dispatch(
        setNotification({
          type: "error",
          message: "Error occured while creating comment",
        })
      );
      setTimeout(() => {
        dispatch(resetNotification());
      }, 5000);
    }
  };

  useEffect(() => {
    blogService.getBlog(id).then((response) => {
      dispatch(setBlog(response));
    });
  }, []);

  if (!blog) return null;

  return (
    <Card className="blog">
      <Card.Body>
        <Card.Title>{blog.title} {blog.author}</Card.Title>
        <Card.Link>{blog.url}</Card.Link>
        <div>
          {blog.likes} likes
          <Button
            variant="primary"
            type="button"
            onClick={() => handleLikeClick({ ...blog, likes: blog.likes + 1 })}
          >
            Like
          </Button>
        </div>
        {user && user.username === blog.user.username ? (
          <Button variant="danger" type="button" onClick={() => handleDeleteClick(blog)}>
            Remove
          </Button>
        ) : null}
        <div>
          <h2>Comments</h2>
          <input type="text" onChange={(event) => setCommentText(event.target.value)}/>
          <Button variant="primary" type="button" onClick={handleAddCommentClick}>Add comment</Button>
          <ul>
            {blog.comments.map(comment => (<li key={comment._id}>{comment.content}</li>))}
          </ul>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Blog;
