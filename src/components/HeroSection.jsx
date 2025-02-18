import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../utils/firebase";
import { Button } from "antd";
import { button } from "@nextui-org/react";
function HeroSection() {
  const { user, setUser } = useContext(AuthContext) || {};
  const isLoggedIn = user?.isLogin;
  const navigate = useNavigate();

  const handleSignOut = () => {
    try {
      signOut(auth);
      setUser({ isLogin: false, userInfo: {} });
      navigate("/");
    } catch (error) {
      console.log("Error Sign Out", error);
    }
  };

  if (!user || user === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto max-w-screen-lg px-4 relative bg-pink-50 p-8 md:p-16  lg:p-20 xl:p-24 2xl:p-32">
      <div className="max-w-3xl gap-2">
        <h1 className="text-4xl md:text-5xl font-bold mb-2">Your Daily Dish</h1>
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">
          A <span className="font-bold text-[#B55D51]">Food</span> Journey
        </h2>
        <p className="mb-4 text-gray-600 text-sm">
          Welcome to Perfect Recipe -
           your ultimate destination for discovering
          and sharing delicious recipes from around the world.
           Whether you're a pro or a beginner, 
           find the perfect dish for any occasion!
        </p>
        {isLoggedIn ? (
          <>
            <button
              onClick={handleSignOut}
              className="text-sm bg-[#B55D51] text-white px-6 py-3 rounded-md flex items-center"
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link to="/signup">
              <button className="text-sm bg-[#B55D51] text-white px-6 py-3 rounded-md flex items-center ">
                Sign Up
              </button>
            </Link>
            <Link to="/login">
              <p>
                Do You Have An Account:
                <span className="ml-2 font-bold text-[#B55D51]">Log In</span>
              </p>
            </Link>
          </>
        )}
      </div>
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2  rounded-tl-md"></div>
      <img
        src="https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg?auto=compress&cs=tinysrgb&w=400"
        alt="Featured Dish"
        className="absolute  h-[300px] bottom-8 right-8 rounded-md shadow-xl w-full md:max-w-sm"
      />
    </div>
  );
}

export default HeroSection;
