import React, { useState } from "react";
import { useAppDispatch } from "../store/hooks";
import { createTask } from "../features/tasks/tasksSlice";

export default function NewTaskForm() {
	const dispatch = useAppDispatch();
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");

	async function submit(e: React.FormEvent) {
		e.preventDefault();
		if (!title) return;
		await dispatch(createTask({ title, description }));
		setTitle(""); setDescription("");
	}

	return (
		<form onSubmit={submit} className="mb-4">
			<input className="w-full p-2 mb-2 border rounded" placeholder="Task title" value={title} onChange={(e) => setTitle(e.target.value)} />
			<textarea className="w-full p-2 mb-2 border rounded" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
			<button type="submit" className="px-3 py-2 bg-green-600 text-white rounded">Create</button>
		</form>
	);
}
