import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import { register } from "./authSlice";

export default function Register() {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [first_name, setFirstName] = useState("");
	const [last_name, setLastName] = useState("");

	async function submit(e: React.FormEvent) {
		e.preventDefault();
		const res = await dispatch(register({ email, password, first_name, last_name }));
		if (register.fulfilled.match(res)) {
			navigate("/login");
		}
	}

	return (
		<div className="max-w-md mx-auto mt-12 p-6 bg-white rounded shadow">
			<h2 className="text-xl font-semibold mb-4">Register</h2>
			<form onSubmit={submit}>
				<input className="w-full mb-2 p-2 border rounded" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
				<input className="w-full mb-2 p-2 border rounded" placeholder="First name" value={first_name} onChange={(e) => setFirstName(e.target.value)} />
				<input className="w-full mb-2 p-2 border rounded" placeholder="Last name" value={last_name} onChange={(e) => setLastName(e.target.value)} />
				<input className="w-full mb-4 p-2 border rounded" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
				<button type="submit" className="w-full py-2 bg-green-600 text-white rounded">Register</button>
			</form>
		</div>
	);
}
