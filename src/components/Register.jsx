import React from "react";
import api from "../api/axios.js";
import { Link, useNavigate } from "react-router-dom";

import {
  CCard,
  CCardBody,
  CForm,
  CFormInput,
  CFormLabel,
  CButton,
  CFormSelect,
} from "@coreui/react";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ------------------ VALIDATION SCHEMA ------------------
const schema = yup.object().shape({
  name: yup.string().required("Name is required"),

  email: yup
    .string()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in|org|net|edu|co|gov)$/,
      "Email is required"
    )
    .required("Email is required"),

  password: yup
    .string()
    .min(6, "Password is required")
    .required("Password is required"),

  role: yup
    .string()
    .oneOf(["user", "admin"], "Role is required")
    .required("Role is required"),
});

// ---------------------------------------------------------

export default function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm({
    resolver: yupResolver(schema),
  });

  // ------------------ CUSTOM SUBMIT HANDLER ------------------
  const checkAndSubmit = async () => {
    const valid = await trigger(); // Run Yup validation

    if (!valid) {
      toast.warn("Please fix the errors!");
      return;
    }

    handleSubmit(onSubmit)();
  };

  // ------------------ API SUBMIT ------------------
  const onSubmit = async (data) => {
    try {
      await api.post("/api/auth/register", data);

      toast.success("Registration Successful!");

      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      const msg =
        err.response?.data?.msg || "Registration failed. Try again!";
      toast.warn(msg);
    }
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={1800} />

      <CCard
        className="auth-card mt-5 p-3"
        style={{ maxWidth: "450px", margin: "auto" }}
      >
        <CCardBody>
          <h2 className="text-center mb-3">Register</h2>

          <CForm>

            {/* Name */}
            <CFormLabel>Name</CFormLabel>
            <CFormInput placeholder="Enter name" {...register("name")} />
            {errors.name && (
              <p className="text-danger">{errors.name.message}</p>
            )}

            {/* Email */}
            <CFormLabel className="mt-2">Email</CFormLabel>
            <CFormInput placeholder="Enter email" {...register("email")} />
            {errors.email && (
              <p className="text-danger">{errors.email.message}</p>
            )}

            {/* Password */}
            <CFormLabel className="mt-2">Password</CFormLabel>
            <CFormInput
              type="password"
              placeholder="Enter password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-danger">{errors.password.message}</p>
            )}

            {/* Role */}
            <CFormLabel className="mt-2">Role</CFormLabel>
            <CFormSelect {...register("role")}>
              <option value="">Select Role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </CFormSelect>
            {errors.role && (
              <p className="text-danger">{errors.role.message}</p>
            )}

            {/* Buttons */}
            <div className="d-flex justify-content-between align-items-center mt-4">
              <CButton onClick={checkAndSubmit}>Register</CButton>

              <Link to="/login" className="text-decoration-none">
                Login
              </Link>
            </div>
          </CForm>
        </CCardBody>
      </CCard>
    </>
  );
}
