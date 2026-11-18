import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Notification, listMyNotifications, markRead } from '../services/notifications';

export function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  async function load() {
    if (!user) return;
    const data = await listMyNotifications(user.id);
    setNotifications(data);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  async function handleMarkRead(id: string) {
    await markRead(id);
    await load();
  }

  return (
    <div>
      <h1>Notificaciones</h1>
      <p className="provisional-notice">
        Interfaz provisional — solo canal interno (IN_APP); el canal EMAIL todavía no envía nada
        realmente (pendiente de proveedor de correo, ver pendientes manuales).
      </p>

      <div className="section-gap">
        {notifications.map((n) => (
          <div key={n.id} className="card section-gap">
            <p>
              <strong>{n.title}</strong> <span className="badge">{n.channel}</span>{' '}
              {!n.readAt && <span className="badge">no leída</span>}
            </p>
            <p>{n.body}</p>
            <p className="badge">{new Date(n.createdAt).toLocaleString('es-CO')}</p>
            {!n.readAt && (
              <button className="btn-secondary" onClick={() => handleMarkRead(n.id)}>Marcar como leída</button>
            )}
          </div>
        ))}
        {notifications.length === 0 && <p>No tienes notificaciones.</p>}
      </div>
    </div>
  );
}
