import { useEffect, useState } from 'react';
import { usePropertiesStore } from '../stores/properties';
import { amenitiesApi, pricingRulesApi } from '../api';

export default function AdminDashboardPage() {
  const { properties, fetchProperties, createProperty, deleteProperty } = usePropertiesStore();
  const [tab, setTab] = useState<'properties' | 'amenities' | 'pricing'>('properties');
  const [amenities, setAmenities] = useState<any[]>([]);
  const [newAmenity, setNewAmenity] = useState('');
  const [showAddProperty, setShowAddProperty] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState('');
  const [pricingRules, setPricingRules] = useState<any[]>([]);
  const [newProperty, setNewProperty] = useState({
    name: '',
    city: '',
    address: '',
    starRating: 3,
    description: '',
  });

  useEffect(() => {
    fetchProperties();
    amenitiesApi.list().then((res) => setAmenities(res.data.data));
  }, [fetchProperties]);

  const handleAddProperty = async () => {
    try {
      await createProperty({ ...newProperty, country: 'Spain' });
      setNewProperty({ name: '', city: '', address: '', starRating: 3, description: '' });
      setShowAddProperty(false);
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const handleDeleteProperty = async (id: string) => {
    if (!confirm('¿Eliminar esta propiedad?')) return;
    try {
      await deleteProperty(id);
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const handleAddAmenity = async () => {
    if (!newAmenity.trim()) return;
    try {
      const res = await amenitiesApi.create({ name: newAmenity });
      setAmenities([...amenities, res.data.data]);
      setNewAmenity('');
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const handleDeleteAmenity = async (id: string) => {
    try {
      await amenitiesApi.delete(id);
      setAmenities(amenities.filter((a) => a.id !== id));
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const loadPricingRules = async (propertyId: string) => {
    setSelectedPropertyId(propertyId);
    if (!propertyId) {
      setPricingRules([]);
      return;
    }
    try {
      const res = await pricingRulesApi.list({ propertyId });
      setPricingRules(res.data.data);
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: '1000px' }}>
      <h1>Panel de Administración</h1>

      <div style={{ display: 'flex', gap: 0, marginBottom: '1.5rem', borderBottom: '2px solid #ddd' }}>
        {(['properties', 'amenities', 'pricing'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'none',
              border: 'none',
              borderBottom: tab === t ? '2px solid #e94560' : '2px solid transparent',
              cursor: 'pointer',
              fontSize: '0.95rem',
              fontWeight: tab === t ? 600 : 400,
              color: tab === t ? '#e94560' : '#333',
            }}
          >
            {t === 'properties' ? 'Propiedades' : t === 'amenities' ? 'Comodidades' : 'Tarifas'}
          </button>
        ))}
      </div>

      {tab === 'properties' && (
        <div>
          <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.25rem' }}>Propiedades ({properties.length})</h2>
            <button
              className="btn btn-primary"
              onClick={() => setShowAddProperty(!showAddProperty)}
            >
              {showAddProperty ? 'Cancelar' : '+ Nueva Propiedad'}
            </button>
          </div>

          {showAddProperty && (
            <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', marginBottom: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <div className="form-group">
                <label>Nombre</label>
                <input
                  type="text"
                  placeholder="Hotel Ejemplo"
                  value={newProperty.name}
                  onChange={(e) => setNewProperty({ ...newProperty, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Ciudad</label>
                <input
                  type="text"
                  placeholder="Madrid"
                  value={newProperty.city}
                  onChange={(e) => setNewProperty({ ...newProperty, city: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Dirección</label>
                <input
                  type="text"
                  value={newProperty.address}
                  onChange={(e) => setNewProperty({ ...newProperty, address: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Categoría</label>
                <select
                  value={newProperty.starRating}
                  onChange={(e) => setNewProperty({ ...newProperty, starRating: parseInt(e.target.value, 10) })}
                >
                  <option value={3}>★★★</option>
                  <option value={4}>★★★★</option>
                  <option value={5}>★★★★★</option>
                </select>
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  rows={3}
                  value={newProperty.description}
                  onChange={(e) => setNewProperty({ ...newProperty, description: e.target.value })}
                />
              </div>
              <button className="btn btn-primary" onClick={handleAddProperty}>Guardar</button>
            </div>
          )}

          {properties.map((prop) => (
            <div key={prop.id} className="property-card" style={{ padding: '1rem', marginBottom: '0.75rem' }}>
              <h3>{prop.name}</h3>
              <p style={{ color: '#666' }}>📍 {prop.city} · {'⭐'.repeat(prop.starRating)}</p>
              <p style={{ color: '#666', fontSize: '0.85rem' }}>{prop.rooms?.length || 0} habitaciones</p>
              <button className="btn btn-secondary" onClick={() => handleDeleteProperty(prop.id)}>
                Eliminar
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === 'amenities' && (
        <div>
          <h2>Comodidades ({amenities.length})</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
            {amenities.map((am) => (
              <div
                key={am.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: '#fff',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '4px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}
              >
                {am.name}
                <button className="btn btn-secondary" onClick={() => handleDeleteAmenity(am.id)}>×</button>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              placeholder="Nueva comodidad"
              value={newAmenity}
              onChange={(e) => setNewAmenity(e.target.value)}
              style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
            />
            <button className="btn btn-primary" onClick={handleAddAmenity}>Añadir</button>
          </div>
        </div>
      )}

      {tab === 'pricing' && (
        <div>
          <h2>Reglas de Tarifas</h2>
          <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
            Selecciona una propiedad para ver sus reglas de precios.
          </p>
          <select
            value={selectedPropertyId}
            onChange={(e) => loadPricingRules(e.target.value)}
            style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '1rem' }}
          >
            <option value="">— Seleccionar —</option>
            {properties.map((prop) => (
              <option key={prop.id} value={prop.id}>{prop.name}</option>
            ))}
          </select>
          {pricingRules.map((rule) => (
            <div key={rule.id} className="property-card" style={{ padding: '1rem', marginBottom: '0.75rem' }}>
              <h3>{rule.name}</h3>
              <p style={{ color: '#666' }}>Tipo: {rule.type}</p>
              <p style={{ color: '#666' }}>Multiplicador: ×{rule.multiplier}</p>
              {rule.startDate && <p style={{ color: '#666' }}>Desde: {rule.startDate}</p>}
              {rule.endDate && <p style={{ color: '#666' }}>Hasta: {rule.endDate}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
