import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { Input, Select, Button, Typography, message, notification } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import OTPModal from "../OtpModal";
import validator from "validator";

const { Title, Text } = Typography;
const { Option } = Select;

const Register = () => {
  const { login } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student", // default role
  });

  const [passwordStrength, setPasswordStrength] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [isFormValid, setIsFormValid] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const evaluatePasswordStrength = (password) => {
    const strong =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    const medium = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (strong.test(password)) return "strong";
    if (medium.test(password)) return "medium";
    if (password.length > 0) return "weak";
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);

    if (name === "password") {
      setPasswordStrength(evaluatePasswordStrength(value));
    }

    const doMatch =
      updatedData.password === updatedData.confirmPassword &&
      updatedData.confirmPassword !== "";
    setPasswordMatch(doMatch);

    const strongPassword =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    const isValid =
      updatedData.name.trim() &&
      updatedData.email.trim() &&
      strongPassword.test(updatedData.password) &&
      doMatch &&
      updatedData.role;

    setIsFormValid(isValid);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

     // 1. Validate email format
    if (!validator.isEmail(formData.email)) {
      notification.error({
        message: "Invalid Email",
        description: "Please enter a valid email address.",
      });
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", formData);
      // const res = await axios.post("http://localhost:5000/api/auth/login", {
      //   email: formData.email,
      //   password: formData.password,
      // });
      if (res) {
        setIsModalOpen(true)
      }
      // localStorage.setItem("user", JSON.stringify(res.data));
      // login(res.data.user, res.data.token);
      // navigate("/student/dashboard");
    } catch (err) {
      console.error("Error during registration:", err);
      const errorMessage = err.response?.data?.message || "Registration failed";
      console.log(errorMessage);
      setError(errorMessage);

      // If the error is related to "Account already exists"
      if (errorMessage === "Account already exists with this email") {
        alert('Account already exists with this email.');
      }

    }
  };

  const getStrengthColor = () => {
    if (passwordStrength === "strong") return "text-green-500";
    if (passwordStrength === "medium") return "text-yellow-500";
    if (passwordStrength === "weak") return "text-red-500";
    return "";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <Title level={3} className="text-center !mb-6 !text-gray-800">
          Create Your Account
        </Title>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <Input
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            size="large"
          />

          {/* Email */}
          <Input
            name="email"
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            size="large"
          />

          {/* Role */}
          <Select
            value={formData.role}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, role: value }))
            }
            size="large"
            className="w-full"
          >
            <Option value="student">Student</Option>
            <Option value="teacher">Teacher</Option>
          </Select>

          {/* Password */}
          <Input.Password
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            size="large"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
          {formData.password && (
            <p className={`text-sm font-medium ${getStrengthColor()}`}>
              Password strength: {passwordStrength}
            </p>
          )}

          {/* Confirm Password */}
          <Input.Password
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            size="large"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
          {!passwordMatch && (
            <p className="text-red-500 text-sm">Passwords do not match</p>
          )}

          {/* Submit */}
          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            disabled={!isFormValid}
          >
            Register
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-500 hover:underline">
            Login
          </Link>
        </p>
      </div>

      {/* OTP Modal */}
      <OTPModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        email={formData.email}
      />
    </div>
  );
};

export default Register;
