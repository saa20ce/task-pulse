export type Notification = {
	id: number;
	recipient: number;
	actor?: { id: number; username: string } | null;
	notif_type: string;
	message: string;
	data?: Record<string, any> | null;
	read: boolean;
	created_at: string;
};
