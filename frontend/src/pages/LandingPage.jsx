import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#1a1a1a] md:p-4 sm:p-0">
      <div className="flex h-full w-full max-w-md flex-col items-center gap-6 md:rounded-2xl bg-[#222222] px-6 py-8 shadow-lg shadow-black/30 sm:h-auto sm:w-auto sm:rounded-2xl sm:px-10 sm:py-12">
        <h1 className="text-center text-2xl font-semibold text-gray-200 sm:text-4xl">
          Welcome to <span className="text-blue-400">McCarthy.ai</span>
        </h1>
        <p className="text-center text-sm text-gray-400 sm:text-base">
          Your personal AI assistant
        </p>
        <div className="mt-6 flex w-full flex-col gap-4">
          <Link
            to="/login"
            className="rounded-full border border-transparent bg-blue-600 px-8 py-2 text-center text-gray-200 transition duration-200 hover:border-blue-600 hover:bg-transparent hover:text-blue-400 sm:px-32"
          >
            Log In
          </Link>
          <Link
            to="/signup"
            className="rounded-full border border-gray-400 px-8 py-2 text-center text-gray-300 transition duration-200 hover:bg-gray-400 hover:text-black sm:px-32"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
