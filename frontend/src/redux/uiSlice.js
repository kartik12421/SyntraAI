import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    sidebarOpen: false,
    artifactOpen: false,
  },
  reducers: {
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    setArtifactOpen: (state, action) => {
      state.artifactOpen = action.payload;
    },
  },
});

export const { setSidebarOpen, setArtifactOpen } = uiSlice.actions;
export default uiSlice.reducer;
