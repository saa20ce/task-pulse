import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { login, fetchMe } from "./authSlice";

export default function Login() {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const status = useAppSelector(s => s.auth.status);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	async function submit(e: React.FormEvent) {
		e.preventDefault();
		const result = await dispatch(login({ username, password }));
		if (login.fulfilled.match(result)) {
			await dispatch(fetchMe());
			navigate("/");
		} else {
		}
	}

	return (
		<div className="max-w-md mx-auto mt-12 p-6 bg-white rounded shadow">
			<h2 className="text-xl font-semibold mb-4">Login</h2>
			<form onSubmit={submit}>
				<input className="w-full mb-3 p-2 border rounded" placeholder="Email or username" value={username} onChange={(e) => setUsername(e.target.value)} />
				<input className="w-full mb-3 p-2 border rounded" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
				<button type="submit" className="w-full py-2 bg-blue-600 text-white rounded">{status === "loading" ? "Loading..." : "Login"}</button>
			</form>
		</div>
	);
}
