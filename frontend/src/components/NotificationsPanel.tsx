import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchNotifications, markNotificationRead, markAllRead, pushNotification } from "../features/notifications/notificationsSlice";

export default function NotificationsPanel() {
	const dispatch = useAppDispatch();
	const notifications = useAppSelector(s => s.notifications.items);

	useEffect(() => {
		dispatch(fetchNotifications());
	}, []);

	function onMarkRead(id: number) {
		dispatch(markNotificationRead(id));
	}

	function onMarkAll() {
		dispatch(markAllRead());
	}

	return (
		<div className="w-full max-w-md bg-white p-4 rounded shadow">
			<div className="flex justify-between items-center mb-3">
				<h3 className="font-semibold">Notifications</h3>
				<button onClick={onMarkAll} className="text-sm text-blue-600">Mark all</button>
			</div>
			<div className="space-y-2 max-h-64 overflow-auto">
				{notifications.length === 0 && <div className="text-sm text-gray-500">No notifications</div>}
				{notifications.map(n => (
					<div key={n.id} className={`p-2 border rounded ${n.read ? "bg-gray-50" : "bg-white"}`}>
						<div className="text-sm font-medium">{n.message}</div>
						<div className="text-xs text-gray-500">{new Date(n.created_at).toLocaleString()}</div>
						{!n.read && <button className="text-xs text-green-600 mt-1" onClick={() => onMarkRead(n.id)}>Mark read</button>}
					</div>
				))}
			</div>
		</div>
	);
}
