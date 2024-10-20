import { useState } from "react";
import { ImSpoonKnife } from "react-icons/im";
import { Link } from "react-router-dom";

function Header() {
  return (
    <>
      <div className="container mx-auto max-w-screen-lg px-4 flex justify-between items-center p-5 bg-white">
        {/* Logo and Brand Name */}
        <div className="flex items-center">
        <img className="w-[50px] h-[50px] text-white rounded-full" src="https://logowik.com/content/uploads/images/755_food.jpg" />

          <span className="font-bold text-2xl">
            Perfect
            <span className="text-[#B55D51] font-bold">Food</span>
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-4">
          <Link to="/">
            <button className="text-gray-600 hover:text-gray-900 ">Home</button>
          </Link>
          <Link to="/recipes">
            <button className="text-gray-600 hover:text-gray-900">Recipe</button>
          </Link>
          <Link to="/add-recipe">
            <button className="text-gray-600 hover:text-gray-900">Add Recipe</button>
          </Link>
          <Link to="/about-us">
            <button className="text-gray-600 hover:text-gray-900">About Us</button>
          </Link>
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-2">
          <Link to="/Pages/Auth/SignIn">
            <button className="bg-white text-sm text-gray-800 px-4 py-2 rounded-md border border-gray-300 shadow-lg">
              Log In
            </button>
          </Link>
          <Link to="/Pages/Auth/SignUp">
            <button className="bg-[#B55D51] text-sm text-white px-3 py-2 rounded-md shadow-lg">
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}

export default Header;
