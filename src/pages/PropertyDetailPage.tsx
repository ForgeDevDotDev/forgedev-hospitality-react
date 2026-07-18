import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePropertiesStore } from '../stores/properties';
import { useSearchStore } from '../stores/search';

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentProperty, loading, error, fetchProperty } = usePropertiesStore();
  const search = useSearchStore();

  useEffect(() => {
    if (id) fetchProperty(id);
  }, [id, fetchProperty]);

  const formatPrice = (price: number): string =>
    new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(price);

  // BUG: Inconsistent date display — this shows the raw ISO date string
  // without formatting, while other pages use formatted dates
  const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return '—';
    // FIXME: Should format consistently (dd/mm/yyyy) but just returns raw
    return dateStr;
  };

  const handleBookRoom = (roomId: string) => {
    navigate({
      pathname: '/booking',
      search: `?roomId=${roomId}&propertyId=${currentProperty?.id}&checkIn=${search.checkIn || ''}&checkOut=${search.checkOut || ''}&guests=${search.guests}`,
    });
  };

  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!currentProperty) return <div className="loading">Propiedad no encontrada</div>;

  return (
    <div style={{ maxWidth: '800px' }}>
      <h1>{currentProperty.name}</h1>
      <p style={{ color: '#666', margin: '0.5rem 0' }}>
        📍 {currentProperty.address}, {currentProperty.city}, {currentProperty.country}
      </p>
      <div style={{ margin: '0.5rem 0' }}>
        {'⭐'.repeat(currentProperty.starRating)}
      </div>
      <p style={{ margin: '1rem 0', lineHeight: 1.6 }}>{currentProperty.description}</p>

      {currentProperty.amenities && currentProperty.amenities.length > 0 && (
        <div style={{ margin: '2rem 0' }}>
          <h2>Comodidades</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
            {currentProperty.amenities.map((a) => (
              <span
                key={a.id}
                style={{
                  background: '#f0f0f0',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '4px',
                  fontSize: '0.85rem',
                }}
              >
                {a.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <div style={{ margin: '2rem 0' }}>
        <h2>Habitaciones disponibles</h2>
        <div
          style={{
            display: 'flex',
            gap: '1.5rem',
            padding: '0.75rem',
            background: '#f9f9f9',
            borderRadius: '4px',
            marginBottom: '1rem',
          }}
        >
          <span>📅 {formatDate(search.checkIn)} → {formatDate(search.checkOut)}</span>
          <span>👥 {search.guests} huéspedes</span>
        </div>

        <div style={{ display: 'grid', gap: '1rem' }}>
          {currentProperty.rooms?.map((room) => (
            <div
              key={room.id}
              style={{
                background: '#fff',
                padding: '1.5rem',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
              }}
            >
              <h3>{room.name}</h3>
              <p style={{ color: '#555', fontSize: '0.9rem' }}>{room.description}</p>
              <p style={{ color: '#666', fontSize: '0.85rem' }}>
                Capacidad: {room.capacity} personas · Habitación {room.roomNumber}
              </p>
              <div style={{ margin: '0.75rem 0' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#e94560' }}>
                  {formatPrice(room.basePrice)}
                </span>
                <span style={{ color: '#999', fontSize: '0.85rem' }}> por noche</span>
              </div>
              <button className="btn btn-primary" onClick={() => handleBookRoom(room.id)}>
                Reservar
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* TODO: Add reviews section */}
      {/* FIXME: Reviews feature was planned but never implemented */}
    </div>
  );
}
