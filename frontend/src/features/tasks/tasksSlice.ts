import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import type { Task } from "../../types_tasks";
import { fetchTasksApi, createTaskApi, updateTaskApi, deleteTaskApi } from "./tasksAPI";
import { RootState } from "../../store";

const tasksAdapter = createEntityAdapter<Task>({
	selectId: (t) => t.id,
	sortComparer: (a, b) => (a.created_at ?? "").localeCompare(b.created_at ?? "")
});

export const fetchTasks = createAsyncThunk("tasks/fetchAll", async () => {
	return await fetchTasksApi();
});

export const createTask = createAsyncThunk("tasks/create", async (payload: Partial<Task>) => {
	return await createTaskApi(payload);
});

export const updateTask = createAsyncThunk("tasks/update", async ({ id, changes }: { id: number; changes: Partial<Task> }) => {
	return await updateTaskApi(id, changes);
});

export const deleteTask = createAsyncThunk("tasks/delete", async (id: number) => {
	await deleteTaskApi(id);
	return id;
});

const slice = createSlice({
	name: "tasks",
	initialState: tasksAdapter.getInitialState({ status: "idle", error: null } as any),
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchTasks.fulfilled, (s, a) => tasksAdapter.setAll(s, a.payload))
			.addCase(createTask.fulfilled, (s, a) => tasksAdapter.addOne(s, a.payload))
			.addCase(updateTask.fulfilled, (s, a) => tasksAdapter.upsertOne(s, a.payload))
			.addCase(deleteTask.fulfilled, (s, a) => tasksAdapter.removeOne(s, a.payload));
	}
});

export const tasksSelectors = tasksAdapter.getSelectors<RootState>((state) => state.tasks);
export default slice.reducer;
