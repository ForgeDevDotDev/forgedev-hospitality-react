import { FC, useState } from 'react';

interface GuestFilterProps {
  value?: number;
  onChange?: (value: number) => void;
}

const GuestFilter: FC<GuestFilterProps> = ({ value: initialValue = 2, onChange }) => {
  const [guests, setGuests] = useState(initialValue);

  const increment = () => {
    if (guests < 20) {
      const newVal = guests + 1;
      setGuests(newVal);
      onChange?.(newVal);
    }
  };

  const decrement = () => {
    if (guests > 1) {
      const newVal = guests - 1;
      setGuests(newVal);
      onChange?.(newVal);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
      <label style={{ fontSize: '0.85rem', color: '#666' }}>Huéspedes</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <button
          onClick={decrement}
          disabled={guests <= 1}
          style={{
            width: '32px',
            height: '32px',
            border: '1px solid #ddd',
            background: '#fff',
            borderRadius: '4px',
            cursor: guests <= 1 ? 'not-allowed' : 'pointer',
            fontSize: '1rem',
            opacity: guests <= 1 ? 0.4 : 1,
          }}
        >
          −
        </button>
        <span style={{ minWidth: '24px', textAlign: 'center', fontWeight: 500 }}>{guests}</span>
        <button
          onClick={increment}
          style={{
            width: '32px',
            height: '32px',
            border: '1px solid #ddd',
            background: '#fff',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default GuestFilter;
