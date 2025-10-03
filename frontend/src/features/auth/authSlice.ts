import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { registerApi, loginApi, meApi } from "./authAPI";
import type { User, TokenResponse } from "../../types";

type AuthState = {
	user: User | null;
	accessToken: string | null;
	refreshToken: string | null;
	status: "idle" | "loading" | "failed";
	error?: string | null;
};

const initialState: AuthState = {
	user: null,
	accessToken: localStorage.getItem("accessToken"),
	refreshToken: localStorage.getItem("refreshToken"),
	status: "idle",
	error: null,
};

export const register = createAsyncThunk("auth/register", async (payload: { email: string; password: string; first_name?: string; last_name?: string }) => {
	return await registerApi(payload);
});

export const login = createAsyncThunk("auth/login", async (payload: { username: string; password: string }) => {
	const tokens = await loginApi(payload);
	return tokens as TokenResponse;
});

export const fetchMe = createAsyncThunk("auth/me", async () => {
	return await meApi();
});

const slice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		logout(state) {
			state.user = null;
			state.accessToken = null;
			state.refreshToken = null;
			localStorage.removeItem("accessToken");
			localStorage.removeItem("refreshToken");
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(register.pending, (s) => { s.status = "loading"; })
			.addCase(register.fulfilled, (s) => { s.status = "idle"; })
			.addCase(register.rejected, (s, a) => { s.status = "failed"; s.error = a.error.message ?? "Registration failed"; })

			.addCase(login.pending, (s) => { s.status = "loading"; })
			.addCase(login.fulfilled, (s, a) => {
				s.status = "idle";
				s.accessToken = a.payload.access;
				s.refreshToken = a.payload.refresh;
				localStorage.setItem("accessToken", a.payload.access);
				localStorage.setItem("refreshToken", a.payload.refresh);
			})
			.addCase(login.rejected, (s, a) => { s.status = "failed"; s.error = a.error.message ?? "Login failed"; })

			.addCase(fetchMe.pending, (s) => { s.status = "loading"; })
			.addCase(fetchMe.fulfilled, (s, a) => { s.status = "idle"; s.user = a.payload; })
			.addCase(fetchMe.rejected, (s, a) => { s.status = "failed"; s.error = a.error.message ?? "Failed to fetch user"; });
	}
});

export const { logout } = slice.actions;
export default slice.reducer;
