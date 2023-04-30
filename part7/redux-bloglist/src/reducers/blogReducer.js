import { createSlice } from "@reduxjs/toolkit";

const blogSlice = createSlice({
  name: "blogs",
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload;
    },
    createBlog(state, action) {
      const newBlog = action.payload;
      state.push(newBlog);
    },
    likeBlog(state, action) {
      const changedBlog = action.payload;
      const blogs = state.filter((b) => b.id !== changedBlog.id);
      return blogs.concat(changedBlog);
    },
    deleteBlog(state, action) {
      const id = action.payload;
      return state.filter((blog) => blog.id !== id);
    },
  },
});

export const { setBlogs, createBlog, likeBlog, deleteBlog } = blogSlice.actions;
export default blogSlice.reducer;
