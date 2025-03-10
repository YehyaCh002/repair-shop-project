import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";

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
<NavBar />


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
