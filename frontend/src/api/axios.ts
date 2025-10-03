import axios from "axios";
import store from "../store";

const baseURL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

const api = axios.create({
	baseURL,
	headers: {
		"Content-Type": "application/json"
	},
});

api.interceptors.request.use((config) => {
	const state = store.getState() as any;
	const token = state.auth?.accessToken;
	if (token && config.headers) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

export default api;
