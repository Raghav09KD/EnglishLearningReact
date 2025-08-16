import { useNavigate, Link } from "react-router-dom";
import { Layout, Avatar, Button, Typography, Space, Dropdown, Menu } from "antd";
import { LogoutOutlined, DashboardOutlined, ReadOutlined, MenuOutlined } from "@ant-design/icons";
import { useState } from "react";
import { paths } from "../../lib/path";

const { Header } = Layout;
const { Text } = Typography;

export default function AuthNavbar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate(paths.HOME);
  };

  const getInitial = (name) => {
    if (!name) return "U";
    return name.trim().charAt(0).toUpperCase();
  };

  const dashboardPath =
    user?.role === "admin" ? paths.ADMIN_DASHBOARD : paths.STUDENT_DASHBOARD;

  // Mobile dropdown menu
  const mobileMenu = (
    <Menu
      items={[
        {
          key: "dashboard",
          label: (
            <Link to={dashboardPath}>
              {user?.role === "admin" ? "Admin Panel" : "My Course"}
            </Link>
          ),
          icon: user?.role === "admin" ? <DashboardOutlined /> : <ReadOutlined />,
        },
        {
          key: "logout",
          label: <span onClick={handleLogout}>Logout</span>,
          icon: <LogoutOutlined />,
        },
      ]}
    />
  );

  return (
    <Header className="bg-white shadow-sm px-6 py-3 flex justify-between items-center sticky top-0 z-50 !h-auto">
      {/* Logo */}
      <Link
        to={"/dashboard"}
        className="flex items-center gap-1 text-indigo-600 font-bold text-xl sm:text-2xl"
      >
        Engli<span className="text-gray-800">Learn</span>
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-6">
        {/* Avatar + Greeting */}
        <Space size="small" className="items-center">
          <Avatar className="bg-indigo-500" size="small">
            {getInitial(user?.name)}
          </Avatar>
          <Text className="text-sm text-gray-600">
            Hi, <span className="font-medium text-gray-800">{user?.name}</span>
          </Text>
        </Space>

        {/* Dashboard Link */}
        <Link to={dashboardPath}>
          <Button
            type="link"
            icon={
              user?.role === "admin" ? <DashboardOutlined /> : <ReadOutlined />
            }
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
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden flex items-center">
        <Dropdown
          overlay={mobileMenu}
          trigger={["click"]}
          placement="bottomRight"
          arrow
          onOpenChange={setMobileOpen}
          open={mobileOpen}
        >
          <Button
            type="text"
            icon={<MenuOutlined />}
            className="text-gray-700"
          />
        </Dropdown>
      </div>
    </Header>
  );
}
