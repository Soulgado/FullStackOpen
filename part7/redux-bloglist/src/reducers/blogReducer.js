import { createSlice } from "@reduxjs/toolkit";

const blogSlice = createSlice({
  name: "blogs",
  initialState: {
    blogs: [],
    blog: null,
  },
  reducers: {
    setBlogs(state, action) {
      state.blogs = action.payload;
    },
    setBlog(state, action) {
      state.blog = action.payload;
    },
    createBlog(state, action) {
      const newBlog = action.payload;
      state.blogs.push(newBlog);
    },
    likeBlog(state, action) {
      const changedBlog = action.payload;
      state.blog = changedBlog;
    },
    // deleteBlog(state, action) {
    //   const id = action.payload;
    //   return state.filter((blog) => blog.id !== id);
    // },
    createComment(state, action) {
      const changedBlog = {
        ...state.blog,
        comments: state.blog.comments.concat(action.payload),
      };
      state.blog = changedBlog;
    },
  },
});

export const { setBlogs, setBlog, createBlog, likeBlog, createComment } =
  blogSlice.actions;
export default blogSlice.reducer;
