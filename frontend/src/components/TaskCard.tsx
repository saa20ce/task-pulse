import React from "react";
import type { Task } from "../types_tasks";

export default function TaskCard({ task }: { task: Task }) {
	return (
		<div className="p-3 bg-white rounded shadow mb-2">
			<h4 className="font-medium">{task.title}</h4>
			{task.deadline && <div className="text-xs text-gray-500">Due: {new Date(task.deadline).toLocaleString()}</div>}
			<p className="text-sm text-gray-700 mt-2">{task.description}</p>
		</div>
	);
}
