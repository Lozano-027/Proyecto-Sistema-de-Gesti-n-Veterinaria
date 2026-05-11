#!/bin/sh
set -e

echo "⏳ Ejecutando migraciones de Prisma..."
npx prisma migrate deploy

echo "🛠  Compilando TypeScript..."
npx nest build

echo "🚀 Iniciando backend NestJS..."
exec node dist/main
