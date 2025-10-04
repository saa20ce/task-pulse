import React, { ReactNode, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchMe } from "../features/auth/authSlice";
import { initTasksSocket } from "../ws/tasksSocket";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
	const dispatch = useAppDispatch();
	const auth = useAppSelector(s => s.auth);

	useEffect(() => {
		if (!auth.user && auth.accessToken) {
			dispatch(fetchMe());
		}
	}, []);

	if (!auth.accessToken) {
		return <Navigate to="/login" replace />;
	}

	if (auth.accessToken) {
		initTasksSocket();
	}

	return <>{children}</>;
}
