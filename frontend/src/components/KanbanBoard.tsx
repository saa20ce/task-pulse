import React, { useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchTasks, updateTask, tasksSelectors } from "../features/tasks/tasksSlice";
import TaskCard from "./TaskCard";
import NewTaskForm from "./NewTaskForm";
import type { Task } from "../types_tasks";

const COLUMNS: { key: string; title: string }[] = [
	{ key: "todo", title: "To Do" },
	{ key: "in_progress", title: "In Progress" },
	{ key: "done", title: "Done" },
];

export default function KanbanBoard() {
	const dispatch = useAppDispatch();
	const tasks = useAppSelector(tasksSelectors.selectAll);

	useEffect(() => {
		dispatch(fetchTasks());
	}, []);

	const tasksByStatus: Record<string, Task[]> = { todo: [], in_progress: [], done: [] };
	tasks.forEach(t => { (tasksByStatus[t.status] ||= []).push(t); });

	async function onDragEnd(result: DropResult) {
		const { destination, source, draggableId } = result;
		if (!destination) return;
		if (destination.droppableId === source.droppableId && destination.index === source.index) return;

		const taskId = Number(draggableId);
		const newStatus = destination.droppableId;
		await dispatch(updateTask({ id: taskId, changes: { status: newStatus } }));
	}

	return (
		<div>
			<NewTaskForm />
			<DragDropContext onDragEnd={onDragEnd}>
				<div className="grid grid-cols-3 gap-4">
					{COLUMNS.map(col => (
						<div key={col.key} className="bg-gray-100 p-3 rounded">
							<h3 className="font-semibold mb-3">{col.title}</h3>
							<Droppable droppableId={col.key}>
								{(provided) => (
									<div ref={provided.innerRef} {...provided.droppableProps} style={{ minHeight: 200 }}>
										{tasksByStatus[col.key].map((task, idx) => (
											<Draggable key={task.id} draggableId={String(task.id)} index={idx}>
												{(prov) => (
													<div ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps}>
														<TaskCard task={task} />
													</div>
												)}
											</Draggable>
										))}
										{provided.placeholder}
									</div>
								)}
							</Droppable>
						</div>
					))}
				</div>
			</DragDropContext>
		</div>
	);
}
