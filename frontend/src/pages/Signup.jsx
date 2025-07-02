import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const [usernameVal, setUsernameVal] = useState("");
  const [emailVal, setEmailVal] = useState("");
  const [passwordVal, setPasswordVal] = useState("");
  const navigate = useNavigate();

  const signUpUser = async () => {
    try {
      const response = await fetch("http://localhost:8000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: usernameVal,
          email: emailVal,
          password: passwordVal,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(`Signup failed: ${data.detail}`);
        return;
      }

      // Auto login
      const loginResponse = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailVal,
          password: passwordVal,
        }),
      });

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        alert("Signup succeeded but login failed.");
        return;
      }

      localStorage.setItem("token", loginData.access_token);

      navigate("/chat");

      setUsernameVal("");
      setEmailVal("");
      setPasswordVal("");
    } catch (error) {
      console.error("Network error:", error);
      alert("Network error");
    }
  };

  const formSubmit = (e) => {
    e.preventDefault();
    signUpUser();
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#1a1a1a] md:p-4">
      <div className="flex h-full w-full max-w-md flex-col justify-center gap-5 md:rounded-2xl bg-[#222222] px-6 py-8 shadow-lg shadow-black/30 sm:h-auto sm:w-auto sm:rounded-2xl sm:px-8 sm:py-10">
        <h1 className="text-center text-3xl font-semibold text-gray-200">
          Sign Up
        </h1>

        <label className="flex flex-col text-sm text-gray-300">
          <span className="mb-1">Username</span>
          <input
            type="text"
            value={usernameVal}
            onChange={(e) => setUsernameVal(e.target.value)}
            required
            className="w-full rounded-md bg-[#2b2b2b] px-4 py-2 text-gray-200 placeholder-gray-500 outline-none transition focus:ring-2 focus:ring-gray-500 sm:w-[20rem]"
            placeholder="Your username"
          />
        </label>

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
          Sign Up
        </button>

        <p className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-400 underline hover:text-blue-300"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
