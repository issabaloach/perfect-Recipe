import React, { useState } from 'react';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Input from "antd/es/input/Input";
import { Button, Spin, Alert, Modal } from "antd";
import { FaFacebookF } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";
import { auth } from "../../utils/firebase";
import { useNavigate } from "react-router";
import { LoadingOutlined } from '@ant-design/icons';
import { Spinner } from '@nextui-org/react';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

function SignIn() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async () => {
    try {
      setLoading(true);
      setError("");
      await signInWithEmailAndPassword(auth, email, password);
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

  const handleGoogleSignIn = async () => {
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

  const handleFacebookSignIn = async () => {
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
    <div className="relative text-center">
      <Modal
        open={loading}
        footer={null}
        closable={false}
        centered
        
      >
        <Spin indicator={antIcon} />
        <div style={{ marginTop: 16 }}>Signing in...</div>
      </Modal>
      
      <Header />

      <div className="container mx-auto max-w-screen-lg mt-9 mb-10 px-4 mt-8 flex justify-center flex-row">
        <img
          src="https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cmVjaXBlfGVufDB8fDB8fHww"
          alt=""
          className="w-[450px] h-[500px]"
        />
        <div className="ml-5 mt-6">
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back!</h1>
          
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
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <Button
            type="primary"
            className="bg-[#B55D51] border-none mt-4 relative"
            onClick={handleSignIn}
            loading={loading}
          >
            Sign In
          </Button>

          <div className="flex items-center mt-4">
            <Button
              type="default"
              className="mr-2 flex items-center"
              onClick={handleGoogleSignIn}
              disabled={loading}
              icon={<FcGoogle className="mr-2" />}
            >
              Sign In with Google
            </Button>
            <Button
              type="default"
              className="flex items-center"
              onClick={handleFacebookSignIn}
              disabled={loading}
              icon={<FaFacebookF className="mr-2" />}
            >
              Sign In with Facebook
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default SignIn;