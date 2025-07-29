import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faKey } from "@fortawesome/free-solid-svg-icons";



const Navbar = () => {
  return (
    <nav className="md:py-1 navbar bg-green-400 flex justify-around py-2.5 items-center">
      <div className="Logo font-bold text-2xl">
        <span className="m-1.5">
          <FontAwesomeIcon icon={faKey} className="text-2xl" />
        </span>
        PassOP
      </div>

      <div className="flex items-center border-2 border-black rounded-full px-2 py-1 hover:shadow-lg transition-shadow duration-100">
        <a href="#" className="flex items-center text-black ">
          <FontAwesomeIcon icon={faGithub} className="text-3xl" />
          <span className="ml-1 text-black">Github</span>
        </a>
        
      </div>
    </nav>
  );
};

{
  /*  */
}

export default Navbar;
