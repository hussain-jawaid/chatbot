import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function useAuthCheck() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/signup");
        return;
      }

      try {
        const res = await fetch("http://localhost:8000/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          navigate("/login");
          return;
        }

        const user = await res.json();
        localStorage.setItem("user", JSON.stringify(user));
      } catch (err) {
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [navigate]);

  return loading;
}
