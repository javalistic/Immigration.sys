# Immigration Management System - Cross-System Access Guide

## System is now accessible from any device on your network!

### Access the Application

**From the same machine:**
- http://localhost:3000
- http://127.0.0.1:3000

**From another machine on the network:**
Replace `YOUR_SERVER_IP` with the actual IP address of the server running Docker:
- http://YOUR_SERVER_IP:3000

**Example:**
If your server IP is `192.168.1.100`, access it from any device via:
- http://192.168.1.100:3000

### How to Find Your Server IP

**On Linux/Mac:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
# or
hostname -I
```

**On Windows:**
```cmd
ipconfig
# Look for "IPv4 Address" under your active network adapter
```

### Database Access

**PostgreSQL Primary:**
- Host: Your server IP or hostname
- Port: 5432
- Username: postgres
- Password: ICUI4CUAlways

**PostgreSQL Replica (Read-only):**
- Host: Your server IP or hostname  
- Port: 5433
- Username: postgres
- Password: ICUI4CUAlways

### Browser Compatibility

The application works on all modern browsers:
- Chrome/Chromium 78+
- Firefox 78+
- Safari 12+
- Edge 88+
- Opera, Brave, and other Chromium-based browsers

### Network Configuration

The application is configured to:
- Listen on all network interfaces (0.0.0.0)
- Accept connections from any system on the network
- Support modern browsers with ES2015+ JavaScript
- Include proper HTTP headers for security and caching

### Docker Services

All services are accessible on port 3000 for the web application:
```
Web Portal:    http://YOUR_IP:3000
PostgreSQL Primary: YOUR_IP:5432
PostgreSQL Replica: YOUR_IP:5433
```

### Troubleshooting

**Can't access from another machine?**
1. Verify the server is running: `docker compose ps`
2. Check firewall settings - port 3000 must be open
3. Ensure both machines are on the same network
4. Use the correct server IP address

**Want to find your IP easily?**
```bash
# From the web container
docker exec web-portal hostname -I

# From your host machine
docker inspect pg-replica_pg-net --format='{{json .Containers}}' | grep IPv4Address
```

---

**Created:** 2026-01-20  
**Application:** Immigration Management System  
**Status:** Fully functional and network-accessible
