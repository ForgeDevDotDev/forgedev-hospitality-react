import { FC, useState } from 'react';

interface DateRangePickerProps {
  checkIn?: string;
  checkOut?: string;
  onUpdate?: (checkIn: string, checkOut: string) => void;
}

const DateRangePicker: FC<DateRangePickerProps> = ({ checkIn: initialCheckIn, checkOut: initialCheckOut, onUpdate }) => {
  const [checkIn, setCheckIn] = useState(initialCheckIn || '');
  const [checkOut, setCheckOut] = useState(initialCheckOut || '');
  const [error, setError] = useState('');

  const handleChange = () => {
    if (checkIn && checkOut) {
      if (checkOut < checkIn) {
        setError('La fecha de salida debe ser posterior a la de entrada');
        return;
      }
      // FIXME: Should check if checkIn === checkOut (same day = 0 nights)
      // Currently allows it, which leads to a confusing booking experience
      setError('');
      onUpdate?.(checkIn, checkOut);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <label style={{ fontSize: '0.85rem', color: '#666' }}>Check-in</label>
        <input
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          onBlur={handleChange}
          style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <label style={{ fontSize: '0.85rem', color: '#666' }}>Check-out</label>
        <input
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          onBlur={handleChange}
          style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
        />
      </div>
      {error && <span style={{ color: '#dc3545', fontSize: '0.85rem' }}>{error}</span>}
    </div>
  );
};

export default DateRangePicker;
