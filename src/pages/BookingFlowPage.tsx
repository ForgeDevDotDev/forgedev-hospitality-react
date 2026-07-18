import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useBookingsStore } from '../stores/bookings';
import { roomsApi, guestsApi } from '../api';
import BookingForm from '../components/BookingForm';

interface Room {
  id: string;
  name: string;
  description: string;
  capacity: number;
  basePrice: number;
}

export default function BookingFlowPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { createBooking } = useBookingsStore();

  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const roomId = searchParams.get('roomId') || '';
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';

  useEffect(() => {
    if (!roomId) {
      setError('No room selected');
      setLoading(false);
      return;
    }
    const loadRoom = async () => {
      try {
        const res = await roomsApi.get(roomId);
        setRoom(res.data.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadRoom();
  }, [roomId]);

  const formatPrice = (price: number): string =>
    new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(price);

  const nights = (() => {
    if (!checkIn || !checkOut) return 0;
    const ci = new Date(checkIn);
    const co = new Date(checkOut);
    return Math.ceil((co.getTime() - ci.getTime()) / (1000 * 60 * 60 * 24));
  })();

  const handleCreateBooking = async (data: Record<string, unknown>) => {
    setError('');
    setSuccess(false);
    try {
      const guestData = data.guest as Record<string, string>;
      let guestId: string;

      try {
        const guestRes = await guestsApi.create({
          firstName: guestData.firstName,
          lastName: guestData.lastName,
          email: guestData.email,
          phone: guestData.phone,
        });
        guestId = guestRes.data.data.id;
      } catch (err: any) {
        // FIXME: If guest already exists (email conflict), should look them up
        // For now, just rethrow
        throw err;
      }

      await createBooking({
        roomId: data.roomId,
        guestId,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        numGuests: data.numGuests,
        specialRequests: data.specialRequests,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Error al crear la reserva');
    }
  };

  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <div style={{ maxWidth: '700px' }}>
      <h1>Reservar habitación</h1>

      {error && !room && (
        <div className="error">
          <p>No se pudo cargar la habitación. <a href="/">Volver</a></p>
        </div>
      )}

      {room && (
        <div>
          <div
            style={{
              marginBottom: '2rem',
              padding: '1.5rem',
              background: '#fff',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h2>1. Confirmar habitación</h2>
            <div style={{ marginTop: '0.5rem' }}>
              <h3>{room.name}</h3>
              <p style={{ color: '#555' }}>{room.description}</p>
              <p>Capacidad: {room.capacity} personas</p>
              <p>Precio base: {formatPrice(room.basePrice)} / noche</p>
            </div>
            <div
              style={{
                display: 'flex',
                gap: '1.5rem',
                marginTop: '1rem',
                padding: '0.75rem',
                background: '#f9f9f9',
                borderRadius: '4px',
              }}
            >
              <span>Check-in: {checkIn}</span>
              <span>Check-out: {checkOut}</span>
              <span>Noches: {nights}</span>
            </div>
          </div>

          <div>
            <h2>2. Datos del huésped</h2>
            <BookingForm
              room={room}
              checkIn={checkIn}
              checkOut={checkOut}
              onSubmit={handleCreateBooking}
            />
          </div>

          {error && <p className="error">{error}</p>}
          {success && (
            <p style={{ color: '#28a745', fontSize: '1.1rem', marginTop: '1rem' }}>
              ✅ Reserva confirmada!{' '}
              <a href="/my-bookings" onClick={(e) => { e.preventDefault(); navigate('/my-bookings'); }}>
                Ver mis reservas
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
