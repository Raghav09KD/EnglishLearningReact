import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Input, Select, Button, Typography, notification } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone, BookOutlined } from "@ant-design/icons";
import OTPModal from "../OtpModal";
import validator from "validator";
import bgImage from "../../assets/svgs/image-2.png";

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

    // Validate email format
    if (!validator.isEmail(formData.email)) {
      notification.error({
        message: "Invalid Email",
        description: "Please enter a valid email address.",
      });
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", formData);
      if (res) {
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error("Error during registration:", err);
      const errorMessage = err.response?.data?.message || "Registration failed";
      setError(errorMessage);

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

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <div className="flex min-h-screen">
      {/* Left: Form  */}
      <div className="flex flex-1 items-center justify-center px-4 bg-white relative">
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            borderRadius: "16px",
            padding: "32px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            width: "100%",
            maxWidth: "400px",
          }}
        >
          {/* Logo */}
          <div style={{ position: "absolute", top: "20px", left: "20px" }}>
            <div onClick={handleLogoClick} className="flex items-center gap-2 cursor-pointer">
              <BookOutlined className="text-blue-600 text-2xl" />
              <Title level={4} className="!mb-0 !text-blue-800">EnglishMaster</Title>
            </div>
          </div>

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
      </div>

      {/* Right: Image  */}
      <div className="hidden md:flex flex-1 items-center justify-center bg-white">
        <img
          src={bgImage}
          alt="Register visual"
          style={{
            width: "70%",
            height: "auto",
            objectFit: "contain",
            maxHeight: "75%",
          }}
        />
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
