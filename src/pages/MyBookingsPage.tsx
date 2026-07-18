import { useEffect } from 'react';
import { useBookingsStore } from '../stores/bookings';

export default function MyBookingsPage() {
  const { bookings, loading, error, fetchBookings, cancelBooking } = useBookingsStore();

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // BUG: Inconsistent date formatting — uses toLocaleDateString() without locale
  // Some dates show as MM/DD/YYYY, others as DD/MM/YYYY depending on browser locale
  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString();
  };

  const formatPrice = (price: number): string =>
    new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(price);

  const handleCancel = async (id: string) => {
    if (!confirm('¿Estás seguro de cancelar esta reserva?')) return;
    try {
      await cancelBooking(id);
    } catch (err: any) {
      alert('Error al cancelar: ' + err.message);
    }
  };

  if (loading) return <div className="loading">Cargando reservas...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div style={{ maxWidth: '800px' }}>
      <h1>Mis Reservas</h1>

      {bookings.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="property-card"
              style={{
                padding: '1.5rem',
                opacity: booking.status === 'CANCELLED' ? 0.6 : 1,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h3>{booking.room?.name || 'Habitación'}</h3>
                <span
                  style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    background: booking.status === 'CONFIRMED' ? '#d4edda' : '#f8d7da',
                    color: booking.status === 'CONFIRMED' ? '#155724' : '#721c24',
                  }}
                >
                  {booking.status}
                </span>
              </div>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>
                {booking.room?.property?.name || '—'}
              </p>
              <div style={{ display: 'flex', gap: '1.5rem', margin: '0.75rem 0' }}>
                <span>📅 {formatDate(booking.checkIn)} → {formatDate(booking.checkOut)}</span>
                <span>👥 {booking.numGuests} huéspedes</span>
              </div>
              <div style={{ fontWeight: 700, marginBottom: '0.75rem' }}>
                Total: {formatPrice(booking.totalPrice)}
              </div>
              {booking.status === 'CONFIRMED' && (
                <button className="btn btn-secondary" onClick={() => handleCancel(booking.id)}>
                  Cancelar reserva
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="loading" style={{ textAlign: 'center', padding: '3rem' }}>
          <p>No tienes reservas todavía.</p>
          <a href="/" className="btn btn-primary" style={{ display: 'inline-block', marginTop: '1rem', textDecoration: 'none' }}>
            Buscar hoteles
          </a>
        </div>
      )}
    </div>
  );
}
