import { createSlice } from "@reduxjs/toolkit";

const questionSlice = createSlice({
  name: "question",
  initialState: {
    questions: [],
    loading: false,
    filteredQuestions: [],
    page: 1,
  },
  reducers: {
    setQuestions: (state, action) => {
      state.questions = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setFilteredQuestions: (state, action) => {
      state.filteredQuestions = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
  },
});

export const { setQuestions, setLoading, setFilteredQuestions, setPage } =
  questionSlice.actions;

export default questionSlice.reducer;