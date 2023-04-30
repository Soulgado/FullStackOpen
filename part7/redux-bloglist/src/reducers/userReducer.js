import { createSlice } from "@reduxjs/toolkit";

const userReducer = createSlice({
  name: "users",
  initialState: null,
  reducers: {
    setUser(state, action) {
      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(action.payload));
      return action.payload;
    },
    removeUser() {
      window.localStorage.removeItem("loggedBlogAppUser");
      return null;
    }
  }
});

export const { setUser, removeUser } = userReducer.actions;
export default userReducer.reducer;
