import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";

import { useAuth } from "../hooks/useAuth";

export const MustBeAuthenticated = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
			navigate("/login");
		}
  }, [navigate, user])

  return <Outlet />
};

export const MustNotBeAuthenticated = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

	useEffect(() => {
		if (user) {
			navigate("/");
		}
	}, [navigate, user]);

	return <Outlet />;
};
