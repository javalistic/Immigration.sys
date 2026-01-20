PostgreSQL primary/replica demo (Docker Compose)

Quick start:

1. From this folder run:

```bash
docker compose up -d
```

2. Watch logs:

```bash
docker compose logs -f
```

3. Verify replication on the primary:

```bash
docker exec -it pg-primary psql -U postgres -c "SELECT pid, state, sync_state FROM pg_stat_replication;"
```

Notes:
- Primary listens on host port 5432; replica exposes 5433 on host.
- Default credentials: `postgres` / `example`.
- Replication user: `replicator` / `replicator_pass`.

If containers fail to start, ensure Docker is installed and you have permissions to run it. To reset, remove volumes under `primary/data` and `replica/data` and restart.
