import NavBar from "../components/NavBar"; // Import NavBar component

export default function AboutUs() {
  return (
    <div
      className="h-screen w-screen bg-cover bg-center flex flex-col items-center justify-center bg-gray-100 transition-all duration-1000 transform"
      style={{ backgroundImage: `url('/computerrepair.png')` }}
    >
      <NavBar /> {/* Add NavBar here */}
      <div className="text-center">
        <h2 className="text-5xl font-extrabold mb-4 text-white">
          About Us
        </h2>
        <p className="text-xl text-white mb-6">
          We are Chehida Yehya and Boulmoukh Mohamed, Computer Science students.
        </p>
        <p className="text-lg text-white">
          We are currently studying at the University of Guelma 8 may 1945 (Old Campus) in Algeria.
          Our passion for technology and programming drives us to build innovative solutions that make a difference.
        </p>
      </div>
    </div>
  );
}
