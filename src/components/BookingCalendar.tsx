import { FC, useState, useMemo } from 'react';

interface BookedDate {
  checkIn: string;
  checkOut: string;
}

interface BookingCalendarProps {
  bookedDates?: BookedDate[];
  onDateSelect?: (date: string) => void;
}

interface CalendarCell {
  day: number;
  month: number;
  year: number;
  dateStr: string;
}

const BookingCalendar: FC<BookingCalendarProps> = ({ bookedDates = [], onDateSelect }) => {
  const today = new Date();
  // BUG: When month changes via nextMonth/prevMonth, the calendar cells
  // don't properly update because selectedDate is stale — it holds a date
  // from the previous month that's no longer visible
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const dayHeaders = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

  const cells = useMemo<(CalendarCell | null)[]>(() => {
    const result: (CalendarCell | null)[] = [];
    const firstDay = new Date(currentYear, currentMonth, 1);
    // BUG: Offset calculation is wrong — getDay() returns 0 for Sunday,
    // but our calendar starts Monday. Should be (firstDay.getDay() + 6) % 7
    let offset = firstDay.getDay() - 1;
    if (offset < 0) offset = 6;

    for (let i = 0; i < offset; i++) result.push(null);

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      result.push({ day, month: currentMonth, year: currentYear, dateStr });
    }

    return result;
  }, [currentMonth, currentYear]);

  const isDateBooked = (cell: CalendarCell | null): boolean => {
    if (!cell) return false;
    return bookedDates.some((booking) => {
      const ci = new Date(booking.checkIn);
      const co = new Date(booking.checkOut);
      const d = new Date(cell.dateStr);
      return d >= ci && d < co;
    });
  };

  const isDateSelected = (cell: CalendarCell | null): boolean => {
    if (!cell || !selectedDate) return false;
    return cell.dateStr === selectedDate;
  };

  const handleSelect = (cell: CalendarCell | null) => {
    if (!cell || isDateBooked(cell)) return;
    setSelectedDate(cell.dateStr);
    onDateSelect?.(cell.dateStr);
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={prevMonth}>‹</button>
        <span>{monthNames[currentMonth]} {currentYear}</span>
        <button onClick={nextMonth}>›</button>
      </div>
      <div className="calendar-grid">
        {dayHeaders.map((day) => (
          <div key={day} className="calendar-cell" style={{ background: '#1a1a2e', color: '#fff', fontWeight: 600, cursor: 'default' }}>
            {day}
          </div>
        ))}
        {cells.map((cell, i) => (
          <div
            key={i}
            className={`calendar-cell ${!cell ? 'empty' : ''} ${isDateSelected(cell) ? 'selected' : ''} ${isDateBooked(cell) ? 'booked' : ''}`}
            onClick={() => handleSelect(cell)}
          >
            {cell ? cell.day : ''}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingCalendar;
