#!/bin/bash
set -e

PRIMARY_HOST=${PRIMARY_HOST:-pg-primary}
REPL_USER=replicator
REPL_PASSWORD=${REPL_PASSWORD:-replicator_pass}
PGDATA=/var/lib/postgresql/data

# wait for primary to be ready
until pg_isready -h "$PRIMARY_HOST" -p 5432 -U postgres >/dev/null 2>&1; do
  sleep 1
done

# if data dir already initialized, start normally
if [ -s "$PGDATA/PG_VERSION" ]; then
  exec docker-entrypoint.sh postgres
fi

export PGPASSWORD="$REPL_PASSWORD"

# run base backup which will create recovery configuration (modern PG creates standby.signal and writes primary_conninfo)
pg_basebackup -h "$PRIMARY_HOST" -D "$PGDATA" -U "$REPL_USER" -Fp -Xs -P -R

chown -R postgres:postgres "$PGDATA"

exec docker-entrypoint.sh postgres
