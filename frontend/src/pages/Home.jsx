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
    <div className="relative min-h-screen min-w-0 bg-[#0d0f14] text-white overflow-hidden">
      <div
        className={`flex h-screen w-full ${
          userData ? "" : "pointer-events-none select-none"
        }`}
        aria-hidden={!userData}
      >
        <Sidebar />
        <ChatArea />
        <Artifact />
      </div>

      {!userData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-[#0d0f14]/60 backdrop-blur-lg">
          <div className="w-full max-w-90 bg-white/4 backdrop-blur-2xl border border-white/10 rounded-3xl p-9 flex flex-col items-center gap-7 shadow-2xl shadow-black/50">
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-4xl font-bold tracking-tight bg-linear-to-r from-white via-indigo-200 to-violet-300 bg-clip-text text-transparent">
                Welcome to SyntraAI
              </h1>
              <p className="text-[15px] text-slate-400">
                Sign in to unlock your AI workspace.
              </p>
            </div>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-medium text-white bg-linear-to-br from-indigo-500 to-violet-700 hover:from-indigo-400 hover:to-violet-600 active:from-indigo-600 active:to-violet-800 border border-indigo-500/30 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              onClick={googleLogin}
            >
              <FcGoogle size={17} /> Continue with Google
            </button>

            <p className="text-xs text-slate-600">
              Secured sign-in &middot; No account needed
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
