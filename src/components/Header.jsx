import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import { 
  Avatar, 
  Dropdown, 
  DropdownTrigger, 
  DropdownMenu, 
  DropdownItem, 
  Spinner,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button
} from "@nextui-org/react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useContext, useState, useEffect } from "react";
import { ImSpoonKnife } from "react-icons/im";

function Header() {
  const { user, setUser } = useContext(AuthContext) || {};
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          isLogin: true,
          userInfo: {
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL
          }
        });
      } else {
        setUser({ isLogin: false, userInfo: {} });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser]);

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      setUser({ isLogin: false, userInfo: {} });
      navigate('/');
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Recipe", path: "/recipes" },
    { name: "Add Recipe", path: "/add-recipe" },
    { name: "About Us", path: "/about-us" }
  ];

  const getProfileImage = () => {
    if (user?.userInfo?.photoURL) {
      return user.userInfo.photoURL;
    }
    return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7vB-49_BT-dirwttYZaeE_VByjlQ3raVJZg&s';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-16">
        <Spinner size="md" />
      </div>
    );
  }

  const renderAuthButtons = () => (
    <>
      <Link to="/login">
        <Button 
          variant="bordered" 
          size="sm"
          className="text-gray-800"
        >
          Log In
        </Button>
      </Link>
      <Link to="/signup">
        <Button 
          className="border bg-[#B55D51] text-white"
          size="sm"
        >
          Sign Up
        </Button>
      </Link>
    </>
  );

  return (
    <Navbar
      isMenuOpen={isMenuOpen} 
      onMenuOpenChange={setIsMenuOpen}
      className="bg-white mt-7 mb-5 container mx-auto max-w-screen-lg px-4"
      maxWidth="lg"
      isBordered
    >
      <NavbarContent className="sm:hidden" justify="end">
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarContent className="pr-3" justify="center">
        <NavbarBrand>
          <ImSpoonKnife className="text-xl" />
          <p className="font-bold text-xl sm:text-2xl ml-2">
            Perfect<span className="text-[#B55D51]">Food</span>
          </p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {menuItems.map((item) => (
          <NavbarItem key={item.path}>
            <Link 
              to={item.path}
              className="text-gray-600 hover:text-gray-900"
            >
              {item.name}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        {user?.isLogin ? (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                as="button"
                src={getProfileImage()}
                classNames={ {
                  base: "transition-transform cursor-pointer",
                  img: "object-cover",
                }}
                imgProps={{
                  onError: (e) => {
                    e.target.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7vB-49_BT-dirwttYZaeE_VByjlQ3raVJZg&s';
                  }
                }}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="User menu">
              <DropdownItem key="profile">
                <Link to="/profile" className="w-full block">
                  Profile
                </Link>
              </DropdownItem>
              <DropdownItem 
                key="logout" 
                className="text-danger" 
                color="danger"
                onClick={handleSignOut}
              >
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <div className="flex items-center gap-2">
            {renderAuthButtons()}
          </div>
        )}
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item) => (
          <NavbarMenuItem key={item.path}>
            <Link 
              to={item.path}
              className="w-full text-gray-600 hover:text-gray-900"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
        {user?.isLogin && (
          <>
            <NavbarMenuItem>
              <Link 
                to="/profile"
                className="w-full text-gray-600 hover:text-gray-900"
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <button
                onClick={() => {
                  handleSignOut();
                  setIsMenuOpen(false);
                }}
                className="w-full text-left text-danger"
              >
                Log Out
              </button>
            </NavbarMenuItem>
          </>
        )}
      </NavbarMenu>
    </Navbar>
  );
}

export default Header;