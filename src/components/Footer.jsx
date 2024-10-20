import { FaInstagram, FaFacebookF } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="container mx-auto max-w-screen-lg px-4 bg-gray-50 text-black md:p-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div>
          <h3 className="font-bold mb-4 text-xl">
            Perfect
            <span className="text-[#B55D51] text-xl font-bold">Recipe</span>
          </h3>
          <p>
            Welcome to Perfect Recipe, your go-to destination for finding and
            sharing the best recipes from around the world.
          </p>
        </div>
        <div>
          <h3 className="font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/">
                <button className="hover:text-[#B55D51]">Home</button>
              </Link>
            </li>
            <li>
              <Link to="/recipes">
                <button className="hover:text-[#B55D51]">Recipe</button>
              </Link>
            </li>
            <li>
              <Link to="/add-recipe">
                <button className="hover:text-[#B55D51]">Add Recipe</button>
              </Link>
            </li>
            <Link to="/about-us">
              <li>
                <button className="hover:text-[#B55D51]">About Us</button>
              </li>
            </Link>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-4">Help Links</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-[#B55D51]">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#B55D51]">
                Terms & Conditions
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#B55D51]">
                Contact Us
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-4">Newsletter</h3>
          <p className="mb-4">
            Subscribe to our newsletter for news and offers.
          </p>
          <div className="flex">
            <input
              type="email"
              placeholder="Enter Your Email"
              className="px-4 py-2 rounded-md w-full"
            />
          </div>
          <button className="w-full flex text-center  mt-2  text-sm bg-[#B55D51] text-white px-4 py-2 rounded-md">
            Subscribe
          </button>
        </div>
      </div>
      <div className="text-xl border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
        <p>© 2024 PerfectRecipe. All rights reserved.</p>
        <div className="text-xl flex space-x-4 mt-4 md:mt-0">
          <a href="#" className="hover:text-[#B55D51]">
            <FaInstagram />
          </a>
          <a href="#" className="hover:text-[#B55D51]">
            <FaFacebookF />
          </a>
          <a href="#" className="hover:text-[#B55D51]">
            <BsTwitterX />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
