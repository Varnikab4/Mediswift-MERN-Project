import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    markAllNotificationsRead: (state) => {
      if (state.user) {
        // Move all unread notifications to the seen notifications array
        state.user.seennotification = [
          ...(state.user.seennotification || []),
          ...state.user.notification,
        ];
        // Clear the unread notifications array
        state.user.notification = [];
      }
    },
  },
});

export const { setUser, markAllNotificationsRead } = userSlice.actions;

export default userSlice.reducer;
