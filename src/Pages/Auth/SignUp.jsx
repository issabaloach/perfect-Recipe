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
import { Spinner } from '@nextui-org/react';

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
      setError("");

      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      if (!acceptedTerms) {
        setError("Please accept the terms and conditions");
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

      // Success - wait briefly to show success state
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate("/");
    } catch (error) {
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
        <Spin indicator={antIcon} />
        <div style={{ marginTop: 16 }}>Creating your account...</div>
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
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <Input
              placeholder="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
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
                Upload Image
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
              icon={<FcGoogle className="mr-2" />}
            >
              Sign Up with Google
            </Button>
            <Button
              type="default"
              className="flex items-center"
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