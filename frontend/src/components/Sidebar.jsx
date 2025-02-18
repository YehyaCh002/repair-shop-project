import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar w-64 bg-gray-800 text-white h-full p-4 hidden md:block">
      <h2 className="text-xl font-bold mb-4">Dashboard</h2>
      <ul>
        <li className="mb-2 hover:bg-gray-700 rounded">
          <Link
            to="/repair-requests"
            className="sidebar-link block p-2 text-white! no-underline! hover:text-white!"
          >
            Repair Requests
          </Link>
        </li>
        <li className="mb-2 hover:bg-gray-700 rounded">
          <Link
            to="/clients"
            className="sidebar-link block p-2 text-white! no-underline! hover:text-white!"
          >
            Clients
          </Link>
        </li>
        <li className="hover:bg-gray-700 rounded">
          <Link
            to="/products"
            className="sidebar-link block p-2 text-white! no-underline! hover:text-white!"
          >
            Products
          </Link>
        </li>
      </ul>
    </div>
  );
}