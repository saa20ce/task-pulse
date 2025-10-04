import React, { useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { logout } from "./features/auth/authSlice";
import { initTasksSocket, closeTasksSocket } from "./ws/tasksSocket";
import NotificationsPanel from "./components/NotificationsPanel";
import KanbanBoard from "./components/KanbanBoard";

export default function App() {
	const dispatch = useAppDispatch();
	const auth = useAppSelector(s => s.auth);

	useEffect(() => {
		if (auth.accessToken) {
			initTasksSocket();
		} else {
			closeTasksSocket();
		}
		return () => {
			closeTasksSocket();
		};
	}, [auth.accessToken]);

	return (
		<div>
			<header className="bg-white shadow-sm p-4">
				<div className="container mx-auto flex items-center gap-4">
					<Link to="/" className="font-bold text-lg">TaskPulse</Link>
					<nav className="ml-auto flex items-center gap-3">
						{!auth.user ? (
							<>
								<Link to="/login" className="text-sm">Login</Link>
								<Link to="/register" className="text-sm">Register</Link>
							</>
						) : (
							<>
								<div className="mr-4">
									<NotificationsPanel />
								</div>
								<span className="text-sm">Hi, {auth.user.first_name || auth.user.username}</span>
								<button onClick={() => dispatch(logout())} className="text-sm text-red-600 ml-3">Logout</button>
							</>
						)}
					</nav>
				</div>
			</header>

			<main className="container mx-auto p-4">
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route path="/" element={
						<ProtectedRoute>
							<KanbanBoard />
						</ProtectedRoute>
					} />
					<Route path="/tasks" element={
						<ProtectedRoute>
							<KanbanBoard />
						</ProtectedRoute>
					} />
				</Routes>
			</main>
		</div>
	);
}
