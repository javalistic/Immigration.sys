# Immigration Management System

A comprehensive web-based immigration management system with PostgreSQL backend, real-time database synchronization, and advanced analytics.

## Features

✅ **Complete Migrant Record Management**
- Add, edit, delete, and search migrant records
- 12+ data fields per record (name, nationality, passport, visa, etc.)
- Real-time database persistence

✅ **Database Integration**
- PostgreSQL backend with automatic table creation
- Primary-Replica replication setup
- Asynchronous API endpoints for all CRUD operations
- Transaction support

✅ **Advanced Filtering & Search**
- Search by name, passport number, or nationality
- Filter by visa status (Pending, Approved, Rejected, etc.)
- Filter by gender (Male, Female, Other)
- Real-time filtering updates

✅ **Analytics & Statistics**
- Visa application statistics by type
- Visa status breakdown with progress bars
- Gender distribution with percentages
- Nationality distribution tracking
- Real-time stats from database

✅ **Gender-Based Features**
- Gender-specific tracking and filtering
- Color-coded gender icons (♂️ Blue, ♀️ Red, ⚭ Gray)
- Gender distribution analytics
- Gender-based migrant segmentation

✅ **Cross-Platform Accessibility**
- Network-accessible on any system (Windows, Mac, Linux)
- Browser-compatible (Chrome 78+, Firefox 78+, Safari 12+)
- Docker-based containerized deployment
- Firewall-configured for remote access

## Technology Stack

### Frontend
- **React 18** - UI framework
- **Vite 5** - Build tool with ES2015+ targeting
- **CSS3** - Responsive styling

### Backend
- **Node.js 18** - Runtime
- **Express.js** - REST API server
- **PostgreSQL 15** - Primary database with replication

### Infrastructure
- **Docker & Docker Compose** - Containerization
- **CentOS 9** - Host OS
- **firewalld** - Firewall management

## Project Structure

```
pg-replica/
├── docker-compose.yml          # Service orchestration
├── README.md                   # This file
├── NETWORK_ACCESS.md           # Network configuration guide
├── primary/                    # PostgreSQL Primary
│   ├── initdb/
│   │   └── init-replication.sh # Replication setup script
│   └── data/                   # Primary database files
├── replica/                    # PostgreSQL Replica
│   ├── replica-entrypoint.sh   # Replica initialization
│   └── data/                   # Replica database files
└── web/                        # React + Node.js application
    ├── Dockerfile              # Multi-stage Docker build
    ├── server.js               # Express backend server
    ├── package.json            # Dependencies
    ├── vite.config.js          # Build configuration
    ├── serve.json              # HTTP server config
    ├── index.html              # Entry point
    └── src/
        ├── App.jsx             # Main React component
        ├── App.css             # Component styles
        ├── main.jsx            # React DOM render
        └── index.css           # Global styles
```

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Port 3000 available (web UI)
- Port 5432 available (PostgreSQL Primary)
- Port 5433 available (PostgreSQL Replica)

### Running the Application

1. **Start all services:**
```bash
cd pg-replica
docker compose up -d
```

2. **Access the application:**
```
http://localhost:3000
```

3. **Stop services:**
```bash
docker compose down
```

## Database Details

### Connection Details

**Primary Database:**
- Host: localhost
- Port: 5432
- User: postgres
- Password: ICUI4CUAlways

**Replica Database:**
- Host: localhost
- Port: 5433
- User: postgres
- Password: ICUI4CUAlways

### Database Schema

The application automatically creates the `migrants` table with the following fields:

```sql
CREATE TABLE migrants (
  id SERIAL PRIMARY KEY,
  fullName VARCHAR(255) NOT NULL,
  nationality VARCHAR(100),
  passportNumber VARCHAR(50) UNIQUE,
  passportType VARCHAR(50),
  visaType VARCHAR(100),
  visaStatus VARCHAR(50),
  gender VARCHAR(20),
  dateOfBirth DATE,
  email VARCHAR(255),
  phone VARCHAR(20),
  arrivalDate DATE,
  department VARCHAR(100),
  sponsor VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

## API Endpoints

### Migrants

**Get all migrants:**
```
GET /api/migrants
```

**Get single migrant:**
```
GET /api/migrants/:id
```

**Create migrant:**
```
POST /api/migrants
Content-Type: application/json

{
  "fullName": "John Doe",
  "nationality": "USA",
  "passportNumber": "US123456789",
  "passportType": "Ordinary",
  "visaType": "Work Visa",
  "visaStatus": "Pending",
  "gender": "Male",
  "dateOfBirth": "1990-05-15",
  "email": "john@example.com",
  "phone": "+1234567890",
  "arrivalDate": "2026-01-20",
  "department": "IT",
  "sponsor": "Tech Corp"
}
```

**Update migrant:**
```
PUT /api/migrants/:id
Content-Type: application/json
[Same body as POST]
```

**Delete migrant:**
```
DELETE /api/migrants/:id
```

### Statistics

**Get aggregate statistics:**
```
GET /api/statistics
```

Returns:
```json
{
  "total": 10,
  "approved": 5,
  "pending": 3,
  "rejected": 2,
  "male": 6,
  "female": 4,
  "other": 0
}
```

## Application Features

### Dashboard Tab
- System overview with key metrics
- Total migrants, approved, pending, rejected counts
- Gender distribution summary
- Quick action button to add new migrants

### Migrants Tab
- Full list of migrant records
- Search functionality (name, passport, nationality)
- Filter by visa status
- Filter by gender
- Edit and delete capabilities
- Inline form for adding/editing records

### Statistics Tab
- Visa application statistics by type
- Visa status breakdown with progress bars
- Gender distribution with percentages
- Nationality distribution list

### About Tab
- System information
- Key features list
- Supported data fields
- Technology stack details

## Network Access

For accessing from other systems on the network:

1. **Find CentOS IP:**
```bash
hostname -I
```

2. **Access from Windows/Mac/Linux:**
```
http://<CENTOS_IP>:3000
```

3. **Database access (optional):**
```bash
# From another machine
psql -h <CENTOS_IP> -U postgres -d postgres -p 5432
```

See [NETWORK_ACCESS.md](NETWORK_ACCESS.md) for detailed configuration.

## Development

### Building the Frontend
```bash
cd web
npm install
npm run build
```

### Running Backend Server Locally
```bash
cd web
npm install
node server.js
```

### Development Mode
```bash
cd web
npm run dev  # Starts Vite dev server on http://localhost:5173
```

## Troubleshooting

### Services not starting?
```bash
# Check logs
docker compose logs web
docker compose logs primary
docker compose logs replica

# Rebuild from scratch
docker compose down
docker compose build --no-cache
docker compose up -d
```

### Database connection errors?
```bash
# Verify PostgreSQL is running
docker compose ps

# Check database initialization
docker compose logs primary
```

### Can't access from Windows?
- Ensure firewall allows port 3000
- Check firewall rules on CentOS:
```bash
sudo firewall-cmd --list-ports
```
- Open ports if needed:
```bash
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --reload
```

## Performance Notes

- Frontend: Optimized with Vite (ES2015+ targeting)
- Backend: Single Node.js process with PostgreSQL connection pooling
- Database: Primary-Replica setup for read scaling
- Network: Bound to 0.0.0.0 for all interfaces

## Security Considerations

- Change default PostgreSQL password in production
- Use environment variables for credentials
- Implement authentication/authorization for production
- Set up HTTPS/SSL for remote access
- Configure proper firewall rules

## License

MIT

## Support

For issues or questions, check the logs:
```bash
docker compose logs -f [service-name]
```

## Version

- Application: 1.0.0
- React: 18.2.0
- PostgreSQL: 15
- Node.js: 18-alpine
- Docker: Latest
