import { signInWithPopup } from "firebase/auth";
import React from "react";
import { auth, googleProvider } from "../utils/firebase.js";
import api from "../utils/axios.js";

function App() {
  const handleLogin = async (token) => {
    try {
      const { data } = await api.post("/auth/login", { token });
      console.log(data);
    } catch (error) {
      console.log(`Login failed: ${error.message}`);
    }
  };

  const googleLogin = async () => {
    const data = await signInWithPopup(auth, googleProvider);
    const token = await data.user.getIdToken();
    await handleLogin(token);
    console.log(data);
  };

  return (
    <div className="w-full h-screen bg-black flex items-center justify-center">
      <button className="w-50 h-24 bg-gray-300" onClick={googleLogin}>
        continue with google
      </button>
    </div>
  );
}

export default App;
