// src/ws/tasksSocket.ts
import { store } from "../store";
import { createTask, updateTask, deleteTask } from "../features/tasks/tasksSlice";
import { pushNotification } from "../features/notifications/notificationsSlice";
import type { Task } from "../types_tasks";
import type { Notification } from "../features/notifications/types";

let ws: WebSocket | null = null;
let reconnectAttempts = 0;
let reconnectTimer: number | null = null;

function getWsUrl() {
	const env = import.meta.env.VITE_WS_URL;
	if (env) return env;
	const proto = window.location.protocol === "https:" ? "wss" : "ws";
	const host = window.location.hostname;
	const port = 8000;
	return `${proto}://${host}:${port}/ws/tasks/`;
}

function getTokenQuery() {
	const token = localStorage.getItem("accessToken");
	if (!token) return "";
	return `?token=${encodeURIComponent(token)}`;
}

export function initTasksSocket() {
	if (ws && ws.readyState === WebSocket.OPEN) return ws;

	const url = getWsUrl() + getTokenQuery();
	ws = new WebSocket(url);

	ws.onopen = () => {
		console.log("[WS] connected to", url);
		reconnectAttempts = 0;
		if (reconnectTimer) {
			clearTimeout(reconnectTimer);
			reconnectTimer = null;
		}
	};

	ws.onmessage = (ev) => {
		try {
			const data = JSON.parse(ev.data);
			if (data?.type === "task") {
				const evName = data.event;
				const payload: Task = data.payload;
				if (evName === "created") {
					store.dispatch(createTask.fulfilled(payload as any, "", payload as any));
				} else if (evName === "updated") {
					store.dispatch(updateTask.fulfilled(payload as any, "", { id: payload.id, changes: payload } as any));
				} else if (evName === "deleted") {
					const id = data.payload?.id;
					if (typeof id === "number") {
						store.dispatch(deleteTask.fulfilled(id as any, "", id as any));
					}
				} else if (evName === "deadline_reminder") {
					store.dispatch(pushNotification(payload as unknown as Notification));
				}
			}

			else if (data?.type === "notification") {
				const evName = data.event;
				const payload: Notification = data.payload;
				if (evName === "notification_created") {
					store.dispatch(pushNotification(payload));
				}
			}
		} catch (err) {
			console.error("[WS] parse error:", err);
		}
	};

	ws.onclose = (ev) => {
		console.warn("[WS] closed", ev.code, ev.reason);
		attemptReconnect();
	};

	ws.onerror = (err) => {
		console.error("[WS] error", err);
	};

	return ws;
}

export function closeTasksSocket() {
	if (ws) {
		try {
			ws.close();
		} catch (e) {
		}
		ws = null;
	}
	if (reconnectTimer) {
		clearTimeout(reconnectTimer);
		reconnectTimer = null;
	}
	reconnectAttempts = 0;
}

function attemptReconnect() {
	reconnectAttempts++;
	const delay = Math.min(30000, 1000 * 2 ** Math.min(reconnectAttempts, 6));
	if (reconnectTimer) clearTimeout(reconnectTimer);
	reconnectTimer = window.setTimeout(() => {
		const token = localStorage.getItem("accessToken");
		if (!token) {
			return;
		}
		initTasksSocket();
	}, delay);
}
