// src/config/profileTabsConfig.js

import { Dispatch } from "@reduxjs/toolkit";
import {
    setQuestionsAccepted,
    setQuestionsAnswered,
    setQuestionsAsked,
    setQuestionsVerifed,
} from "../redux/studentSlice";

import {
    setAllUsers,
    setTeacherAnswers,
    setTeacherApplications,
} from "../redux/adminSlice";

interface TabConfig {
  endpoint: (id?: string) => string;
  reducer: (dispatch: Dispatch, data: any) => void;
}

interface ProfileTabConfig {
  [key: string]: TabConfig;
}

export const profileTabConfig: ProfileTabConfig = {
  // Student
  questions: {
    endpoint: (id?: string) => `/api/v1/student/asked/${id}`,
    reducer: (dispatch, data) => dispatch(setQuestionsAsked(data.questions)),
  },

  s_answers: {
    endpoint: (id?: string) => `/api/v1/student/answered/${id}`,
    reducer: (dispatch, data) =>
      dispatch(setQuestionsAnswered(data.answeredQuestion)),
  },

  accepted: {
    endpoint: (id?: string) => `/api/v1/student/answered/accepted/${id}`,
    reducer: (dispatch, data) =>
      dispatch(setQuestionsAccepted(data.answerAcceptedQuestion)),
  },

  t_verified: {
    endpoint: (id?: string) => `/api/v1/student/answered/verified/${id}`,
    reducer: (dispatch, data) =>
      dispatch(setQuestionsVerifed(data.answerVerifiedQuestion)),
  },

  // Teacher
  t_answers: {
    endpoint: (id?: string) => `/api/v1/teacher/answered/${id}`,
    reducer: (dispatch, data) =>
      dispatch(setTeacherAnswers(data.answeredQuestion)),
  },

  // Admin
  teacherApplications: {
    endpoint: () => `/api/v1/admin/applications`,
    reducer: (dispatch, data) => dispatch(setTeacherApplications(data.users)),
  },

  allUsers: {
    endpoint: () => `/api/v1/admin/users`,
    reducer: (dispatch, data) => dispatch(setAllUsers(data.users)),
  },
};
