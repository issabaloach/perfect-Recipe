import React, { useState } from 'react';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Input from "antd/es/input/Input";
import { Button, Upload, Spin, Alert, Modal } from "antd";
import { FaFacebookF } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { UploadOutlined, LoadingOutlined } from "@ant-design/icons";
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
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

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
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleImageUpload = (info) => {
    if (info.file.originFileObj) {
      // Validate file size (max 5MB)
      if (info.file.originFileObj.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(info.file.originFileObj.type)) {
        setError("Please upload an image file (JPG, PNG, or GIF)");
        return;
      }

      setProfileImage(info.file.originFileObj);
      // Create preview URL
      const previewUrl = URL.createObjectURL(info.file.originFileObj);
      setImagePreview(previewUrl);
      setError(""); // Clear any previous errors
    }
  };

  const uploadProfileImage = async (user) => {
    if (!profileImage) return null;
    
    try {
      // Create a reference to the file in Firebase Storage
      const storageRef = ref(storage, `profile-images/${user.uid}/${Date.now()}-${profileImage.name}`);
      
      // Create file metadata including the content type
      const metadata = {
        contentType: profileImage.type,
      };
      
      // Upload the file and metadata
      const uploadTask = await uploadBytes(storageRef, profileImage, metadata);
      
      // Get the download URL
      const photoURL = await getDownloadURL(uploadTask.ref);
      
      return photoURL;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Failed to upload profile image");
    }
  };

  const handleSignUp = async () => {
    try {
      setLoading(true);
      setError("");

      // Validate inputs
      if (!username || !email || !password || !confirmPassword) {
        throw new Error("Please fill in all required fields");
      }

      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      if (!acceptedTerms) {
        throw new Error("Please accept the terms and conditions");
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

      // Verify the profile was updated successfully
      if (user.displayName !== username || (photoURL && user.photoURL !== photoURL)) {
        throw new Error("Failed to update user profile");
      }

      // Force refresh the auth token to ensure new profile data is available
      await user.reload();

      // Success - wait briefly to show success state
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate("/");
    } catch (error) {
      console.error("SignUp error:", error);
      setError(error.message);
      await new Promise(resolve => setTimeout(resolve, 1500));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setLoading(true);
      setError("");
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate("/");
    } catch (error) {
      setError(error.message);
      await new Promise(resolve => setTimeout(resolve, 1500));
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookSignUp = async () => {
    try {
      setLoading(true);
      setError("");
      const provider = new FacebookAuthProvider();
      await signInWithPopup(auth, provider);
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate("/");
    } catch (error) {
      setError(error.message);
      await new Promise(resolve => setTimeout(resolve, 1500));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Modal
        open={loading}
        footer={null}
        closable={false}
        centered
      >
        <div className="flex flex-col items-center">
          <Spin indicator={antIcon} />
          <div className="mt-4">Creating your account...</div>
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="mt-2">Uploading image: {uploadProgress}%</div>
          )}
        </div>
      </Modal>

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

          {error && (
            <Alert
              message="Error"
              description={error}
              type="error"
              showIcon
              closable
              className="mt-4"
              onClose={() => setError("")}
            />
          )}

          <div className="flex flex-col gap-3 mt-5">
            <Input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              required
            />
            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
              type="email"
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
            <Input
              placeholder="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              required
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
              showUploadList={false}
              beforeUpload={() => false}
              disabled={loading}
            >
              <Button icon={<UploadOutlined />} className="w-full" disabled={loading}>
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
              disabled={loading}
            />
            <label className={loading ? "text-gray-400" : ""}>
              I accept the terms and conditions
            </label>
          </div>

          <Button
            type="primary"
            className="bg-[#B55D51] border-none mt-4 w-full"
            onClick={handleSignUp}
            loading={loading}
          >
            Sign Up
          </Button>

          <div className="flex items-center mt-4 gap-2">
            <Button
              type="default"
              className="flex-1 flex items-center justify-center"
              onClick={handleGoogleSignUp}
              disabled={loading}
              icon={<FcGoogle className="mr-2" />}
            >
              Sign Up with Google
            </Button>
            <Button
              type="default"
              className="flex-1 flex items-center justify-center"
              onClick={handleFacebookSignUp}
              disabled={loading}
              icon={<FaFacebookF className="mr-2" />}
            >
              Sign Up with Facebook
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default SignUp;