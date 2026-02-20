import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    teacherApplications: [] as any[],
    allUsers: [],
    teacherAnswers: [],
  },
  reducers: {
    setTeacherApplications: (state, action) => {
      state.teacherApplications = action.payload;
    },
    setAllUsers: (state, action) => {
      state.allUsers = action.payload;
    },
    setTeacherAnswers: (state, action) => {
      state.teacherAnswers = action.payload;
    },
    addApplication: (state, action) => {
      state.teacherApplications.push(action.payload);
    },
    updateApplications: (state, action) => {
      state.teacherApplications = state.teacherApplications.filter(
        (application) => {
          return application._id !== action.payload._id;
        }
      );    
    },
  },
});

export const {
  setTeacherApplications,
  setAllUsers,
  setTeacherAnswers,
  addApplication,
  updateApplications,
} = adminSlice.actions;

export default adminSlice.reducer;
