import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="absolute top-0 left-0 w-full py-2 flex justify-between items-center p-6 bg-indigo-950 bg-opacity-50">
      <h1 className="text-2xl font-light text-white">Fix Me</h1>
      <ul className="flex space-x-6 text-lg ps-8 mr-8">
        <li>
          <Link className="block p-2 !text-white !no-underline hover:!text-indigo-400">
            Home
          </Link>
        </li>

        <li className="relative group">
          <Link className="block p-2 !text-white !no-underline hover:!text-indigo-400">
            Services ▼
          </Link>
          <ul
            className="absolute left-0 mt-2 w-48 bg-indigo-950 bg-opacity-90 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 ease-in-out"
          >
            
            <li>
              <Link  className="block px-4 py-2 !text-white hover:!text-indigo-700">
               Phone and Tablet
              </Link>
            </li>
            <li>
              <Link  className="block px-4 py-2 !text-white hover:!text-indigo-700">
                Laptops and Desktop
              </Link>
            </li>
            <li>
              <Link className="block px-4 py-2 !text-white hover:!text-indigo-700">
                Printers
              </Link>
            </li>
            <li>
              <Link className="block px-4 py-2 !text-white hover:!text-indigo-700">
                Cars
              </Link>
            </li>
            
          </ul>
        </li>

        <li>
          <Link to ="/contact" className="block p-2 !text-white !no-underline hover:!text-indigo-400">
            Contact Us
          </Link>
        </li>
        <li>
          <Link to ="/about" className="block p-2 !text-white !no-underline hover:!text-indigo-400">
            About Us
          </Link>
        </li>
      </ul>

      <ul className="flex space-x-4 text-lg">
        <Link to="/login"><li className="block p-2 !text-white !no-underline hover:!text-indigo-400">
          Login
        </li></Link>
        <Link to="/Signup"><li className="block p-2 !text-white !no-underline hover:!text-indigo-400">
          Register
        </li></Link>
      </ul>
    </nav>
  );
}
