
// src/config/profileTabsConfig.js

import {
    setQuestionsAsked,
    setQuestionsAnswered,
    setQuestionsAccepted,
    setQuestionsVerifed,
} from "../redux/studentSlice";

import {
    setTeacherApplications,
    setAllUsers,
    setTeacherAnswers,
} from "../redux/adminSlice";

export const profileTabConfig = {
    // Student
    questions: {
        endpoint: (id) => `/api/v1/student/asked/${id}`,
        reducer: (dispatch, data) =>
            dispatch(setQuestionsAsked(data.questions)),
    },

    s_answers: {
        endpoint: (id) => `/api/v1/student/answered/${id}`,
        reducer: (dispatch, data) =>
            dispatch(setQuestionsAnswered(data.answeredQuestion)),
    },

    accepted: {
        endpoint: (id) => `/api/v1/student/answered/accepted/${id}`,
        reducer: (dispatch, data) =>
            dispatch(setQuestionsAccepted(data.answerAcceptedQuestion)),
    },

    t_verified: {
        endpoint: (id) => `/api/v1/student/answered/verified/${id}`,
        reducer: (dispatch, data) =>
            dispatch(setQuestionsVerifed(data.answerVerifiedQuestion)),
    },

    // Teacher
    t_answers: {
        endpoint: (id) => `/api/v1/teacher/answered/${id}`,
        reducer: (dispatch, data) =>
            dispatch(setTeacherAnswers(data.answeredQuestion)),
    },

    // Admin
    teacherApplications: {
        endpoint: () => `/api/v1/admin/applications`,
        reducer: (dispatch, data) =>
            dispatch(setTeacherApplications(data.users)),
    },

    allUsers: {
        endpoint: () => `/api/v1/admin/users`,
        reducer: (dispatch, data) =>
            dispatch(setAllUsers(data.users)),
    },
};
