import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Input from "antd/es/input/Input";
import { Button } from "antd";
import { FaFacebookF } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";
import { auth } from "../../utils/firebase";
import { useNavigate } from "react-router";

function SignIn() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Sign in successful!");
    } catch (error) {
      console.error("Error signing in:", error);
      alert("Sign in failed. Please try again.");
    }

    navigate("/");
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      alert("Google sign in successful!");
    } catch (error) {
      console.error("Error signing in with Google:", error);
      alert("Google sign in failed. Please try again.");
    }
    navigate("/");
  };

  const handleFacebookSignIn = async () => {
    try {
      const provider = new FacebookAuthProvider();
      await signInWithPopup(auth, provider);
      alert("Facebook sign in successful!");
    } catch (error) {
      console.error("Error signing in with Facebook:", error);
      alert("Facebook sign in failed. Please try again.");
    }
    navigate("/");
  };

  return (
    <div>
      <Header />

      <div className="container mx-auto max-w-screen-lg mt-9 mb-10 px-4 mt-8 flex flex-row">
        <img
          src="https://www.santani.com/wp-content/uploads/elementor/thumbs/10-eating-habits-for-healthy-lifestyle-q2voqrxndqf2obo8xd9y2dsajucknjyfvfb295zl9s.jpg"
          alt=""
          className="w-[450px] h-[500px]"
        />
        <div className="ml-5 mt-6">
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back!</h1>
          <div className="flex flex-col gap-3 mt-5">
            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            type="primary"
            className="bg-[#B55D51] border-none mt-4"
            onClick={handleSignIn}
          >
            Sign In
          </Button>

          <div className="flex items-center mt-4">
            <Button
              type="default"
              className=" mr-2 flex items-center"
              onClick={handleGoogleSignIn}
            >
              <FcGoogle className="mr-2" /> Sign In with Google
            </Button>
            <Button
              type="default"
              className="flex items-center"
              onClick={handleFacebookSignIn}
            >
              <FaFacebookF className=" mr-2" /> Sign In with Facebook
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default SignIn;
