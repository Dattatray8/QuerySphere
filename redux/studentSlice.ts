
import { createSlice } from "@reduxjs/toolkit";

const studentSlice = createSlice({
  name: "student",
  initialState: {
    questionsAsked: [],
    questionsAnswered: [],
    questionsAccepted: [],
    questionsVerified: [],
  },
  reducers: {
    setQuestionsAsked: (state, action) => {
      state.questionsAsked = action.payload;
    },
    setQuestionsAnswered: (state, action) => {
      state.questionsAnswered = action.payload;
    },
    setQuestionsAccepted: (state, action) => {
      state.questionsAccepted = action.payload;
    },
    setQuestionsVerifed: (state, action) => {
      state.questionsVerified = action.payload;
    },
  },
});

export const {
  setQuestionsAccepted,
  setQuestionsAnswered,
  setQuestionsAsked,
  setQuestionsVerifed,
} = studentSlice.actions;

export default studentSlice.reducer;
