import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [emailVal, setEmailVal] = useState("");
  const [passwordVal, setPasswordVal] = useState("");
  const navigate = useNavigate();

  const logInUser = async () => {
    try {
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailVal,
          password: passwordVal,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(`Login failed: ${data.detail}`);
        return;
      }

      localStorage.setItem("token", data.access_token);

      navigate("/chat");

      setEmailVal("");
      setPasswordVal("");
    } catch (error) {
      console.error("Network error:", error);
      alert("Network error");
    }
  };

  const formSubmit = async (e) => {
    e.preventDefault();
    logInUser();
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#1a1a1a] p-4 sm:p-0">
      <div className="flex h-full w-full max-w-md flex-col justify-center gap-5 rounded-2xl bg-[#222222] px-6 py-8 shadow-lg shadow-black/30 sm:h-auto sm:w-auto sm:rounded-2xl sm:px-8 sm:py-10">
        <h1 className="text-center text-3xl font-semibold text-gray-200">
          Log In
        </h1>

        <label className="flex flex-col text-sm text-gray-300">
          <span className="mb-1">Email</span>
          <input
            type="email"
            value={emailVal}
            onChange={(e) => setEmailVal(e.target.value)}
            required
            className="w-full rounded-md bg-[#2b2b2b] px-4 py-2 text-gray-200 placeholder-gray-500 outline-none transition focus:ring-2 focus:ring-gray-500 sm:w-[20rem]"
            placeholder="you@example.com"
          />
        </label>

        <label className="flex flex-col text-sm text-gray-300">
          <span className="mb-1">Password</span>
          <input
            type="password"
            value={passwordVal}
            onChange={(e) => setPasswordVal(e.target.value)}
            required
            className="w-full rounded-md bg-[#2b2b2b] px-4 py-2 text-gray-200 placeholder-gray-500 outline-none transition focus:ring-2 focus:ring-gray-500 sm:w-[20rem]"
            placeholder="••••••••"
          />
        </label>

        <button
          type="submit"
          onClick={formSubmit}
          className="rounded-md bg-[#3a3a3a] py-2 text-gray-200 transition hover:bg-[#4a4a4a]"
        >
          Log In
        </button>

        <p className="text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-400 underline hover:text-blue-300"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
