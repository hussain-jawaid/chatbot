import { useState, useEffect, useRef } from "react";
import { VscLayoutSidebarLeftOff } from "react-icons/vsc";
import { FaRegTrashAlt } from "react-icons/fa";
import { IoIosAdd } from "react-icons/io";
import { FaArrowUp } from "react-icons/fa";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { Link } from "react-router-dom";

export async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };
  return fetch(url, { ...options, headers });
}

function Chat() {
  // Get current Logged In User Info
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  const userID = user?.user_id || null;
  const username = user?.username || "Guest";

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [newChatSession, setNewChatSession] = useState(true);
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState("");
  const [sessionIdToSaveMess, setSessionIdToSaveMess] = useState("");
  const messagesEndRef = useRef(null);

  // Chat Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Detect mobile device based on window size
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [sessions, setSessions] = useState([]);

  // Work on main logic

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await fetchWithAuth("http://127.0.0.1:8000/chat/sessions");
        const data = await res.json();

        if (Array.isArray(data["sessions"])) {
          setSessions(data["sessions"]);
        } else {
          setSessions([]);
        }
      } catch (err) {
        console.error("Failed to fetch sessions:", err);
        alert("Failed to fetch sessions:", err);
        setSessions([]);
      }
    };

    fetchSessions();
  }, []);

  const createSession = async () => {
    const res = await fetchWithAuth(
      "http://127.0.0.1:8000/chat/create-session",
      {
        method: "POST",
      },
    );
    const data = await res.json();
    const newSession = data["session"];
    setSessions((prev) => [newSession, ...prev]);
    setSessionIdToSaveMess(newSession.session_id);
    setMessages([]);
    setNewChatSession(false);
  };

  const fetchAllMessages = async (session_id) => {
    setNewChatSession(false);
    const res = await fetchWithAuth(
      `http://127.0.0.1:8000/chat/messages/${session_id}`,
    );
    const data = await res.json();
    setMessages(data["messages"]);
    setSessionIdToSaveMess(session_id);
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    // 1. Save user message frist
    await fetchWithAuth("http://127.0.0.1:8000/chat/save-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: sessionIdToSaveMess,
        sender: "user",
        content: inputVal,
      }),
    });

    // 2. Update session title to the first message
    if (messages.length === 0) {
      await fetchWithAuth(`http://127.0.0.1:8000/chat/update-title`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionIdToSaveMess,
          title: inputVal,
        }),
      });

      // 3. Update sessions state for sidebar display
      setSessions((prev) =>
        prev.map((s) =>
          s.session_id === sessionIdToSaveMess ? { ...s, title: inputVal } : s,
        ),
      );
    }

    // 4. Prepare history in Groq format
    const ChatHistory = [
      {sender: "user", content: "Your name is McCarthy!"},
      {sender: "bot", content: "That's sounds great, my name is McCarthy."},
      ...messages,
      { sender: "user", content: inputVal },
    ].map((msg) => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.content,
    }));

    // 5. Ask bot with history
    const res = await fetch("http://127.0.0.1:8000/chat/respond", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: ChatHistory }),
    });

    const data = await res.json();
    const botReply = data.response;

    // 6. Save bot reply
    await fetchWithAuth("http://127.0.0.1:8000/chat/save-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: sessionIdToSaveMess,
        sender: "bot",
        content: botReply,
      }),
    });

    // 7. Refresh messages UI
    const msgRes = await fetchWithAuth(
      `http://127.0.0.1:8000/chat/messages/${sessionIdToSaveMess}`,
    );
    const msgData = await msgRes.json();
    setMessages(msgData.messages);
    setInputVal("");
  };

  const delete_session = async (session_id) => {
    const confirmed = confirm(
      "Are you sure you want to delete this Chat Session?",
    );
    if (!confirmed) return;

    await fetchWithAuth("http://127.0.0.1:8000/chat/delete-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // ✅ This is required
      },
      body: JSON.stringify({
        session_id: session_id,
      }),
    });

    setSessions((prev) => prev.filter((s) => s.session_id !== session_id));
  };

  return (
    <div className="relative flex bg-[#121212] text-[#e0e0e0]">
      {/* Overlay for mobile when sidebar is open */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`z-50 h-screen border-r border-[#333333] bg-[#222222] pt-3 transition-all duration-200 ${
          isMobile
            ? `fixed left-0 top-0 ${sidebarOpen ? "w-[80%]" : "w-0 overflow-hidden"}`
            : `${sidebarOpen ? "w-[20%]" : "w-[4%]"}`
        }`}
      >
        {/* Toggle collapsed sidebar (desktop only) */}
        {!sidebarOpen && !isMobile && (
          <div className="flex justify-center">
            <button
              className="rounded-lg px-2 py-2 hover:bg-[#444444]"
              onClick={() => setSidebarOpen(true)}
            >
              <VscLayoutSidebarLeftOff className="text-lg text-gray-200" />
            </button>
          </div>
        )}

        {/* Full sidebar when open */}
        {sidebarOpen && (
          <div className="h-full overflow-hidden px-4">
            {/* Top Bar */}
            <div className="flex items-center justify-between">
              <Link to="/chat" className="w-[15%]">
                <img src="favicon.png" alt="" className="w-full object-cover" />
              </Link>
              <button
                className="rounded-lg px-2 py-2 hover:bg-[#444444]"
                onClick={() => setSidebarOpen(false)}
              >
                <VscLayoutSidebarLeftOff className="text-xl text-gray-200" />
              </button>
            </div>

            {/* New Chat Button */}
            <div className="mt-4" onClick={() => createSession()}>
              <button className="flex w-full items-center gap-2 rounded-lg bg-[#333333] px-3 py-2 text-sm hover:bg-[#444444]">
                <IoIosAdd className="text-xl" />
                New Chat
              </button>
            </div>

            {/* Session List */}
            <div className="hide-scrollbar mt-4 h-full flex-1 overflow-y-auto">
              <div className="space-y-1">
                {Array.isArray(sessions) && sessions.length > 0 ? (
                  sessions.map((item) => (
                    <div className="flex items-center justify-between rounded-lg pr-2 hover:bg-[#444444]">
                      <button
                        key={item.session_id}
                        className="truncate rounded-lg px-3 py-2 text-left text-sm text-gray-400 hover:bg-[#444444]"
                        onClick={() => fetchAllMessages(item.session_id)}
                      >
                        {item.title || "Untitled Chat"}
                      </button>
                      <span
                        onClick={() => delete_session(item.session_id)}
                        className="cursor-pointer text-sm text-gray-400 transition-all duration-200 md:hover:text-red-500"
                      >
                        <FaRegTrashAlt />
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-sm text-gray-500">
                    No chats yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Chat Area */}
      <main
        className={`flex h-screen flex-col transition-all duration-200 md:items-center ${
          isMobile ? "w-full" : sidebarOpen ? "w-[80%]" : "w-[96%]"
        }`}
      >
        {/* Window Top Bar */}
        <div className="hidden h-auto w-full items-center justify-end py-3 pr-20 md:flex">
          <button className="h-[35px] w-[35px] cursor-default rounded-full bg-blue-500">
            {username[0].toUpperCase()}
          </button>
        </div>

        {/* Mobile Top Bar */}
        {isMobile && (
          <div className="flex items-center justify-between border-b border-[#333333] bg-[#222222] p-4">
            <button className="px-2 py-2" onClick={() => setSidebarOpen(true)}>
              <VscLayoutSidebarLeftOff className="text-xl text-gray-200" />
            </button>
            <div className="">
              <p>McCarthy.ai</p>
            </div>
          </div>
        )}

        {/* Message Area */}
        {newChatSession ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <h1 className="mb-4 text-3xl font-semibold md:text-4xl">
                Welcome to McCarthy.ai
              </h1>
              <p className="text-lg text-gray-400">Where should we begin?</p>
            </div>
          </div>
        ) : (
          <div className="hide-scrollbar flex flex-1 flex-col gap-6 overflow-y-auto px-4 py-6 md:w-[70%] md:px-0">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                ref={messagesEndRef}
                className={`flex gap-3 ${
                  msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {/* Message Content */}
                <div
                  className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`group relative rounded-2xl py-3 ${
                      msg.sender === "user"
                        ? "max-w-[17rem] bg-gray-700 px-4 text-gray-200 md:max-w-md"
                        : "w-full text-gray-200"
                    }`}
                  >
                    {/* Message content */}
                    <div
                      className="prose prose-invert max-w-full break-words leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(
                          marked.parse(msg.content || ""),
                        ),
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Input Area */}
        <div className="px-4 py-4 md:w-[70%] md:px-0">
          <div className="mx-auto">
            <form
              onSubmit={(e) => sendMessage(e)}
              className="relative rounded-full border border-[#333333] bg-[#222222] p-2 md:p-3"
            >
              <input
                type="text"
                placeholder="Type your message..."
                value={inputVal}
                className="w-full bg-transparent px-3 py-2 pr-12 text-gray-200 placeholder-gray-400 outline-none"
                onChange={(e) => setInputVal(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full bg-gray-400 p-2 text-black transition-colors hover:bg-gray-500"
              >
                <FaArrowUp className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Chat;
