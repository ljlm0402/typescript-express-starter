#!/bin/bash
set -e

# PostgreSQL 초기화 스크립트
# UUID 생성을 위해 필요한 확장들을 활성화합니다

echo "Initializing PostgreSQL with required extensions..."

# pgcrypto 확장 활성화 (UUID 생성용)
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Enable UUID generation extension
    CREATE EXTENSION IF NOT EXISTS pgcrypto;

    -- (선택적) 기타 유용한 확장들
    -- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";   -- 추가 UUID 함수들
    -- CREATE EXTENSION IF NOT EXISTS hstore;        -- Key-Value 스토어
    -- CREATE EXTENSION IF NOT EXISTS ltree;         -- 트리 구조 데이터

    \echo 'PostgreSQL extensions initialized successfully!'
EOSQL

echo "PostgreSQL initialization completed."