import useAuthCheck from "../hooks/useAuthCheck";

function ProtectedRoute({ children }) {
  const loading = useAuthCheck();
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#1a1a1a] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500" />
          <p className="text-lg">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;
