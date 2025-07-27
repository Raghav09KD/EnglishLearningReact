import { useNavigate, Link } from "react-router-dom";
import { Layout, Avatar, Button, Typography, Space } from "antd";
import { LogoutOutlined, DashboardOutlined, ReadOutlined } from "@ant-design/icons";
import { paths } from "../../lib/path";

const { Header } = Layout;
const { Text } = Typography;

export default function AuthNavbar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate(paths.LOGIN);
  };

  const getInitial = (name) => {
    if (!name) return "U";
    return name.trim().charAt(0).toUpperCase();
  };

  return (
    <Header className="bg-white shadow-md px-8 py-4 flex justify-between items-center sticky top-0 z-50 !h-auto">
      {/* Logo */}
      <Link to="/dashboard" className="flex items-center gap-2 text-indigo-600 font-bold text-2xl">
        Engli<span className="text-gray-800">Learn</span>
      </Link>

      <Space size="large" className="items-center">
        {/* Avatar + Greeting */}
        <Space size="small" className="items-center">
          <Avatar className="bg-indigo-500" size="small">
            {getInitial(user?.name)}
          </Avatar>
          <Text type="secondary" className="text-sm">
            Hi, <span className="font-medium text-gray-700">{user?.name}</span>
          </Text>
        </Space>

        {/* Dashboard Link */}
        <Link
          to={
            user?.role === "admin"
              ? paths.ADMIN_DASHBOARD
              : paths.STUDENT_DASHBOARD
          }
        >
          <Button
            type="link"
            icon={user?.role === "admin" ? <DashboardOutlined /> : <ReadOutlined />}
            className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
          >
            {user?.role === "admin" ? "Admin Panel" : "My Course"}
          </Button>
        </Link>

        {/* Logout */}
        <Button
          danger
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          className="text-sm"
        >
          Logout
        </Button>
      </Space>
    </Header>
  );
}
