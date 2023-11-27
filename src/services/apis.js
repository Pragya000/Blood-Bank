const BASE_URL = import.meta.env.VITE_BASE_URL;

// Auth APIs
export const SEND_OTP = `${BASE_URL}/auth/send-otp`;
export const SIGNUP = `${BASE_URL}/auth/signup`;
export const LOGIN = `${BASE_URL}/auth/login`;
export const FORGOT_PASSWORD = `${BASE_URL}/auth/forgot-password`;
export const LOGOUT = `${BASE_URL}/auth/logout`;

// User APIs
export const GET_USER_DETAILS = `${BASE_URL}/user/user-details`;