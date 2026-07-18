import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePropertiesStore } from '../stores/properties';
import { useSearchStore } from '../stores/search';
import { amenitiesApi } from '../api';
import PropertyCard from '../components/PropertyCard';
import DateRangePicker from '../components/DateRangePicker';
import GuestFilter from '../components/GuestFilter';
import AmenitiesFilter from '../components/AmenitiesFilter';

export default function SearchPage() {
  const navigate = useNavigate();
  const { properties, loading, error, fetchProperties, searchProperties } = usePropertiesStore();
  const search = useSearchStore();
  const [amenities, setAmenities] = useState<{ id: string; name: string }[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  // BUG: This useEffect has a missing dependency — `search` is not included
  // so when searchStore values change externally, this doesn't re-fetch.
  // Also, amenities are fetched but the effect doesn't depend on anything that changes.
  useEffect(() => {
    const loadAmenities = async () => {
      try {
        const res = await amenitiesApi.list();
        setAmenities(res.data.data);
      } catch (err) {
        console.error('Failed to load amenities', err);
      }
    };
    loadAmenities();
    fetchProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // BUG: Broken pagination — this uses a fixed itemsPerPage but the total
  // count is never updated from the API response. Also, when filters change,
  // currentPage is not reset (see search store bug).
  const itemsPerPage = 6;
  const totalPages = Math.max(1, Math.ceil(properties.length / itemsPerPage));
  const paginatedProperties = properties.slice(
    (search.currentPage - 1) * itemsPerPage,
    search.currentPage * itemsPerPage
  );

  const handleSearch = async () => {
    const params: Record<string, unknown> = {
      guests: search.guests,
    };
    if (search.city) params.city = search.city;
    if (search.minStars > 0) params.minStars = search.minStars;
    if (search.selectedAmenities.length) params.amenities = search.selectedAmenities.join(',');
    if (search.checkIn && search.checkOut) {
      params.checkIn = search.checkIn;
      params.checkOut = search.checkOut;
      await searchProperties(params);
    } else {
      await fetchProperties(params);
    }
    setTotalCount(properties.length);
  };

  const goToProperty = (id: string) => {
    navigate(`/properties/${id}`);
  };

  return (
    <div>
      <h1>Buscar hoteles</h1>

      <div className="filters">
        <input
          type="text"
          placeholder="Ciudad (ej. Madrid)"
          value={search.city}
          onChange={(e) => search.setCity(e.target.value)}
          style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
        />
        <DateRangePicker
          checkIn={search.checkIn || ''}
          checkOut={search.checkOut || ''}
          onUpdate={(ci, co) => search.setDates(ci, co)}
        />
        <GuestFilter value={search.guests} onChange={(v) => search.setGuests(v)} />
        <select
          value={search.minStars}
          onChange={(e) => search.setMinStars(parseInt(e.target.value, 10))}
          style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
        >
          <option value={0}>Todas las categorías</option>
          <option value={3}>★★★</option>
          <option value={4}>★★★★</option>
          <option value={5}>★★★★★</option>
        </select>
        <button className="btn btn-primary" onClick={handleSearch}>Buscar</button>
      </div>

      <AmenitiesFilter
        amenities={amenities}
        selected={search.selectedAmenities}
        onToggle={search.toggleAmenity}
      />

      {error && <div className="error">{error}</div>}

      {loading ? (
        <div className="loading">Buscando hoteles...</div>
      ) : paginatedProperties.length > 0 ? (
        <>
          <div className="property-grid">
            {paginatedProperties.map((property) => (
              <PropertyCard key={property.id} property={property} onClick={goToProperty} />
            ))}
          </div>
          {/* BUG: Pagination shows even when there's only 1 page,
              and clicking page buttons doesn't trigger a new search —
              it just slices the already-loaded data */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={search.currentPage === 1}
                onClick={() => search.setPage(search.currentPage - 1)}
              >
                ‹ Anterior
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={page === search.currentPage ? 'active' : ''}
                  onClick={() => search.setPage(page)}
                >
                  {page}
                </button>
              ))}
              <button
                disabled={search.currentPage === totalPages}
                onClick={() => search.setPage(search.currentPage + 1)}
              >
                Siguiente ›
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="loading">
          <p>No se encontraron hoteles. Prueba con otros filtros.</p>
        </div>
      )}

      {/* TODO: Add map integration showing property locations */}
      {/* FIXME: This was planned but never implemented */}
    </div>
  );
}
