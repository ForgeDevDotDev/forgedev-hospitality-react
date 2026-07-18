import { FC } from 'react';

interface Property {
  id: string;
  name: string;
  description: string;
  city: string;
  country: string;
  starRating: number;
  rooms?: { basePrice: number }[];
  amenities?: { id: string; name: string }[];
}

interface PropertyCardProps {
  property: Property;
  onClick?: (id: string) => void;
}

const PropertyCard: FC<PropertyCardProps> = ({ property, onClick }) => {
  const propertyImage = `https://picsum.photos/seed/${property.id || 'default'}/400/200`;

  // FIXME: Inconsistent currency formatting — should use Intl.NumberFormat
  const formatPrice = (price: number): string => `€${price.toFixed(2)}`;

  return (
    <div className="property-card" onClick={() => onClick?.(property.id)}>
      <img src={propertyImage} alt={property.name} />
      <div className="card-body">
        <h3>{property.name}</h3>
        <p style={{ color: '#666', fontSize: '0.9rem', margin: '0.25rem 0' }}>
          📍 {property.city}, {property.country}
        </p>
        <div style={{ margin: '0.25rem 0' }}>
          {'⭐'.repeat(property.starRating)}
        </div>
        <p style={{ color: '#555', fontSize: '0.85rem', margin: '0.5rem 0' }}>
          {property.description}
        </p>
        <div style={{ margin: '0.5rem 0' }}>
          <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#e94560' }}>
            {formatPrice(property.rooms?.[0]?.basePrice || 0)}
          </span>
          {/* BUG: This label says "per night" but the value is the lowest room base price,
              not necessarily what the user will pay (no seasonal pricing shown) */}
          <span style={{ color: '#999', fontSize: '0.85rem' }}> / noche</span>
        </div>
        {property.amenities && property.amenities.length > 0 && (
          <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            {property.amenities.slice(0, 4).map((a) => (
              <span
                key={a.id}
                style={{
                  background: '#f0f0f0',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  color: '#555',
                }}
              >
                {a.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyCard;
