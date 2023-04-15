import { useState } from "react";
import axios from "axios";

const Blog = ({ blog, handleLikeClick }) => {
  const [detailsVisible, setDetailsVisible] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      {blog.title}
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
              onClick={() => handleLikeClick({...blog, likes: blog.likes + 1})}
            >
              Like
            </button> 
          </div>
          <div>{blog.author}</div>
        </div>
      }
    </div>  
  );
}

export default Blog