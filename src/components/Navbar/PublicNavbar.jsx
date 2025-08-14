import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout, Button, Typography } from "antd";
import {
  LoginOutlined,
  UserAddOutlined,
  BookOutlined,
} from "@ant-design/icons";
import { paths } from "../../lib/path";

const { Header } = Layout;
const { Title } = Typography;

export default function PublicNavbar() {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate(paths.HOME);
  };

  return (
    <Header className="bg-white shadow-md flex justify-between items-center px-6 py-2 !h-auto">
      {/* Clickable logo */}
      <div
        onClick={handleLogoClick}
        className="flex items-center gap-2 cursor-pointer"
      >
        <BookOutlined className="text-blue-600 text-2xl" />
        <Title level={4} className="!mb-0 !text-blue-800">
          EnglishMaster
        </Title>
      </div>

      {/* Auth buttons */}
      <div className="flex gap-3">
        <Link to="/login">
          <Button icon={<LoginOutlined />} type="default">
            Login
          </Button>
        </Link>
        <Link to="/register">
          <Button icon={<UserAddOutlined />} type="primary">
            Register
          </Button>
        </Link>
      </div>
    </Header>
  );
}
