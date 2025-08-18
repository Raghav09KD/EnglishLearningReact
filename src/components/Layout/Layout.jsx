
import { Outlet, useLocation } from "react-router-dom";
import AuthNavbar from "../Navbar/AuthNavbar";
import PublicNavbar from "../Navbar/PublicNavbar";
import { useEffect, useState } from "react";

export default function Layout() {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user"))
  );

  const location = useLocation();

  useEffect(() => {
    const handleStorageChange = () => {
      setUser(JSON.parse(localStorage.getItem("user")));
    };

    window.addEventListener("storage", handleStorageChange);

    const interval = setInterval(() => {
      const currentUser = JSON.parse(localStorage.getItem("user"));
      setUser(currentUser);
    }, 500); // polling every 500ms, or use smarter login/logout event dispatching

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Hide navbar on these routes
  const hideNavbarRoutes = ["/register", "/login", "/admin/login", "/admin/register"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <div>
      {!shouldHideNavbar && (user ? <AuthNavbar /> : <PublicNavbar />)}
      <main className="min-h-screen bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
}