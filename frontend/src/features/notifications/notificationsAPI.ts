import api from "../../api/axios";
import type { Notification } from "./types";

export async function fetchNotificationsApi() {
	const res = await api.get("/notifications/");
	return res.data as Notification[];
}

export async function markNotificationReadApi(id: number) {
	const res = await api.patch(`/notifications/${id}/`, { read: true });
	return res.data;
}

export async function markAllReadApi() {
	const res = await api.post("/notifications/mark_all_read/");
	return res.data;
}
