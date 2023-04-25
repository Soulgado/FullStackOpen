import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: "",
  reducers: {
    resetNotification(state, action) {
      return "";
    },
    setMessage(state, action) {
      return action.payload;
    }
  }
});

export const { resetNotification, setMessage } = notificationSlice.actions;

export const showMessage = (message, timeout) => {
  return dispatch => {
    dispatch(setMessage(message));
    setTimeout(() => {
      dispatch(resetNotification());
    }, timeout);
  }
}
export default notificationSlice.reducer;