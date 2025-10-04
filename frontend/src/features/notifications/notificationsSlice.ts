import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchNotificationsApi, markNotificationReadApi, markAllReadApi } from "./notificationsAPI";
import type { Notification } from "./types";

export const fetchNotifications = createAsyncThunk("notifications/fetch", async () => {
	return await fetchNotificationsApi();
});

export const markNotificationRead = createAsyncThunk("notifications/markRead", async (id: number) => {
	return await markNotificationReadApi(id);
});

export const markAllRead = createAsyncThunk("notifications/markAll", async () => {
	return await markAllReadApi();
});

type State = {
	items: Notification[];
	status: "idle" | "loading" | "failed";
};

const initialState: State = {
	items: [],
	status: "idle"
};

const slice = createSlice({
	name: "notifications",
	initialState,
	reducers: {
		pushNotification(state, action) {
			state.items.unshift(action.payload);
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchNotifications.pending, (s) => { s.status = "loading"; })
			.addCase(fetchNotifications.fulfilled, (s, a) => { s.status = "idle"; s.items = a.payload; })
			.addCase(fetchNotifications.rejected, (s) => { s.status = "failed"; })

			.addCase(markNotificationRead.fulfilled, (s, a) => {
				const idx = s.items.findIndex(i => i.id === a.payload.id);
				if (idx >= 0) s.items[idx].read = true;
			})
			.addCase(markAllRead.fulfilled, (s) => { s.items.forEach(i => i.read = true); });
	}
});

export const { pushNotification } = slice.actions;
export default slice.reducer;
