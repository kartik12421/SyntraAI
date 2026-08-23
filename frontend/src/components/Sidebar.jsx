import { useEffect, useState } from "react";
import {
  Coins,
  LogOut,
  MessageCircle,
  PanelLeftIcon,
  PenBoxIcon,
  Plus,
  PlusIcon,
  User,
  X,
} from "lucide-react";
import getConversation from "../../features/getConversation.js";
import { useDispatch, useSelector } from "react-redux";
import {
  addConversations,
  setConversations,
  setSelectConversations,
} from "../redux/conversationSlice.js";
import { createConversation } from "../../features/createConversation.js";
import logOut from "../../features/logOut.js";
import { clearUserData } from "../redux/userSlice.js";
import { setSidebarOpen } from "../redux/uiSlice.js";
import Payment from "./Payment.jsx";

function Sidebar() {
  const [collapse, setCollapse] = useState(false);
  const [isActive, setIsActive] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const { conversations, selectedConversation } = useSelector(
    (state) => state.conversation,
  );
  const { sidebarOpen } = useSelector((state) => state.ui);

  useEffect(() => {
    const getConvo = async () => {
      if (!userData) {
        dispatch(setConversations([]));
        return;
      }

      try {
        const data = await getConversation();
        dispatch(setConversations(data));
      } catch (error) {
        console.error("get conversation error:", error.message);
      }
    };

    getConvo();
  }, [dispatch, userData]);

  useEffect(() => {
    setIsActive(selectedConversation?._id || null);
  }, [selectedConversation]);

  const handleCreateConversation = async () => {
    if (!userData) return;

    try {
      const conversation = await createConversation();
      dispatch(addConversations(conversation));
      dispatch(setSelectConversations(conversation));
      setIsActive(conversation._id);
    } catch (error) {
      console.error("create conversation error:", error.message);
    }
  };

  const handleSelectConversation = (conversation) => {
    dispatch(setSelectConversations(conversation));
    setIsActive(conversation._id);
    dispatch(setSidebarOpen(false));
  };

  const handleLogout = async () => {
    try {
      await logOut();
      dispatch(clearUserData());
      dispatch(setConversations([]));
      dispatch(setSelectConversations(null));
      setIsActive(null);
    } catch (error) {
      console.error("logout error:", error.message);
    }
  };

  // collapse sidebar
  if (collapse) {
    return (
      <div className="hidden lg:flex flex-col items-center w-14 h-screen bg-[#0d0f14] border-r border-white/6 py-4 gap-1 shrink-0">
        <button
          type="button"
          className="flex items-center justify-center w-9 h-9 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-colors duration-150 bg-transparent border-none cursor-pointer mb-1"
          onClick={() => setCollapse(false)}
        >
          <PanelLeftIcon />
        </button>

        {/* plus button */}
        <button
          className="flex items-center justify-center w-9 h-9 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-colors duration-150 bg-transparent border-none cursor-pointer"
          onClick={() => {
            dispatch(setSelectConversations(null));
          }}
        >
          <Plus />
        </button>

        {/* conversations */}
        <div className="no-scrollbar flex-1 overflow-y-auto px-3 py-3">
          {conversations.length > 0 ? (
            <div className="space-y-1">
              {conversations.map((conversation) => (
                <button
                  key={conversation._id}
                  type="button"
                  onClick={() => handleSelectConversation(conversation)}
                  className={`w-full rounded-xl px-3 py-2.5 text-left text-sm transition-colors duration-150 ${
                    isActive === conversation._id
                      ? "bg-white/8 text-white"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <p className="flex items-center gap-2 truncate">
                    <MessageCircle size={16} className="shrink-0" />
                  </p>
                </button>
              ))}
            </div>
          ) : (
            <></>
          )}
        </div>

        <div className="relative shrink-0">
          {/* profile image */}
          {userData?.avatar || !imageError ? (
            <img
              className="w-9 h-9 rounded-[10px] object-cover border-2 border-cyan-400"
              src={userData?.avatar}
              alt="image"
              onError={() => {
                setImageError(true);
              }}
            />
          ) : (
            <div className="w-9 h-9 rounded-[10px] object-cover border-2 border-cyan-400">
              <User size={15} className="text-slate-400" />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => dispatch(setSidebarOpen(false))}
        />
      )}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 w-67.5 max-w-[85vw] h-screen shrink-0 bg-[#0d0f14] border-r border-white/6 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* top portion of Sidebar */}
          <div className="flex items-center gap-2.5 px-4 py-4 border-b border-white/6">
            <div
              className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-colors duration-150 bg-transparent border-none cursor-pointer"
              onClick={() => setCollapse(true)}
            >
              <PanelLeftIcon />
            </div>
            <span className="text-[16px] font-semibold text-white tracking-tight flex-1">
              SyntraAI
            </span>
            <span className="text-[10px] font-medium text-[#3be8ff] bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full tracking-wide">
              {userData?.plan} Plan
            </span>
            <button
              className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-colors duration-150 bg-transparent border-none cursor-pointer"
              onClick={() => {
                dispatch(setSelectConversations(null));
                dispatch(setSidebarOpen(false));
              }}
            >
              <PenBoxIcon size={17} />
            </button>
            <button
              type="button"
              aria-label="Close menu"
              className="flex lg:hidden items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-colors duration-150 bg-transparent border-none cursor-pointer"
              onClick={() => dispatch(setSidebarOpen(false))}
            >
              <X size={18} />
            </button>
          </div>

          {/* new chat */}
          <div className="px-4 pt-4 pb-1">
            <button
              className="w-full flex items-center justify-center gap-2 text-sm font-medium text-white bg-linear-to-br from-cyan-400 to-violet-600 rounded-xl py-2.5 border-none cursor-pointer hover:opacity-90 transition-opacity duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => {
                dispatch(setSelectConversations(null));
                dispatch(setSidebarOpen(false));
              }}
              disabled={!userData}
            >
              <PlusIcon size={16} />
              New Chat
            </button>
          </div>

          {/* Conversation */}
          <div className="no-scrollbar flex-1 overflow-y-auto px-3 py-3">
            {conversations.length > 0 ? (
              <div className="space-y-1">
                {conversations.map((conversation) => (
                  <button
                    key={conversation._id}
                    type="button"
                    onClick={() => handleSelectConversation(conversation)}
                    className={`w-full rounded-xl px-3 py-2.5 text-left text-sm transition-colors duration-150 ${
                      isActive === conversation._id
                        ? "bg-white/8 text-white"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <p className="flex items-center gap-2 truncate">
                      <MessageCircle size={16} className="shrink-0" />
                      {conversation.title || "New Chat"}
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-3 py-6 text-sm text-slate-500">
                {userData
                  ? "No conversations yet. Start a new chat to store one."
                  : "Sign in to view your conversations."}
              </div>
            )}
          </div>

          <div className="mx-2.6 h-px bg-white/6" />

          {/* footer */}
          <div className="px-3.5 py-3.5">
            {userData ? (
              <div className="flex items-center gap-2.5 cursor-pointer rounded-xl px-3 py-2.5 hover:bg-white/6 transition-colors duration-150">
                <div className="relative shrink-0">
                  {/* profile image */}
                  {userData?.avatar && !imageError ? (
                    <img
                      className="w-9 h-9 rounded-[10px] object-cover border-2 border-cyan-400"
                      src={userData?.avatar}
                      alt="image"
                      onError={() => {
                        setImageError(true);
                      }}
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-[10px] object-cover border-2 border-cyan-400">
                      <User size={15} className="text-slate-400" />
                    </div>
                  )}
                </div>

                {/* profile name */}
                <div className="flex-1 min-w-0 ml-2">
                  <p className="text-[15.5px] font-semibold text-white truncate">
                    {userData?.name || "User"}
                  </p>
                  <p className="text-[11px] text-[#3be8ff] mt-px">
                    {userData?.plan}
                  </p>
                </div>

                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      setShowPayment(true);
                    }}
                    className="flex items-center justify-center w-7 h-7 rounded-[7px] border-none bg-transparent text-yellow-600 cursor-pointer hover:bg-white/8 hover:text-slate-400 transition-all duration-150"
                  >
                    <Coins size={18} />
                  </button>
                  <button
                    className="flex items-center justify-center w-7 h-7 rounded-[7px] border-none bg-transparent text-red-600 cursor-pointer hover:bg-white/8 hover:text-slate-400 transition-all duration-150"
                    type="button"
                    onClick={handleLogout}
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              </div>
            ) : (
              <button>LogIn</button>
            )}
          </div>
        </div>

        <Payment
          open={showPayment}
          onClose={() => {
            setShowPayment(false);
          }}
        />
      </div>
    </>
  );
}

export default Sidebar;
