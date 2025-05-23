import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar w-64 bg-gray-800 text-white h-full p-4 hidden md:block">
      <h2 className="text-xl font-bold mb-4">Dashboard</h2>
      <ul>
        <li className="mb-4 hover:bg-gray-700 rounded">
          <Link
            to="/repair-requests"
            className="block p-2 !text-white !no-underline hover:!text-gray-200"
          >
            Repair Requests
          </Link>
        </li>

        <li className="mb-2 hover:bg-gray-700 rounded">
          <Link
            to="/technicians"
            className="block p-2 !text-white !no-underline hover:!text-gray-200"
          >
            Technicians
          </Link>
        </li>

        

        <li className="mb-2 hover:bg-gray-700 rounded">
          <Link
            to="/fix-records"
            className="block p-2 !text-white !no-underline hover:!text-gray-200"
          >
            Fix Records
          </Link>
        </li>

        <li className="mb-2 hover:bg-gray-700 rounded">
          <Link
            to="/settings"
            className="block p-2 !text-white !no-underline hover:!text-gray-200"
          >
            Settings
          </Link>
        </li>
        <li className="mb-2 hover:bg-gray-700 rounded">
          <Link
            to="/logout"
            className="block p-2 !text-white !no-underline hover:!text-gray-200"
          >
            Logout
          </Link>
        </li>
      </ul>
    </div>
  );
}
