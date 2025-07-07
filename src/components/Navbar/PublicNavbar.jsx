import { Link } from "react-router-dom";

export default function PublicNavbar() {
  return (
    <nav className="bg-white shadow px-6 py-3 flex justify-between items-center">
      <h1 className="text-xl font-bold">📘 EnglishMaster</h1>
      <div className="flex items-center gap-4">
        <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
        <Link to="/register" className="text-green-600 hover:underline">Register</Link>
      </div>
    </nav>
  );
}
