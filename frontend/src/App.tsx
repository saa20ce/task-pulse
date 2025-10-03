import { Routes, Route, Link } from "react-router-dom";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { logout } from "./features/auth/authSlice";

export default function App() {
	const dispatch = useAppDispatch();
	const auth = useAppSelector(s => s.auth);

	return (
		<div>
			<header className="bg-white shadow-sm p-4 flex justify-between items-center">
				<div className="container mx-auto flex items-center gap-4">
					<Link to="/" className="font-bold text-lg">TaskPulse</Link>
					<nav className="ml-auto flex gap-3">
						{!auth.user ? (
							<>
								<Link to="/login" className="text-sm">Login</Link>
								<Link to="/register" className="text-sm">Register</Link>
							</>
						) : (
							<>
								<span className="text-sm">Hi, {auth.user.first_name || auth.user.username}</span>
								<button onClick={() => dispatch(logout())} className="text-sm text-red-600">Logout</button>
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
							<div className="p-6 bg-white rounded shadow">Welcome to TaskPulse — your app shell</div>
						</ProtectedRoute>
					} />
				</Routes>
			</main>
		</div>
	);
}
