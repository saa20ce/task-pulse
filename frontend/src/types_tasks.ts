export type TaskStatus = "todo" | "in_progress" | "done";

export type Task = {
	id: number;
	title: string;
	description?: string;
	status: TaskStatus;
	deadline?: string | null;
	owner: { id: number; username: string; email: string; first_name?: string; last_name?: string; };
	assignee?: number | null;
	created_at?: string;
	updated_at?: string;
};
