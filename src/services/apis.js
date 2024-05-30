const BASE_URL = import.meta.env.VITE_BASE_URL;

// Auth APIs
export const SEND_OTP = `${BASE_URL}/auth/send-otp`;
export const SIGNUP = `${BASE_URL}/auth/signup`;
export const LOGIN = `${BASE_URL}/auth/login`;
export const FORGOT_PASSWORD = `${BASE_URL}/auth/forgot-password`;
export const LOGOUT = `${BASE_URL}/auth/logout`;

// User APIs
export const GET_USER_DETAILS = `${BASE_URL}/user/user-details`;
export const GET_USER_PROFILE_DETAILS = `${BASE_URL}/user/user-profile-details`;
export const CREATE_USER_DETAILS = `${BASE_URL}/user/create-user-details`;

// Hospital APIs
export const CREATE_HOSPITAL_DETAILS = `${BASE_URL}/hospital/create-hospital-details`;

// Admin APIs
export const GET_HOSPITALS_LIST = `${BASE_URL}/admin/get-hospitals-list`;
export const POPULATE_USER = `${BASE_URL}/admin/populate-user`;

// Post APIs
export const CREATE_POST = `${BASE_URL}/post/create-post`;