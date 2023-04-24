import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: "",
  reducers: {
    resetNotification(state, action) {
      return "";
    },
    voteMessage(state, action) {
      return `You voted '${action.payload}'`
    },
    createMessage(state, action) {
      return `You created '${action.payload}'`
    }
  }
});

export const { resetNotification, voteMessage, createMessage } = notificationSlice.actions;
export default notificationSlice.reducer;