import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Button, Typography, Card, notification } from 'antd';

const { Title, Text } = Typography;

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const { token } = useParams();  // Get reset token from URL
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');  // If token doesn't exist, redirect to login
    }
  }, [token, navigate]);

  const handleResetPassword = async (values) => {
    const { password } = values;

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/reset-password', {
        token,
        password,
      });
      notification.success({
        message: 'Password Reset Successful',
        description: res.data.message,
      });
      navigate('/login');  // Redirect to login after successful reset
    } catch (error) {
      console.error('Error during password reset:', error);
      notification.error({
        message: 'Password Reset Failed',
        description: error.response?.data?.message || 'Something went wrong. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-white relative">
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          width: '100%',
          maxWidth: '400px',
          marginTop: '-80px',
        }}
      >
        <Card className="w-full border-0 shadow-none">
          <Title level={3} className="!text-gray-800 text-center !mb-2" style={{ fontSize: 22 }}>
            Reset Your Password
          </Title>
          <Text type="secondary" className="block text-center mb-6">
            Please enter your new password below
          </Text>

          {/* Reset Password Form */}
          <Form
            layout="vertical"
            onFinish={handleResetPassword}
            requiredMark={false}
            className="space-y-4"
          >
            {/* New Password */}
            <Form.Item
              label={<span className="text-sm font-medium">New Password</span>}
              name="password"
              rules={[
                { required: true, message: 'Please enter your new password' },
                {
                  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  message:
                    'Password must be at least 8 characters long, include one uppercase, one lowercase, one number, and one special character',
                },
              ]}
            >
              <Input.Password placeholder="Enter new password" size="large" />
            </Form.Item>

            {/* Confirm Password */}
            <Form.Item
              label={<span className="text-sm font-medium">Confirm Password</span>}
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Please confirm your new password' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Confirm new password" size="large" />
            </Form.Item>

            {/* Submit Button */}
            <Form.Item>
              <Button type="primary" htmlType="submit" size="large" loading={loading} block>
                Reset Password
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
