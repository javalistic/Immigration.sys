#!/bin/bash
set -e

# This script runs inside the primary during initial initdb phase.
# It creates a replication user and updates pg_hba.conf to allow replication.

REPL_PASSWORD=${REPL_PASSWORD:-replicator_pass}

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
CREATE ROLE replicator REPLICATION LOGIN ENCRYPTED PASSWORD '${REPL_PASSWORD}';
EOSQL

cat >> "$PGDATA/pg_hba.conf" <<EOF
# Allow replication connections from replica
host replication replicator 0.0.0.0/0 md5
EOF
