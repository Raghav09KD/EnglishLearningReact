import React, { useState } from "react";
import { Form, Input, Button, Card, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import request from "../../lib/api/request";
import { useGlobalMessage } from "../../components/MessageProvider/MessageProvider";

const { Title } = Typography;

const AdminSignup = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const message = useGlobalMessage();

    const onFinish = async (values) => {
        try {
            setLoading(true);

            // Add role = admin while sending
            const payload = { ...values, role: "admin" };

            const res = await axios.post("http://localhost:5000/api/auth/adminSignup", payload);
            console.log(res)

            message.success("Admin registered successfully!");
            navigate("/login"); // redirect to login after signup
        } catch (err) {
            console.log(err);
            message.error(err?.response?.data?.error || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <Card className="w-full max-w-md shadow-lg rounded-2xl">
                <div className="text-center mb-6">
                    <Title level={3}>🔒 Admin Sign Up</Title>
                    <p className="text-gray-500 text-sm">
                        This page is only for admin registration
                    </p>
                </div>

                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        label="Full Name"
                        name="name"
                        rules={[{ required: true, message: "Please enter your name" }]}
                    >
                        <Input placeholder="Enter full name" />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: "Please enter your email" },
                            { type: "email", message: "Enter a valid email" },
                        ]}
                    >
                        <Input placeholder="Enter email address" />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"

                        rules={[
                            { required: true, message: "Please enter a password" },
                            {
                                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                message:
                                    "Password must be at least 8 characters long, include one uppercase, one lowercase, one number, and one special character",
                            },
                        ]}
                    >
                        <Input.Password placeholder="Enter password" />
                    </Form.Item>

                    <Form.Item
                        label="Confirm Password"
                        name="confirmPassword"
                        dependencies={["password"]}
                        rules={[
                            { required: true, message: "Please confirm your password" },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue("password") === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error("Passwords do not match!"));
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder="Confirm password" />
                    </Form.Item>

                    <Form.Item
                        label="Super Password"
                        name="superPassword"
                        rules={[{ required: true, message: "Please enter the super password" }]}
                    >
                        <Input.Password placeholder="Enter secret super password" />
                    </Form.Item>

                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                        loading={loading}
                        className="rounded-lg"
                    >
                        Sign Up as Admin
                    </Button>
                </Form>
            </Card>
        </div>


    );
};

export default AdminSignup;
