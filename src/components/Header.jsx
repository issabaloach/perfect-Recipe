import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import { Avatar, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Spinner  } from "@nextui-org/react";
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useContext} from "react";
import { ImSpoonKnife } from "react-icons/im";
function Header() {

  const { user, setUser } = useContext(AuthContext) || {};
 
  const isLoggedIn = user?.isLogin;
  const navigate = useNavigate();
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser({ isLogin: false, userInfo: {} });
      navigate('/');
    } catch (error) {
      console.log("Error Sign Out", error);
    }
  };
  if (!user || user === null) {
    return <>
    <Spinner />
    </>;
  }

  

  return (
    <>
      <div className="container mx-auto max-w-screen-lg px-4 flex justify-between items-center p-5 bg-white">
        {/* Logo and Brand Name */}
        <div className="flex items-center">
          <ImSpoonKnife/>
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
        {isLoggedIn ? (
          user.userInfo.photoURL ? (
            <Dropdown>
            <DropdownTrigger>
              <Avatar
                src={user?.userInfo?.photoURL || '/default-avatar.png'} 
                alt={user?.userInfo?.displayName || 'User Avatar'}
                size="md"
                className="cursor-pointer rounded-full w-[100px] h-[40px]"
               
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="User menu">
              <DropdownItem href="/profile" key="profile">Profile</DropdownItem>
              <DropdownItem key="logout" color="danger" onPress={handleSignOut}>
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          ) : null
        ): (
            <>
              <div className="flex items-center space-x-2">
          <Link to="/login">
            <button className="bg-white text-sm text-gray-800 px-4 py-2 rounded-md border border-gray-300 shadow-lg">
              Log In
            </button>
          </Link>
          <Link to="/signup">
            <button className="bg-[#B55D51] text-sm text-white px-3 py-2 rounded-md shadow-lg">
              Sign Up
            </button>
          </Link>
        </div>
            </>
          )}
      </div>
    </>
  );
}

export default Header;
