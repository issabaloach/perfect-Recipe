import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Input from "antd/es/input/Input";
import { Button } from "antd";
import { FaFacebookF } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";
import { auth } from "../../utils/firebase";
import { useNavigate } from "react-router";

function SignUp() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleSignUp = async () => {
    try {
      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      if (!acceptedTerms) {
        alert("Please accept the terms and conditions");
        return;
      }

      await createUserWithEmailAndPassword(auth, email, password);
      alert("Sign up successful!");
    } catch (error) {
      console.error("Error signing up:", error);
      alert("Sign up failed. Please try again.");
    }
    navigate("/");
  };

  const handleGoogleSignUp = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      alert("Google sign up successful!");
    } catch (error) {
      console.error("Error signing up with Google:", error);
      alert("Google sign up failed. Please try again.");
    }
    navigate("/");
  };

  const handleFacebookSignUp = async () => {
    try {
      const provider = new FacebookAuthProvider();
      await signInWithPopup(auth, provider);
      alert("Facebook sign up successful!");
    } catch (error) {
      console.error("Error signing up with Facebook:", error);
      alert("Facebook sign up failed. Please try again.");
    }
    navigate("/");
  };

  return (
    <div>
      <Header />

      <div className="container mx-auto max-w-screen-lg px-4 mt-8 flex flex-row">
        <img src="/src/assets/loginSignUp.PNG" alt="" />
        <div className="ml-5 mt-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Want To Join Our Family
          </h1>
          <div className="flex flex-col gap-3 mt-5">
            <Input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            
          </div>

          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mr-2"
            />
            <label>I accept the terms and conditions</label>
          </div>

          <Button
            type="primary"
            className="bg-[#B55D51] border-none mt-4"
            onClick={handleSignUp}
          >
            Sign Up
          </Button>

          <div className="flex items-center mt-4">
            <Button
              type="default"
              className=" mr-2 flex items-center"
              onClick={handleGoogleSignUp}
            >
              <FcGoogle className="mr-2" /> Sign Up with Google
            </Button>
            <Button
              type="default"
              className="flex items-center"
              onClick={handleFacebookSignUp}
            >
              <FaFacebookF className=" mr-2" /> Sign Up with Facebook
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default SignUp;
