import { Link } from "react-router-dom";
import {
  FileText,
  ListChecks,
  Mic,
  Headphones,
  Users,
  Mic2,
} from "lucide-react";
import { paths } from "../../lib/path";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="p-8 space-y-10 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          Admin Dashboard
        </h1>
      </div>

      {/* Quick Actions */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Courses */}
          <DashboardCard
            title="Add Course"
            icon={<FileText size={24} />}
            color="blue"
            link={paths.ADD_COURSE}
          />
          <DashboardCard
            title="Manage Courses"
            icon={<ListChecks size={24} />}
            color="green"
            link={paths.MANAGE_COURSE}
          />

          {/* Speech Practice */}
          <DashboardCard
            title="Add Speech Practice"
            icon={<Mic size={24} />}
            color="purple"
            link={paths.CREATE_SPEECH_PRACTISE}
          />
          <DashboardCard
            title="Manage Speech Practice"
            icon={<Mic2 size={24} />}
            color="indigo"
            link={paths.MANAGE_SPEECH_PRACTISE}
          />

          {/* Listening Practice */}
          <DashboardCard
            title="Add Listening Practice"
            icon={<Headphones size={24} />}
            color="orange"
            link={paths.ADD_LISTENING_PRACTISE}
          />
          <DashboardCard
            title="Manage Listening Practice"
            icon={<ListChecks size={24} />}
            color="teal"
            link={paths.MANAGE_VOICE_COURSES}
          />
        </div>
      </section>

      {/* User Management */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          User Management
        </h2>

        {/* View All Users */}
        <Link to={paths.ADMIN_USER_TABLE}>
          <div className="flex items-center gap-4 p-5 border rounded-lg bg-white shadow-sm hover:shadow-md hover:bg-indigo-50 transition duration-200 cursor-pointer">
            <Users className="text-indigo-600" size={26} />
            <div>
              <h3 className="text-base font-medium text-gray-900">View All Users</h3>
              <p className="text-sm text-gray-500">
                Manage students and monitor their progress
              </p>
            </div>
          </div>
        </Link>

        {/* Only for Admins → Manage Teacher's Students */}
        {user?.role === "admin" && (
          <Link to={paths.USER_MANAGEMENT}>
            <div className="flex items-center gap-4 mt-4 p-5 border rounded-lg bg-white shadow-sm hover:shadow-md hover:bg-green-50 transition duration-200 cursor-pointer">
              <Users className="text-green-600" size={26} />
              <div>
                <h3 className="text-base font-medium text-gray-900">
                  Manage Teacher's Students
                </h3>
                <p className="text-sm text-gray-500">
                  View and assign students under teachers
                </p>
              </div>
            </div>
          </Link>
        )}
      </section>

    </div>
  );
};

// Reusable Dashboard Card
function DashboardCard({ title, icon, color, link }) {
  const colorMap = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    orange: "bg-orange-100 text-orange-700",
    purple: "bg-purple-100 text-purple-700",
    indigo: "bg-indigo-100 text-indigo-700",
    teal: "bg-teal-100 text-teal-700",
  };

  return (
    <Link to={link}>
      <div className="bg-white border rounded-xl shadow-sm hover:shadow-md transition duration-200 p-6 flex items-center gap-5 cursor-pointer">
        <div className={`p-3 rounded-lg ${colorMap[color]}`}>
          {icon}
        </div>
        <div>
          <h4 className="text-base font-medium text-gray-900">{title}</h4>
        </div>
      </div>
    </Link>
  );
}

export default AdminDashboard;
