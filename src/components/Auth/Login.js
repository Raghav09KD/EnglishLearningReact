import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import request from "../../lib/api/request";
import { apiPaths } from "../../lib/api/apiPath";
import { useGlobalMessage } from "../MessageProvider/MessageProvider";
import { Form, Input, Button, Typography, Card } from "antd";
import OTPModal from "../OtpModal";

const { Title, Text } = Typography;

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const message = useGlobalMessage();
  const [form] = Form.useForm();
  const [modalEmail, setModalEmail] = useState("");


  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loginHandler = (res) => {
    const { user, token } = res || {};
    if (!user || !token) {
      toast.error("Invalid login response");
      return;
    }
    login(user, token);

    toast.success(`Welcome, ${user.name}`);
    navigate("/dashboard");
  };


  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const res = await request({
        method: "post",
        url: apiPaths.login,
        data: values,
      });
      console.log(res)

      loginHandler(res);
    } catch (err) {
      if (err?.statusCode === 'VRYFYEML') {
        setModalEmail(values.email);
        setIsModalOpen(true)
        message.error(err?.message);
        return;
      }
      console.error("Login error:", err.message);
      message.error(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 to-white px-4">
      <Card
        className="shadow-lg rounded-2xl w-full max-w-md"
        style={{ padding: "32px" }}
      >
        {/* Title */}
        <Title
          level={3}
          className="!text-gray-800 text-center !mb-2"
          style={{ fontSize: 22 }}
        >
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
          {/* Email */}
          <Form.Item
            label={<span className="text-sm font-medium">Email Address</span>}
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Enter a valid email" },
            ]}
          >
            <Input size="large" placeholder="you@example.com" />
          </Form.Item>

          {/* Password */}
          <Form.Item
            label={<span className="text-sm font-medium">Password</span>}
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password size="large" placeholder="••••••••" />
          </Form.Item>

          {/* Submit Button */}
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

        {/* Redirect */}
        <div className="text-center mt-6">
          <Text className="text-sm text-gray-500">
            Don’t have an account?{" "}
            <Link to="/register" className="text-indigo-500 hover:underline">
              Register
            </Link>
          </Text>
        </div>
      </Card>
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
