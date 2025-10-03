import api from "../../api/axios";
import type { TokenResponse, User } from "../../types";

export async function registerApi(payload: { email: string; password: string; first_name?: string; last_name?: string }) {
	const body = { username: payload.email, email: payload.email, ...payload };
	const res = await api.post("/auth/register/", body);
	return res.data;
}

export async function loginApi(payload: { username: string; password: string }): Promise<TokenResponse> {
	const res = await api.post("/auth/token/", payload);
	return res.data;
}

export async function meApi(): Promise<User> {
	const res = await api.get("/auth/me/");
	return res.data;
}
