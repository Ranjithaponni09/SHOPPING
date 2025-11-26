import React from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../api/axios";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../store/slices/authSlice";
import { useNavigate, Link } from "react-router-dom";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import {
  CCard,
  CCardBody,
  CForm,
  CFormLabel,
  CFormInput,
  CButton,
} from "@coreui/react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// -------------------- VALIDATION SCHEMA --------------------
const schema = yup.object().shape({
  email: yup
  .string()
  .trim()
  .matches(
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in|org|net|edu|co|gov)$/,
    "Email is required"
  )
  .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password is required")
    .required("Password is required"),
});

export default function Login() {
  const dispatch = useDispatch();
  const loading = useSelector((s) => s.auth.loading);
  const navigate = useNavigate();

  // React Hook Form Setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onSubmit", // keeps validation behavior clean
  });

  // -------------------- CUSTOM LOGIN HANDLER --------------------
  const checkAndSubmit = async () => {
    // Force Yup validation
    const valid = await trigger();

    if (!valid) {
      toast.warn("Please fix the errors!");
      return;
    }

    handleSubmit(onSubmit)();
  };

  // -------------------- SUBMIT HANDLER --------------------
  const onSubmit = async (data) => {
    dispatch(loginStart());

    try {
      const res = await api.post("/api/auth/login", data);

      dispatch(
        loginSuccess({
          token: res.data.accessToken,
          refreshToken: res.data.refreshToken,
          user: res.data.user,
        })
      );

      toast.success("Login Successful!");

      setTimeout(() => navigate("/admin"), 1200);
    } catch (err) {
      const message = err.response?.data?.msg || "Invalid Email or Password!";
      dispatch(loginFailure(message));
      toast.warn(message);
    }
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={2000} />

      <CCard
        className="auth-card p-3"
        style={{ maxWidth: "450px", margin: "auto", marginTop: "10%" }}
      >
        <CCardBody>
          <h2 className="text-center mb-3">Login</h2>

          <CForm>

            {/* EMAIL */}
            <CFormLabel>Email</CFormLabel>
            <CFormInput
              type="email"
              placeholder="Enter email"
              {...register("email")}
            />
            {errors.email && (
              <p style={{ color: "red", fontSize: "14px" }}>
                {errors.email.message}
              </p>
            )}

            {/* PASSWORD */}
            <CFormLabel className="mt-3">Password</CFormLabel>
            <CFormInput
              type="password"
              placeholder="Enter password"
              {...register("password")}
            />
            {errors.password && (
              <p style={{ color: "red", fontSize: "14px" }}>
                {errors.password.message}
              </p>
            )}

            <div className="d-flex justify-content-between align-items-center mt-4">
              <CButton onClick={checkAndSubmit} disabled={loading}>
                {loading ? "Logging..." : "Login"}
              </CButton>

              <Link to="/register">Register</Link>
            </div>
          </CForm>
        </CCardBody>
      </CCard>
    </>
  );
}