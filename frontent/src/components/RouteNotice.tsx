import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const RouteNotice = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const state = location.state as { successMessage?: unknown } | null;
  const successMessage = typeof state?.successMessage === "string" ? state.successMessage : "";

  useEffect(() => {
    if (!successMessage) return;

    setMessage(successMessage);
    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, navigate, successMessage]);

  if (!message) return null;

  return <p className="success-message" role="status">{message}</p>;
};

export default RouteNotice;