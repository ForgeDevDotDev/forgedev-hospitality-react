import { FC } from 'react';

interface Amenity {
  id: string;
  name: string;
}

interface AmenitiesFilterProps {
  amenities: Amenity[];
  selected: string[];
  onToggle: (amenity: string) => void;
}

const AmenitiesFilter: FC<AmenitiesFilterProps> = ({ amenities, selected, onToggle }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <label style={{ fontSize: '0.85rem', color: '#666', fontWeight: 500 }}>Comodidades</label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {amenities.map((amenity) => (
          <label
            key={amenity.id}
            style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', cursor: 'pointer' }}
          >
            <input
              type="checkbox"
              value={amenity.name}
              checked={selected.includes(amenity.name)}
              onChange={() => onToggle(amenity.name)}
            />
            {amenity.name}
          </label>
        ))}
      </div>
    </div>
  );
};

export default AmenitiesFilter;
