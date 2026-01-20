import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [migrants, setMigrants] = useState([])
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, rejected: 0, male: 0, female: 0, other: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [formData, setFormData] = useState({
    fullName: '',
    nationality: '',
    passportNumber: '',
    passportType: 'Ordinary',
    visaType: 'Work Visa',
    visaStatus: 'Pending',
    gender: 'Male',
    dateOfBirth: '',
    email: '',
    phone: '',
    arrivalDate: '',
    department: '',
    sponsor: ''
  })

  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [filterGender, setFilterGender] = useState('All')

  const nationalities = ['USA', 'UK', 'Canada', 'Australia', 'Germany', 'France', 'Spain', 'Italy', 'China', 'India', 'Japan', 'Mexico', 'Brazil', 'Nigeria', 'Other']
  const passportTypes = ['Ordinary', 'Diplomatic', 'Official', 'Emergency']
  const visaTypes = ['Work Visa', 'Student Visa', 'Business Visa', 'Tourist Visa', 'Family Reunification', 'Investor Visa', 'Freelance Visa']
  const visaStatuses = ['Pending', 'Approved', 'Rejected', 'Expired', 'Under Review']

  // Fetch migrants and stats on mount
  useEffect(() => {
    fetchMigrants()
    fetchStats()
  }, [])

  const fetchMigrants = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/migrants')
      if (!response.ok) throw new Error('Failed to fetch migrants')
      const data = await response.json()
      setMigrants(data)
      setError(null)
    } catch (err) {
      console.error('Error fetching migrants:', err)
      setError('Failed to load migrant records')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/statistics')
      if (!response.ok) throw new Error('Failed to fetch statistics')
      const data = await response.json()
      setStats(data)
    } catch (err) {
      console.error('Error fetching statistics:', err)
    }
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        const response = await fetch(`/api/migrants/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
        if (!response.ok) throw new Error('Failed to update migrant')
        setEditingId(null)
      } else {
        const response = await fetch('/api/migrants', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
        if (!response.ok) throw new Error('Failed to create migrant')
      }
      
      // Refresh data
      await fetchMigrants()
      await fetchStats()
      
      setFormData({
        fullName: '',
        nationality: '',
        passportNumber: '',
        passportType: 'Ordinary',
        visaType: 'Work Visa',
        visaStatus: 'Pending',
        gender: 'Male',
        dateOfBirth: '',
        email: '',
        phone: '',
        arrivalDate: '',
        department: '',
        sponsor: ''
      })
      setShowForm(false)
    } catch (err) {
      console.error('Error saving migrant:', err)
      setError('Failed to save migrant record')
    }
  }

  const editMigrant = (migrant) => {
    setFormData(migrant)
    setEditingId(migrant.id)
    setShowForm(true)
  }

  const deleteMigrant = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return
    try {
      const response = await fetch(`/api/migrants/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete migrant')
      
      // Refresh data
      await fetchMigrants()
      await fetchStats()
    } catch (err) {
      console.error('Error deleting migrant:', err)
      setError('Failed to delete migrant record')
    }
  }

  const filteredMigrants = migrants.filter(m => {
    const matchesSearch = m.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.passportnumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.nationality?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'All' || m.visastatus === filterStatus
    const matchesGender = filterGender === 'All' || m.gender === filterGender
    return matchesSearch && matchesStatus && matchesGender
  })

  const getStatusColor = (status) => {
    switch(status) {
      case 'Approved': return '#28a745'
      case 'Pending': return '#ffc107'
      case 'Rejected': return '#dc3545'
      case 'Expired': return '#6c757d'
      case 'Under Review': return '#0dcaf0'
      default: return '#6c757d'
    }
  }

  const getGenderIcon = (gender) => {
    switch(gender) {
      case 'Male': return '♂️'
      case 'Female': return '♀️'
      default: return '⚭'
    }
  }

  const getGenderColor = (gender) => {
    switch(gender) {
      case 'Male': return '#007bff'
      case 'Female': return '#e74c3c'
      default: return '#95a5a6'
    }
  }

  return (
    <>
      <nav className="navbar">
        <div className="container">
          <h1>🛂 Immigration System</h1>
          <ul className="nav-links">
            <li><a href="#dashboard" onClick={(e) => { e.preventDefault(); setActiveTab('dashboard'); }}>Dashboard</a></li>
            <li><a href="#migrants" onClick={(e) => { e.preventDefault(); setActiveTab('migrants'); }}>Migrants</a></li>
            <li><a href="#statistics" onClick={(e) => { e.preventDefault(); setActiveTab('statistics'); }}>Statistics</a></li>
            <li><a href="#about" onClick={(e) => { e.preventDefault(); setActiveTab('about'); }}>About</a></li>
          </ul>
        </div>
      </nav>

      <main className="container">
        <section className="hero">
          <h2>Immigration Management System</h2>
          <p>Manage and track migrant records with comprehensive visa and passport information</p>
        </section>

        {error && (
          <div style={{
            padding: '1rem',
            backgroundColor: '#f8d7da',
            border: '1px solid #f5c6cb',
            borderRadius: '5px',
            color: '#721c24',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <section className="dashboard">
            <div className="card full-width">
              <h3>System Overview</h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginTop: '1rem'
              }}>
                <div style={{
                  padding: '1.5rem',
                  backgroundColor: '#e7f3ff',
                  borderRadius: '8px',
                  border: '2px solid #0dcaf0',
                  textAlign: 'center'
                }}>
                  <h4 style={{ fontSize: '2rem', color: '#0dcaf0' }}>{stats.total || 0}</h4>
                  <p style={{ color: '#666' }}>Total Migrants</p>
                </div>
                <div style={{
                  padding: '1.5rem',
                  backgroundColor: '#d1f5d6',
                  borderRadius: '8px',
                  border: '2px solid #28a745',
                  textAlign: 'center'
                }}>
                  <h4 style={{ fontSize: '2rem', color: '#28a745' }}>{stats.approved || 0}</h4>
                  <p style={{ color: '#666' }}>Approved Visas</p>
                </div>
                <div style={{
                  padding: '1.5rem',
                  backgroundColor: '#fff3cd',
                  borderRadius: '8px',
                  border: '2px solid #ffc107',
                  textAlign: 'center'
                }}>
                  <h4 style={{ fontSize: '2rem', color: '#ffc107' }}>{stats.pending || 0}</h4>
                  <p style={{ color: '#666' }}>Pending Review</p>
                </div>
                <div style={{
                  padding: '1.5rem',
                  backgroundColor: '#f8d7da',
                  borderRadius: '8px',
                  border: '2px solid #dc3545',
                  textAlign: 'center'
                }}>
                  <h4 style={{ fontSize: '2rem', color: '#dc3545' }}>{stats.rejected || 0}</h4>
                  <p style={{ color: '#666' }}>Rejected</p>
                </div>
              </div>
            </div>

            <div className="card full-width">
              <h3>Gender Distribution</h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '1rem',
                marginTop: '1rem'
              }}>
                <div style={{
                  padding: '1.5rem',
                  backgroundColor: '#d6eaf8',
                  borderRadius: '8px',
                  border: '2px solid #007bff',
                  textAlign: 'center'
                }}>
                  <h4 style={{ fontSize: '2rem', color: '#007bff' }}>♂️ {stats.male || 0}</h4>
                  <p style={{ color: '#666' }}>Male Migrants</p>
                </div>
                <div style={{
                  padding: '1.5rem',
                  backgroundColor: '#fadbd8',
                  borderRadius: '8px',
                  border: '2px solid #e74c3c',
                  textAlign: 'center'
                }}>
                  <h4 style={{ fontSize: '2rem', color: '#e74c3c' }}>♀️ {stats.female || 0}</h4>
                  <p style={{ color: '#666' }}>Female Migrants</p>
                </div>
                <div style={{
                  padding: '1.5rem',
                  backgroundColor: '#d5d8dc',
                  borderRadius: '8px',
                  border: '2px solid #95a5a6',
                  textAlign: 'center'
                }}>
                  <h4 style={{ fontSize: '2rem', color: '#95a5a6' }}>⚭ {stats.other || 0}</h4>
                  <p style={{ color: '#666' }}>Other</p>
                </div>
              </div>
            </div>

            <div className="card">
              <h3>Quick Actions</h3>
              <button className="btn" onClick={() => { setShowForm(true); setEditingId(null); setFormData({
                fullName: '',
                nationality: '',
                passportNumber: '',
                passportType: 'Ordinary',
                visaType: 'Work Visa',
                visaStatus: 'Pending',
                gender: 'Male',
                dateOfBirth: '',
                email: '',
                phone: '',
                arrivalDate: '',
                department: '',
                sponsor: ''
              }); }} style={{ width: '100%', cursor: 'pointer' }}>
                + Add New Migrant
              </button>
            </div>

            {showForm && (
              <div style={{
                padding: '1.5rem',
                marginBottom: '1.5rem',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                border: '2px solid #667eea'
              }}>
                <h4 style={{ marginBottom: '1rem' }}>{editingId ? 'Edit Migrant' : 'Add New Migrant'}</h4>
                <form onSubmit={handleSubmit}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '1rem'
                  }}>
                    <div>
                      <label><strong>Full Name *</strong></label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleFormChange}
                        required
                        placeholder="Enter full name"
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #ddd',
                          borderRadius: '5px',
                          fontSize: '1rem',
                          boxSizing: 'border-box',
                          marginTop: '0.25rem'
                        }}
                      />
                    </div>

                    <div>
                      <label><strong>Nationality *</strong></label>
                      <select
                        name="nationality"
                        value={formData.nationality}
                        onChange={handleFormChange}
                        required
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #ddd',
                          borderRadius: '5px',
                          fontSize: '1rem',
                          boxSizing: 'border-box',
                          marginTop: '0.25rem'
                        }}
                      >
                        <option value="">Select nationality</option>
                        {nationalities.map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>

                    <div>
                      <label><strong>Passport Number *</strong></label>
                      <input
                        type="text"
                        name="passportNumber"
                        value={formData.passportNumber}
                        onChange={handleFormChange}
                        required
                        placeholder="e.g., US123456789"
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #ddd',
                          borderRadius: '5px',
                          fontSize: '1rem',
                          boxSizing: 'border-box',
                          marginTop: '0.25rem'
                        }}
                      />
                    </div>

                    <div>
                      <label><strong>Passport Type</strong></label>
                      <select
                        name="passportType"
                        value={formData.passportType}
                        onChange={handleFormChange}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #ddd',
                          borderRadius: '5px',
                          fontSize: '1rem',
                          boxSizing: 'border-box',
                          marginTop: '0.25rem'
                        }}
                      >
                        {passportTypes.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>

                    <div>
                      <label><strong>Visa Type</strong></label>
                      <select
                        name="visaType"
                        value={formData.visaType}
                        onChange={handleFormChange}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #ddd',
                          borderRadius: '5px',
                          fontSize: '1rem',
                          boxSizing: 'border-box',
                          marginTop: '0.25rem'
                        }}
                      >
                        {visaTypes.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>

                    <div>
                      <label><strong>Visa Status</strong></label>
                      <select
                        name="visaStatus"
                        value={formData.visaStatus}
                        onChange={handleFormChange}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #ddd',
                          borderRadius: '5px',
                          fontSize: '1rem',
                          boxSizing: 'border-box',
                          marginTop: '0.25rem'
                        }}
                      >
                        {visaStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>

                    <div>
                      <label><strong>Gender</strong></label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleFormChange}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #ddd',
                          borderRadius: '5px',
                          fontSize: '1rem',
                          boxSizing: 'border-box',
                          marginTop: '0.25rem'
                        }}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label><strong>Date of Birth</strong></label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleFormChange}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #ddd',
                          borderRadius: '5px',
                          fontSize: '1rem',
                          boxSizing: 'border-box',
                          marginTop: '0.25rem'
                        }}
                      />
                    </div>

                    <div>
                      <label><strong>Email</strong></label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleFormChange}
                        placeholder="email@example.com"
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #ddd',
                          borderRadius: '5px',
                          fontSize: '1rem',
                          boxSizing: 'border-box',
                          marginTop: '0.25rem'
                        }}
                      />
                    </div>

                    <div>
                      <label><strong>Phone</strong></label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleFormChange}
                        placeholder="+1234567890"
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #ddd',
                          borderRadius: '5px',
                          fontSize: '1rem',
                          boxSizing: 'border-box',
                          marginTop: '0.25rem'
                        }}
                      />
                    </div>

                    <div>
                      <label><strong>Arrival Date</strong></label>
                      <input
                        type="date"
                        name="arrivalDate"
                        value={formData.arrivalDate}
                        onChange={handleFormChange}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #ddd',
                          borderRadius: '5px',
                          fontSize: '1rem',
                          boxSizing: 'border-box',
                          marginTop: '0.25rem'
                        }}
                      />
                    </div>

                    <div>
                      <label><strong>Department</strong></label>
                      <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleFormChange}
                        placeholder="e.g., IT, Education, Trade"
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #ddd',
                          borderRadius: '5px',
                          fontSize: '1rem',
                          boxSizing: 'border-box',
                          marginTop: '0.25rem'
                        }}
                      />
                    </div>

                    <div>
                      <label><strong>Sponsor/Employer</strong></label>
                      <input
                        type="text"
                        name="sponsor"
                        value={formData.sponsor}
                        onChange={handleFormChange}
                        placeholder="Company or organization"
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #ddd',
                          borderRadius: '5px',
                          fontSize: '1rem',
                          boxSizing: 'border-box',
                          marginTop: '0.25rem'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                    <button type="submit" className="btn">
                      {editingId ? 'Update Record' : 'Add Migrant'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setShowForm(false)
                        setEditingId(null)
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="card">
              <h3>System Information</h3>
              <p><strong>Purpose:</strong> Immigration record management</p>
              <p><strong>Functions:</strong> Visa tracking, passport verification</p>
              <p><strong>Database:</strong> PostgreSQL Primary/Replica</p>
            </div>
          </section>
        )}

        {/* Migrants Tab */}
        {activeTab === 'migrants' && (
          <section className="dashboard">
            <div className="card full-width">
              <h3>Migrant Records</h3>
              
              <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  placeholder="Search by name, passport, or nationality..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    flex: 1,
                    minWidth: '200px',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '1rem'
                  }}
                />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  style={{
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '1rem'
                  }}
                >
                  <option>All</option>
                  <option>Pending</option>
                  <option>Approved</option>
                  <option>Rejected</option>
                  <option>Under Review</option>
                  <option>Expired</option>
                </select>
                <select
                  value={filterGender}
                  onChange={(e) => setFilterGender(e.target.value)}
                  style={{
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '1rem'
                  }}
                >
                  <option>All</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
                <button className="btn" onClick={() => { setShowForm(true); setEditingId(null); setFormData({
                  fullName: '',
                  nationality: '',
                  passportNumber: '',
                  passportType: 'Ordinary',
                  visaType: 'Work Visa',
                  visaStatus: 'Pending',
                  gender: 'Male',
                  dateOfBirth: '',
                  email: '',
                  phone: '',
                  arrivalDate: '',
                  department: '',
                  sponsor: ''
                }); }}>
                  + Add New
                </button>
              </div>

              {showForm && (
                <div style={{
                  padding: '1.5rem',
                  marginBottom: '1.5rem',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  border: '2px solid #667eea'
                }}>
                  <h4 style={{ marginBottom: '1rem' }}>{editingId ? 'Edit Migrant' : 'Add New Migrant'}</h4>
                  <form onSubmit={handleSubmit}>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                      gap: '1rem'
                    }}>
                      <div>
                        <label><strong>Full Name *</strong></label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleFormChange}
                          required
                          placeholder="Enter full name"
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                            fontSize: '1rem',
                            boxSizing: 'border-box',
                            marginTop: '0.25rem'
                          }}
                        />
                      </div>

                      <div>
                        <label><strong>Nationality *</strong></label>
                        <select
                          name="nationality"
                          value={formData.nationality}
                          onChange={handleFormChange}
                          required
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                            fontSize: '1rem',
                            boxSizing: 'border-box',
                            marginTop: '0.25rem'
                          }}
                        >
                          <option value="">Select nationality</option>
                          {nationalities.map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                      </div>

                      <div>
                        <label><strong>Passport Number *</strong></label>
                        <input
                          type="text"
                          name="passportNumber"
                          value={formData.passportNumber}
                          onChange={handleFormChange}
                          required
                          placeholder="e.g., US123456789"
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                            fontSize: '1rem',
                            boxSizing: 'border-box',
                            marginTop: '0.25rem'
                          }}
                        />
                      </div>

                      <div>
                        <label><strong>Passport Type</strong></label>
                        <select
                          name="passportType"
                          value={formData.passportType}
                          onChange={handleFormChange}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                            fontSize: '1rem',
                            boxSizing: 'border-box',
                            marginTop: '0.25rem'
                          }}
                        >
                          {passportTypes.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>

                      <div>
                        <label><strong>Visa Type</strong></label>
                        <select
                          name="visaType"
                          value={formData.visaType}
                          onChange={handleFormChange}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                            fontSize: '1rem',
                            boxSizing: 'border-box',
                            marginTop: '0.25rem'
                          }}
                        >
                          {visaTypes.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>

                      <div>
                        <label><strong>Visa Status</strong></label>
                        <select
                          name="visaStatus"
                          value={formData.visaStatus}
                          onChange={handleFormChange}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                            fontSize: '1rem',
                            boxSizing: 'border-box',
                            marginTop: '0.25rem'
                          }}
                        >
                          {visaStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>

                      <div>
                        <label><strong>Gender</strong></label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleFormChange}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                            fontSize: '1rem',
                            boxSizing: 'border-box',
                            marginTop: '0.25rem'
                          }}
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label><strong>Date of Birth</strong></label>
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleFormChange}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                            fontSize: '1rem',
                            boxSizing: 'border-box',
                            marginTop: '0.25rem'
                          }}
                        />
                      </div>

                      <div>
                        <label><strong>Email</strong></label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleFormChange}
                          placeholder="email@example.com"
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                            fontSize: '1rem',
                            boxSizing: 'border-box',
                            marginTop: '0.25rem'
                          }}
                        />
                      </div>

                      <div>
                        <label><strong>Phone</strong></label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleFormChange}
                          placeholder="+1234567890"
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                            fontSize: '1rem',
                            boxSizing: 'border-box',
                            marginTop: '0.25rem'
                          }}
                        />
                      </div>

                      <div>
                        <label><strong>Arrival Date</strong></label>
                        <input
                          type="date"
                          name="arrivalDate"
                          value={formData.arrivalDate}
                          onChange={handleFormChange}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                            fontSize: '1rem',
                            boxSizing: 'border-box',
                            marginTop: '0.25rem'
                          }}
                        />
                      </div>

                      <div>
                        <label><strong>Department</strong></label>
                        <input
                          type="text"
                          name="department"
                          value={formData.department}
                          onChange={handleFormChange}
                          placeholder="e.g., IT, Education, Trade"
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                            fontSize: '1rem',
                            boxSizing: 'border-box',
                            marginTop: '0.25rem'
                          }}
                        />
                      </div>

                      <div>
                        <label><strong>Sponsor/Employer</strong></label>
                        <input
                          type="text"
                          name="sponsor"
                          value={formData.sponsor}
                          onChange={handleFormChange}
                          placeholder="Company or organization"
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                            fontSize: '1rem',
                            boxSizing: 'border-box',
                            marginTop: '0.25rem'
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                      <button type="submit" className="btn">
                        {editingId ? 'Update Record' : 'Add Migrant'}
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => {
                          setShowForm(false)
                          setEditingId(null)
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {loading ? (
                <p style={{ textAlign: 'center', color: '#666' }}>Loading migrants...</p>
              ) : (
                <div style={{
                  overflowX: 'auto'
                }}>
                  <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '0.95rem'
                  }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #ddd' }}>
                        <th style={{ padding: '1rem', textAlign: 'left' }}>Name</th>
                        <th style={{ padding: '1rem', textAlign: 'left' }}>Gender</th>
                        <th style={{ padding: '1rem', textAlign: 'left' }}>Nationality</th>
                        <th style={{ padding: '1rem', textAlign: 'left' }}>Passport</th>
                        <th style={{ padding: '1rem', textAlign: 'left' }}>Visa Type</th>
                        <th style={{ padding: '1rem', textAlign: 'left' }}>Status</th>
                        <th style={{ padding: '1rem', textAlign: 'left' }}>Email</th>
                        <th style={{ padding: '1rem', textAlign: 'left' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMigrants.length === 0 ? (
                        <tr>
                          <td colSpan="8" style={{ padding: '1rem', textAlign: 'center', color: '#999' }}>
                            No migrant records found
                          </td>
                        </tr>
                      ) : (
                        filteredMigrants.map(migrant => (
                          <tr key={migrant.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '1rem' }}>{migrant.fullname}</td>
                            <td style={{ padding: '1rem', color: getGenderColor(migrant.gender), fontWeight: 'bold', fontSize: '1.2rem' }}>
                              {getGenderIcon(migrant.gender)} {migrant.gender}
                            </td>
                            <td style={{ padding: '1rem' }}>{migrant.nationality}</td>
                            <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{migrant.passportnumber}</td>
                            <td style={{ padding: '1rem' }}>{migrant.visatype}</td>
                            <td style={{ padding: '1rem' }}>
                              <span style={{
                                display: 'inline-block',
                                padding: '0.35rem 0.75rem',
                                backgroundColor: getStatusColor(migrant.visastatus) + '22',
                                color: getStatusColor(migrant.visastatus),
                                borderRadius: '5px',
                                fontWeight: 'bold',
                                fontSize: '0.85rem'
                              }}>
                                {migrant.visastatus}
                              </span>
                            </td>
                            <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{migrant.email || '-'}</td>
                            <td style={{ padding: '1rem' }}>
                              <button
                                className="btn"
                                onClick={() => editMigrant(migrant)}
                                style={{
                                  padding: '0.35rem 0.75rem',
                                  fontSize: '0.85rem',
                                  marginRight: '0.25rem'
                                }}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-danger"
                                onClick={() => deleteMigrant(migrant.id)}
                                style={{
                                  padding: '0.35rem 0.75rem',
                                  fontSize: '0.85rem'
                                }}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Statistics Tab */}
        {activeTab === 'statistics' && (
          <section className="dashboard">
            <div className="card full-width">
              <h3>Visa Application Statistics</h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1rem',
                marginTop: '1rem'
              }}>
                {visaTypes.map(type => {
                  const count = migrants.filter(m => m.visatype === type).length
                  return (
                    <div key={type} style={{
                      padding: '1.5rem',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '8px',
                      border: '1px solid #ddd'
                    }}>
                      <h4 style={{ color: '#667eea', marginBottom: '0.5rem' }}>{type}</h4>
                      <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333' }}>{count}</p>
                      <p style={{ fontSize: '0.9rem', color: '#666' }}>
                        {count === 1 ? 'application' : 'applications'}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="card full-width">
              <h3>Visa Status Breakdown</h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginTop: '1rem'
              }}>
                {visaStatuses.map(status => {
                  const count = migrants.filter(m => m.visastatus === status).length
                  const percentage = migrants.length > 0 ? ((count / migrants.length) * 100).toFixed(1) : 0
                  return (
                    <div key={status} style={{
                      padding: '1.5rem',
                      backgroundColor: getStatusColor(status) + '15',
                      borderRadius: '8px',
                      border: `2px solid ${getStatusColor(status)}`
                    }}>
                      <h4 style={{ color: getStatusColor(status), marginBottom: '0.5rem' }}>{status}</h4>
                      <p style={{ fontSize: '2rem', fontWeight: 'bold', color: getStatusColor(status) }}>{count}</p>
                      <div style={{ marginTop: '0.5rem', backgroundColor: '#ddd', borderRadius: '5px', height: '8px' }}>
                        <div style={{
                          backgroundColor: getStatusColor(status),
                          height: '100%',
                          borderRadius: '5px',
                          width: `${percentage}%`
                        }} />
                      </div>
                      <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>{percentage}%</p>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="card">
              <h3>Gender Distribution</h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginTop: '1rem'
              }}>
                {['Male', 'Female', 'Other'].map(gender => {
                  const count = migrants.filter(m => m.gender === gender).length
                  const percentage = migrants.length > 0 ? ((count / migrants.length) * 100).toFixed(1) : 0
                  const color = getGenderColor(gender)
                  return (
                    <div key={gender} style={{
                      padding: '1.5rem',
                      backgroundColor: color + '15',
                      borderRadius: '8px',
                      border: `2px solid ${color}`
                    }}>
                      <h4 style={{ color: color, marginBottom: '0.5rem' }}>
                        {getGenderIcon(gender)} {gender}
                      </h4>
                      <p style={{ fontSize: '2rem', fontWeight: 'bold', color: color }}>{count}</p>
                      <div style={{ marginTop: '0.5rem', backgroundColor: '#ddd', borderRadius: '5px', height: '8px' }}>
                        <div style={{
                          backgroundColor: color,
                          height: '100%',
                          borderRadius: '5px',
                          width: `${percentage}%`
                        }} />
                      </div>
                      <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>{percentage}%</p>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="card">
              <h3>Nationality Distribution</h3>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {[...new Set(migrants.map(m => m.nationality))].filter(Boolean).map(nationality => {
                  const count = migrants.filter(m => m.nationality === nationality).length
                  return (
                    <div key={nationality} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '0.75rem 0',
                      borderBottom: '1px solid #eee'
                    }}>
                      <span>{nationality}</span>
                      <span style={{ fontWeight: 'bold', color: '#667eea' }}>{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* About Tab */}
        {activeTab === 'about' && (
          <section className="dashboard">
            <div className="card full-width">
              <h3>About Immigration System</h3>
              <p style={{ marginBottom: '1rem' }}>
                This is a comprehensive Immigration Management System designed to streamline the process of managing migrant records, visa applications, and passport information. Data is persisted to a PostgreSQL database.
              </p>
              
              <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
                <h4>Key Features:</h4>
                <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
                  <li>Complete migrant record management</li>
                  <li>Multiple visa types and status tracking</li>
                  <li>Passport type categorization</li>
                  <li>Gender and demographic information</li>
                  <li>Contact and employment details</li>
                  <li>Real-time statistics and analytics</li>
                  <li>Advanced search and filtering</li>
                  <li>Edit and delete records</li>
                </ul>
              </div>

              <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#e7f3ff', borderRadius: '5px' }}>
                <h4>Supported Data Fields:</h4>
                <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
                  <li><strong>Personal:</strong> Full name, gender, date of birth</li>
                  <li><strong>Passport:</strong> Number, type (Ordinary, Diplomatic, etc.)</li>
                  <li><strong>Visa:</strong> Type, status, arrival date</li>
                  <li><strong>Contact:</strong> Email, phone number</li>
                  <li><strong>Employment:</strong> Department, sponsor/employer</li>
                </ul>
              </div>

              <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#d1f5d6', borderRadius: '5px' }}>
                <h4>Technology Stack:</h4>
                <p><strong>Frontend:</strong> React 18, Vite, CSS3</p>
                <p><strong>Database:</strong> PostgreSQL 15 with Primary-Replica Replication</p>
                <p><strong>Infrastructure:</strong> Docker & Docker Compose</p>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer>
        <p>&copy; 2026 Immigration Management System. All rights reserved.</p>
      </footer>
    </>
  )
}

export default App
