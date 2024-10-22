import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Input from "antd/es/input/Input";
import { Button, Upload } from "antd";
import { FaFacebookF } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  updateProfile
} from "firebase/auth";
import { auth } from "../../utils/firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from "react-router";

const storage = getStorage();

function SignUp() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (info) => {
    if (info.file.originFileObj) {
      setProfileImage(info.file.originFileObj);
      // Create preview URL
      const previewUrl = URL.createObjectURL(info.file.originFileObj);
      setImagePreview(previewUrl);
    }
  };

  const uploadProfileImage = async (user) => {
    if (!profileImage) return null;
    
    const storageRef = ref(storage, `profile-images/${user.uid}`);
    await uploadBytes(storageRef, profileImage);
    const photoURL = await getDownloadURL(storageRef);
    return photoURL;
  };

  const handleSignUp = async () => {
    try {
      setLoading(true);

      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      if (!acceptedTerms) {
        alert("Please accept the terms and conditions");
        return;
      }

      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Upload profile image if one was selected
      let photoURL = null;
      if (profileImage) {
        photoURL = await uploadProfileImage(user);
      }

      // Update user profile with username and photo URL
      await updateProfile(user, {
        displayName: username,
        photoURL: photoURL
      });

      alert("Sign up successful!");
      navigate("/");
    } catch (error) {
      console.error("Error signing up:", error);
      alert("Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      alert("Google sign up successful!");
      navigate("/");
    } catch (error) {
      console.error("Error signing up with Google:", error);
      alert("Google sign up failed. Please try again.");
    }
  };

  const handleFacebookSignUp = async () => {
    try {
      const provider = new FacebookAuthProvider();
      await signInWithPopup(auth, provider);
      alert("Facebook sign up successful!");
      navigate("/");
    } catch (error) {
      console.error("Error signing up with Facebook:", error);
      alert("Facebook sign up failed. Please try again.");
    }
  };

  return (
    <div>
      <Header />

      <div className="container mx-auto mt-9 mb-9 max-w-screen-lg px-4 mt-8 flex flex-row">
        <img
          src="https://www.santani.com/wp-content/uploads/elementor/thumbs/10-eating-habits-for-healthy-lifestyle-q2voqrxndqf2obo8xd9y2dsajucknjyfvfb295zl9s.jpg"
          alt=""
          className="w-[450px] h-[500px]"
        />
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
            
            {imagePreview && (
              <div className="mb-4">
                <img 
                  src={imagePreview} 
                  alt="Profile Preview" 
                  className="w-24 h-24 rounded-full object-cover mx-auto"
                />
              </div>
            )}

            <Upload
              onChange={handleImageUpload}
              maxCount={1}
              className="w-full"
              accept="image/*"
              showUploadList={true}
              beforeUpload={() => true}
            >
              <Button icon={<UploadOutlined />} className="w-full">
                Upload Profile Picture
              </Button>
            </Upload>
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
            loading={loading}
          >
            Sign Up
          </Button>

          <div className="flex items-center mt-4">
            <Button
              type="default"
              className="mr-2 flex items-center"
              onClick={handleGoogleSignUp}
              disabled={loading}
            >
              <FcGoogle className="mr-2" /> Sign Up with Google
            </Button>
            <Button
              type="default"
              className="flex items-center"
              onClick={handleFacebookSignUp}
              disabled={loading}
            >
              <FaFacebookF className="mr-2" /> Sign Up with Facebook
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default SignUp;