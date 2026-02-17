# ADR-001 — SSO Sessions (MVP)

## Decisión
En el MVP, **NO** se crea tabla sso_sessions.

## Implementación MVP
- El token SSO se genera como JWT con TTL corto (ej: 5 minutos).
- La validación ocurre en el proyecto destino (admin) o en una Edge Function.
- No hay persistencia de tokens en base de datos.

## Motivo
Reducir complejidad y número de tablas en la migración inicial desde mocks.
