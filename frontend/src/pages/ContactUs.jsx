import NavBar from "../components/NavBar"; // Import NavBar component

export default function ContactUs() {
  return (
    <div
      className="h-screen w-screen bg-cover bg-center flex flex-col items-center justify-center bg-gray-100 transition-all duration-1000 transform"
      style={{ backgroundImage: `url('/computerrepair.png')` }}
    >
      <NavBar /> {/* Add NavBar here */}
      <div className="text-center">
        <h2 className="text-5xl font-extrabold mb-4 text-white">
          Contact Us
        </h2>
        <p className="text-xl text-white mb-6" >You can find us at:</p>
        <p className="text-lg text-blue-500">
          <a href="mailto:yahiayahiachehida@gmail.com">yahiayahiachehida@gmail.com</a>
        </p>
      </div>
    </div>
  );
}
