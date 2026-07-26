import Home from "./pages/Home.jsx";
import { useEffect } from "react";
import { getCurrentUser } from "../features/getCurrentUser.js";
import { useDispatch } from "react-redux";
import { clearUserData, setUserData } from "./redux/userSlice.js";

function App() {
  const dispatch = useDispatch();

  const getUser = async () => {
    try {
      const data = await getCurrentUser();
      dispatch(setUserData(data));
    } catch (error) {
      console.error("Sync current user failed:", error.message);
      dispatch(clearUserData());
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
      <Home onLoginSuccess={getUser} />
    </>
  );
}

export default App;
