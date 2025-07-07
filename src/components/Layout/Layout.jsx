import { Outlet } from "react-router-dom";
import AuthNavbar from "../Navbar/AuthNavbar";
import PublicNavbar from "../Navbar/PublicNavbar";
import { useEffect, useState } from "react";

export default function Layout() {
    const [loginState, setLoginState] = useState(false);

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (user) {

            setLoginState(true);
        } else {
            setLoginState(false)
        }
    }, [user])

    return (
        <div>
            {loginState ? <AuthNavbar /> : <PublicNavbar />}
            <main className="min-h-screen bg-gray-100">
                <Outlet />
            </main>
        </div>
    );
}
