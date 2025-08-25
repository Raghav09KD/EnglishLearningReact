import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import request from "../../lib/api/request";
import { apiPaths } from "../../lib/api/apiPath";
import { useGlobalMessage } from "../MessageProvider/MessageProvider";
import { Form, Input, Button, Typography, Card, Modal } from "antd";
import OTPModal from "../OtpModal";
import { paths } from "../../lib/path";
import { BookOutlined } from "@ant-design/icons";
import bgImage from "../../assets/svgs/image-2.png";

const { Title, Text } = Typography;

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const message = useGlobalMessage();
  const [form] = Form.useForm();
  const [modalEmail, setModalEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // OTP Modal state
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false); // Forgot Password Modal state
  const [email, setEmail] = useState(""); // Email for Forgot Password

  const handleLogoClick = () => {
    navigate('/');
  };

  const loginHandler = (res) => {
    const { user, token } = res || {};
    if (!user || !token) {
      toast.error("Invalid login response");
      return;
    }
    login(user, token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    toast.success(`Welcome, ${user.name}`);
    if (user.role === "admin" || user.role === "teacher") {
      navigate(paths.ADMIN_DASHBOARD);
    } else if (user.role === "student") {
      navigate(paths.STUDENT_DASHBOARD);
    } else {
      toast.error("Unknown role. Contact support.");
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const res = await request({
        method: "post",
        url: apiPaths.login,
        data: values,
      });
      loginHandler(res);
    } catch (err) {
      if (err?.statusCode === 'VRYFYEML') {
        setModalEmail(values.email);
        setIsModalOpen(true);
        message.error(err?.message);
        return;
      }
      console.error("Login error:", err.message);
      message.error(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

const handleForgotPasswordSubmit = async () => {
  if (!email) {
    toast.error("Please enter your email");
    return;
  }

  setLoading(true);  // Disable button while loading

  try {
    const res = await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
    toast.success(res?.data?.message);
    setIsForgotPasswordModalOpen(false);  // Close modal after successful submission
  } catch (err) {
    console.error("Error during password reset:", err);  // Log error in console
    if (err.response) {
      console.log("Error response:", err.response.data);
      toast.error(err.response.data.message || "Something went wrong");
    } else {
      toast.error("Unable to send reset link. Please try again later.");
    }
  } finally {
    setLoading(false);  // Re-enable button after request
  }
};




  return (
    <div className="flex min-h-screen">
      {/* Left: Login Form */}
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
          <div style={{ position: 'absolute', top: '20px', left: '20px' }}>
            <div onClick={handleLogoClick} className="flex items-center gap-2 cursor-pointer">
              <BookOutlined className="text-blue-600 text-2xl" />
              <Title level={4} className="!mb-0 !text-blue-800">EnglishMaster</Title>
            </div>
          </div>

          <Card className="w-full border-0 shadow-none">
            <Title level={3} className="!text-gray-800 text-center !mb-2" style={{ fontSize: 22 }}>
              Welcome Back
            </Title>
            <Text type="secondary" className="block text-center mb-6">
              Please enter your credentials to continue
            </Text>

            {/* Login Form */}
            <Form
              layout="vertical"
              onFinish={handleSubmit}
              requiredMark={false}
              className="space-y-4"
            >
              <Form.Item
                label={<span className="text-sm font-medium">Email Address</span>}
                name="email"
                rules={[{ required: true, message: "Please enter your email" }, { type: "email", message: "Enter a valid email" }]}
              >
                <Input size="large" placeholder="you@example.com" />
              </Form.Item>

              <Form.Item
                label={<span className="text-sm font-medium">Password</span>}
                name="password"
                rules={[{ required: true, message: "Please enter your password" }]}
              >
                <Input.Password size="large" placeholder="••••••••" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={loading}
                  block
                >
                  Login
                </Button>
              </Form.Item>
            </Form>

            {/* Forgot Password Link */}
            <div className="text-center mt-6">
              <Text className="text-sm text-gray-500">
                <a onClick={() => setIsForgotPasswordModalOpen(true)} className="text-indigo-500 hover:underline">
                  Forgot Password?
                </a>
              </Text>
            </div>

            <div className="text-center mt-6">
              <Text className="text-sm text-gray-500">
                Don’t have an account?{" "}
                <Link to="/register" className="text-indigo-500 hover:underline">
                  Register
                </Link>
              </Text>
            </div>
          </Card>
        </div>
      </div>

      {/* Right: Image */}
      <div className="hidden md:flex flex-1 items-center justify-center bg-white">
        <img
          src={bgImage}
          alt="Login visual"
          style={{
            width: '70%',
            height: 'auto',
            objectFit: 'contain',
            maxHeight: '75%',
          }}
        />
      </div>

      {/* Forgot Password Modal */}
      <Modal
        title="Forgot Password"
        visible={isForgotPasswordModalOpen}
        onCancel={() => setIsForgotPasswordModalOpen(false)}
        footer={null}
        centered
        width={400}
      >
        <div>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            size="large"
            style={{ marginBottom: '20px' }}
          />
          <Button
            type="primary"
            block
            loading={loading}
            onClick={handleForgotPasswordSubmit}
            disabled={!email || loading}  // Disable if no email or loading
          >
            Send Reset Link
          </Button>
        </div>
      </Modal>

      {/* OTP Modal */}
      <OTPModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        email={modalEmail}
        nextAction={handleSubmit}
      />
    </div>
  );
};

export default Login;
