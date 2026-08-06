import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../utils/firebase.js";
import api from "../../utils/axios.js";
import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice.js";
import Sidebar from "../components/Sidebar.jsx";
import ChatArea from "../components/ChatArea.jsx";
import Artifact from "../components/Artifact.jsx";

function Home({ onLoginSuccess }) {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  // console.log(userData);

  const handleLogin = async (token) => {
    try {
      const { data } = await api.post("/api/auth", { token });
      dispatch(setUserData(data.user ?? data));
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Login failed";
      // console.error("Login error:", message);
      throw new Error(message, { cause: error });
    }
  };

  const googleLogin = async () => {
    try {
      const data = await signInWithPopup(auth, googleProvider);
      const token = await data.user.getIdToken();
      await handleLogin(token);
      await onLoginSuccess();
      // console.log(data);
    } catch (error) {
      // console.error(
      //   "Google sign-in error:",
      //   error.code || "LOGIN_FAILED",
      //   error.message,
      // );
      throw new Error(error);
    }
  };

  return (
    <div className="min-h-screen min-w-0 bg-[#0d0f14] text-white overflow-hidden">
      {userData ? (
        <div className="flex h-screen w-full">
          <Sidebar />
          <ChatArea />
          <Artifact />
        </div>
      ) : (
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="w-full max-w-85 bg-[#13151c] border border-white/8 rounded-2xl p-7 flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <h2 className="text-[17px] font-semibold text-slate-100 tracking-tight">
                Welcome in SyntraAI
              </h2>
              <p className="text-[15px] text-slate-500">
                Login or Signin to enjoy services.
              </p>
            </div>
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 py-2.75 rounded-xl text-sm font-medium text-white bg-linear-to-br from-indigo-500 to-violet-700 hover:from-indigo-400 hover:to-violet-600 active:from-indigo-600 active:to-violet-800 border border-indigo-500/30 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all duration-150 cursor-pointer"
              onClick={googleLogin}
            >
              <FcGoogle size={15} /> Continue with Google
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
