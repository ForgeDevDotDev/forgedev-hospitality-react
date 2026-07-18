import { FC, useState, FormEvent } from 'react';

interface Room {
  id: string;
  name: string;
  basePrice: number;
  capacity: number;
}

interface BookingFormProps {
  room?: Room;
  checkIn: string;
  checkOut: string;
  onSubmit: (data: Record<string, unknown>) => void;
}

const BookingForm: FC<BookingFormProps> = ({ room, checkIn, checkOut, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    numGuests: 1,
    specialRequests: '',
  });

  const nights = (() => {
    if (!checkIn || !checkOut) return 0;
    const ci = new Date(checkIn);
    const co = new Date(checkOut);
    return Math.ceil((co.getTime() - ci.getTime()) / (1000 * 60 * 60 * 24));
  })();

  // BUG: Shows base price × nights as "Total" without applying seasonal pricing
  const totalPrice = room ? room.basePrice * nights : 0;

  const formatPrice = (price: number): string =>
    new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(price);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      onSubmit({
        roomId: room?.id,
        checkIn,
        checkOut,
        numGuests: form.numGuests,
        specialRequests: form.specialRequests,
        guest: {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
        },
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="booking-form">
      <h2>Complete su reserva</h2>

      <div className="form-group">
        <label>Nombre</label>
        <input
          type="text"
          required
          placeholder="Juan"
          value={form.firstName}
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label>Apellidos</label>
        <input
          type="text"
          required
          placeholder="García"
          value={form.lastName}
          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          required
          placeholder="juan@email.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label>Teléfono</label>
        <input
          type="tel"
          placeholder="+34 666 123 456"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label>Número de huéspedes</label>
        <input
          type="number"
          min={1}
          max={room?.capacity || 10}
          value={form.numGuests}
          onChange={(e) => setForm({ ...form, numGuests: parseInt(e.target.value, 10) })}
        />
      </div>

      <div className="form-group">
        <label>Peticiones especiales</label>
        <textarea
          rows={3}
          placeholder="Cama extra, llegada tardía, etc."
          value={form.specialRequests}
          onChange={(e) => setForm({ ...form, specialRequests: e.target.value })}
        />
      </div>

      <div style={{ background: '#f9f9f9', padding: '1rem', borderRadius: '4px', margin: '1rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0' }}>
          <span>Habitación:</span>
          <span>{room?.name || '—'}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0' }}>
          <span>Check-in:</span>
          <span>{checkIn}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0' }}>
          <span>Check-out:</span>
          <span>{checkOut}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0' }}>
          <span>Noches:</span>
          <span>{nights}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem', borderTop: '1px solid #ddd', marginTop: '0.5rem', paddingTop: '0.5rem' }}>
          <span>Total:</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>
      </div>

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Reservando...' : 'Confirmar Reserva'}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
};

export default BookingForm;
