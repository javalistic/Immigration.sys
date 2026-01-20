import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [activeTab, setActiveTab] = useState('home')
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [todos, setTodos] = useState([
    { id: 1, text: 'Set up PostgreSQL replication', completed: true },
    { id: 2, text: 'Deploy web portal', completed: true },
    { id: 3, text: 'Configure database connections', completed: false },
    { id: 4, text: 'Implement real-time sync', completed: false }
  ])
  const [newTodo, setNewTodo] = useState('')
  const [systemStatus, setSystemStatus] = useState({
    primary: 'running',
    replica: 'running',
    web: 'running'
  })

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setFormData({ name: '', email: '', message: '' })
    setTimeout(() => setSubmitted(false), 3000)
  }

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }])
      setNewTodo('')
    }
  }

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const refreshStatus = () => {
    setSystemStatus({
      primary: 'running',
      replica: 'running',
      web: 'running'
    })
  }

  return (
    <>
      <nav className="navbar">
        <div className="container">
          <h1>🚀 Interactive Portal</h1>
          <ul className="nav-links">
            <li><a href="#home" onClick={(e) => { e.preventDefault(); setActiveTab('home'); }}>Home</a></li>
            <li><a href="#about" onClick={(e) => { e.preventDefault(); setActiveTab('about'); }}>About</a></li>
            <li><a href="#services" onClick={(e) => { e.preventDefault(); setActiveTab('services'); }}>Services</a></li>
            <li><a href="#dashboard" onClick={(e) => { e.preventDefault(); setActiveTab('dashboard'); }}>Dashboard</a></li>
            <li><a href="#tasks" onClick={(e) => { e.preventDefault(); setActiveTab('tasks'); }}>Tasks</a></li>
            <li><a href="#contact" onClick={(e) => { e.preventDefault(); setActiveTab('contact'); }}>Contact</a></li>
            <li><a href="#status" onClick={(e) => { e.preventDefault(); setActiveTab('status'); }}>Status</a></li>
          </ul>
        </div>
      </nav>

      <main className="container">
        <section className="hero">
          <h2>Welcome to Your Interactive Portal</h2>
          <p>A modern React + Vite application with PostgreSQL replication</p>
        </section>

        {/* Home Tab */}
        {activeTab === 'home' && (
          <section className="dashboard">
            <div className="card full-width">
              <h3>Home</h3>
              <p>Welcome to our interactive web portal! This application demonstrates a full-stack setup with:</p>
              <ul style={{ marginLeft: '1.5rem', marginTop: '1rem' }}>
                <li>✓ React frontend with interactive components</li>
                <li>✓ PostgreSQL primary-replica replication setup</li>
                <li>✓ Docker containerized infrastructure</li>
                <li>✓ Real-time system monitoring</li>
              </ul>
              <p style={{ marginTop: '1rem' }}>Use the navigation menu above to explore different features and interact with the application.</p>
            </div>
          </section>
        )}

        {/* About Tab */}
        {activeTab === 'about' && (
          <section className="dashboard">
            <div className="card full-width">
              <h3>About This Project</h3>
              <p><strong>Project Name:</strong> PostgreSQL Replication Demo Portal</p>
              <p><strong>Version:</strong> 1.0.0</p>
              <p><strong>Description:</strong></p>
              <p style={{ marginTop: '0.5rem' }}>This project demonstrates a complete setup of PostgreSQL primary-replica replication with a modern React web interface. It's designed to showcase best practices in database replication, containerization, and full-stack web development.</p>
              
              <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
                <h4>Technology Stack:</h4>
                <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
                  <li><strong>Frontend:</strong> React 18, Vite, CSS3</li>
                  <li><strong>Database:</strong> PostgreSQL 15</li>
                  <li><strong>Replication:</strong> Streaming Replication (WAL)</li>
                  <li><strong>Infrastructure:</strong> Docker & Docker Compose</li>
                  <li><strong>Node.js Version:</strong> 18 Alpine</li>
                </ul>
              </div>

              <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#e7f3ff', borderRadius: '5px' }}>
                <h4>Key Features:</h4>
                <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
                  <li>Primary database with streaming replication</li>
                  <li>Replica database for read operations</li>
                  <li>Interactive web portal with real-time updates</li>
                  <li>System status monitoring</li>
                  <li>Task management system</li>
                  <li>Contact form with validation</li>
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* Services Tab */}
        {activeTab === 'services' && (
          <section className="dashboard">
            <div className="card">
              <h3>PostgreSQL Primary</h3>
              <p><strong>Port:</strong> 5432</p>
              <p><strong>Container:</strong> pg-primary</p>
              <p><strong>Purpose:</strong> Master database for write operations</p>
              <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>Configured with WAL streaming and replication settings enabled.</p>
            </div>

            <div className="card">
              <h3>PostgreSQL Replica</h3>
              <p><strong>Port:</strong> 5433</p>
              <p><strong>Container:</strong> pg-replica</p>
              <p><strong>Purpose:</strong> Replica database for read operations</p>
              <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>Continuously receives updates from primary via streaming replication.</p>
            </div>

            <div className="card">
              <h3>Web Portal</h3>
              <p><strong>Port:</strong> 3000</p>
              <p><strong>Container:</strong> web-portal</p>
              <p><strong>Framework:</strong> React + Vite</p>
              <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>Interactive frontend application for system interaction and monitoring.</p>
            </div>

            <div className="card full-width">
              <h3>Service Health Check</h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginTop: '1rem'
              }}>
                <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f0f8ff', borderRadius: '5px' }}>
                  <div style={{ fontSize: '1.5rem', color: '#28a745', marginBottom: '0.5rem' }}>●</div>
                  <p><strong>Primary DB</strong></p>
                  <p style={{ fontSize: '0.9rem', color: '#666' }}>Running</p>
                </div>
                <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f0f8ff', borderRadius: '5px' }}>
                  <div style={{ fontSize: '1.5rem', color: '#28a745', marginBottom: '0.5rem' }}>●</div>
                  <p><strong>Replica DB</strong></p>
                  <p style={{ fontSize: '0.9rem', color: '#666' }}>Running</p>
                </div>
                <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f0f8ff', borderRadius: '5px' }}>
                  <div style={{ fontSize: '1.5rem', color: '#28a745', marginBottom: '0.5rem' }}>●</div>
                  <p><strong>Web Server</strong></p>
                  <p style={{ fontSize: '0.9rem', color: '#666' }}>Running</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <section className="dashboard">
            <div className="card">
              <h3>Counter</h3>
              <div className="counter">
                <button onClick={() => setCount(Math.max(0, count - 1))}>−</button>
                <span>{count}</span>
                <button onClick={() => setCount(count + 1)}>+</button>
              </div>
              <div style={{ marginTop: '1rem' }}>
                <button className="btn btn-secondary" onClick={() => setCount(0)}>Reset</button>
              </div>
            </div>

            <div className="card">
              <h3>Database Architecture</h3>
              <p><strong>Primary:</strong> pg-primary:5432</p>
              <p><strong>Replica:</strong> pg-replica:5432</p>
              <p><strong>Replication Mode:</strong> Streaming</p>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>PostgreSQL 15 with WAL streaming</p>
            </div>

            <div className="card">
              <h3>Active Services</h3>
              <ul>
                <li>✓ PostgreSQL Primary</li>
                <li>✓ PostgreSQL Replica</li>
                <li>✓ React Web Portal</li>
              </ul>
            </div>
          </section>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <section className="dashboard">
            <div className="card full-width">
              <h3>Task Manager</h3>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <input
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                  placeholder="Add a new task..."
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '1rem'
                  }}
                />
                <button className="btn" onClick={addTodo}>Add Task</button>
              </div>

              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {todos.length === 0 ? (
                  <p style={{ color: '#999' }}>No tasks yet. Add one to get started!</p>
                ) : (
                  todos.map(todo => (
                    <div key={todo.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0.75rem',
                      borderBottom: '1px solid #eee',
                      gap: '0.5rem'
                    }}>
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleTodo(todo.id)}
                        style={{ cursor: 'pointer', width: '20px', height: '20px' }}
                      />
                      <span style={{
                        flex: 1,
                        textDecoration: todo.completed ? 'line-through' : 'none',
                        color: todo.completed ? '#999' : '#333'
                      }}>
                        {todo.text}
                      </span>
                      <button
                        className="btn btn-danger"
                        onClick={() => deleteTodo(todo.id)}
                        style={{ padding: '0.25rem 0.75rem', fontSize: '0.9rem' }}
                      >
                        Delete
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
                {todos.filter(t => t.completed).length} of {todos.length} tasks completed
              </div>
            </div>
          </section>
        )}

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <section className="dashboard">
            <div className="card full-width">
              <h3>Get In Touch</h3>
              {submitted && (
                <div style={{
                  padding: '1rem',
                  marginBottom: '1rem',
                  backgroundColor: '#d4edda',
                  color: '#155724',
                  borderRadius: '5px',
                  border: '1px solid #c3e6cb'
                }}>
                  ✓ Thank you! Your message has been received.
                </div>
              )}
              <form onSubmit={handleFormSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                    placeholder="Your name"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '5px',
                      fontSize: '1rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                    placeholder="your@email.com"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '5px',
                      fontSize: '1rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleFormChange}
                    required
                    placeholder="Your message here..."
                    rows="5"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '5px',
                      fontSize: '1rem',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                <button type="submit" className="btn" style={{ width: '100%' }}>
                  Send Message
                </button>
              </form>
            </div>
          </section>
        )}

        {/* Status Tab */}
        {activeTab === 'status' && (
          <section className="dashboard">
            <div className="card full-width">
              <h3>System Status</h3>
              <div style={{ marginBottom: '1rem' }}>
                <button className="btn btn-secondary" onClick={refreshStatus}>
                  🔄 Refresh Status
                </button>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1rem'
              }}>
                {Object.entries(systemStatus).map(([service, status]) => (
                  <div key={service} style={{
                    padding: '1.5rem',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    border: '2px solid #28a745',
                    textAlign: 'center'
                  }}>
                    <h4 style={{ textTransform: 'capitalize', marginBottom: '0.5rem' }}>
                      {service === 'primary' ? 'PostgreSQL Primary' : service === 'replica' ? 'PostgreSQL Replica' : 'Web Portal'}
                    </h4>
                    <div style={{
                      fontSize: '2rem',
                      color: status === 'running' ? '#28a745' : '#dc3545',
                      fontWeight: 'bold'
                    }}>
                      {status === 'running' ? '●' : '○'}
                    </div>
                    <p style={{ marginTop: '0.5rem', color: '#666', textTransform: 'uppercase', fontSize: '0.9rem' }}>
                      {status}
                    </p>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#e7f3ff', borderRadius: '5px' }}>
                <h4>System Information</h4>
                <p><strong>Container:</strong> Docker Compose</p>
                <p><strong>Database:</strong> PostgreSQL 15</p>
                <p><strong>Replication:</strong> Streaming Replication</p>
                <p><strong>Web Framework:</strong> React 18 + Vite</p>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer>
        <p>&copy; 2026 Interactive Web Portal. All rights reserved.</p>
      </footer>
    </>
  )
}

export default App
