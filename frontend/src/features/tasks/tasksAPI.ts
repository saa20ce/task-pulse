import api from "../../api/axios";
import type { Task } from "../../types_tasks";

export async function fetchTasksApi() {
	const res = await api.get("/tasks/");
	return res.data as Task[];
}

export async function createTaskApi(payload: Partial<Task>) {
	const res = await api.post("/tasks/", payload);
	return res.data as Task;
}

export async function updateTaskApi(id: number, payload: Partial<Task>) {
	const res = await api.patch(`/tasks/${id}/`, payload);
	return res.data as Task;
}

export async function deleteTaskApi(id: number) {
	const res = await api.delete(`/tasks/${id}/`);
	return res.status === 204;
}
