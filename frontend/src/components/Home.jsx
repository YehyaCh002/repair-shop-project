import { useEffect, useState } from "react";

export default function HomePage() {
        const [background] = useState("/computerrepair.png");
        const [loaded, setLoaded] = useState(false);
      
        useEffect(() => {
          const img = new Image();
          img.src = background;
          img.onload = () => setLoaded(true);
        }, [background]);
      
      

  return (
    <div 
  className={`h-screen w-screen bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center transition-all duration-1000 transform ${loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
  style={{
    backgroundImage: `url(${background})`,
  }}
>   
<nav className="absolute top-0 left-0 w-full py-2 flex justify-between rounded-b-lg items-center p-6 bg-indigo-950 bg-opacity-50">
  <h1 className="text-2xl font-light text-white">Fix Me</h1>
  <ul className="flex space-x-6 text-lg ps-8 mr-128">
    <li  className="text-white hover:text-indigo-400">Home</li>
    <li href="/services" className="text-white hover:text-indigo-400">Services</li>
    <li href="/contact" className="text-white hover:text-indigo-400">Contact Us</li>
    <li href="/about" className="text-white hover:text-indigo-400">About Us</li>
  </ul>
</nav>


      <div className="text-center">
        <h2 className="text-5xl font-extrabold mb-4">Get Help With Your Device</h2>
        <input className=" text-l mb-6 bg-amber-50 text-black  pl-3 pr-24 py-4 hover:bg-indigo-100 rounded-lg"placeholder="Enter your tracking number"></input>
        <button className="bg-indigo-500 hover:bg-indigo-600 text-xl text-white  ml-3 px-8 py-6 rounded-lg shadow-lg transition-all">
        Search
        </button>
      </div>
    </div>
  );
}
