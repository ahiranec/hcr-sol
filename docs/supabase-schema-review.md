# Revisión del Schema SQL MVP vs Mocks (Fase Pre-Supabase)

Este documento justifica y evalúa la viabilidad del contrato estructurado en `supabase-schema.sql` en contra del estado actual del Frontend en React, garantizando que el diseño de Postgres MVP cubre el cien por ciento de la funcionalidad requerida por la UI existente.

---

## A) Confirmación de Compatibilidad con el Frontend Actual

✅ **El modelo es compatible con el frontend actual con adaptación controlada de repos durante la fase de integración.**

Todos los componentes de React que actualmente dependen de `*Repo` (como `Hub.tsx`, `PublicHome.tsx`, y `Login.tsx`) están diseñados para esperar entidades con un contrato que ya empatamos con Postgres:
- La UI espera iterar un campo `projects.status` de tipo semántico (`live`, `in_development`, etc.). Constraint CHECK agregado en SQL.
- El objeto `authRepo.getCurrentUser()` requiere conocer booleanos como `password_set` e `id` nativo. Todo esto fue resguardado correctamente en `profiles`.
- Se conservó la capacidad de renderizar "Hace X días" con `last_update_label` de `projects`, evitando que la UI tenga que depender inmediatamente de un date-parser complejo.
- `PublicHome.tsx` sigue consumiendo variables `developmentProjects` mapeando `project_blocks` correctamente sin quejarse gracias a nuestra aserción 1:N por FK en la DB.

---

## B) Lista de Diferencias encontradas entre Mocks y Contrato

1. **Destrucción de Campos JSON de Permisos**
   - **En `mocks.ts`:** `MockProfile.permissions` era un objeto tipo `{ home_editor: true, hub_projects_editor: false }`.
   - **En Postgres:** Se eliminó por completo en favor del `hub_role` (Enums: `superadmin` / `member`). La complejidad del RBAC (Role-Based Access Control) se confío enteramente al RLS nativo de Supabase y la jerarquía de roles simples, lo que es mejor práctica para un MVP.

2. **Dinamismo del `PROJECT_COPY` unificado a `projects`**
   - **En `mocks.ts`:** `PROJECT_COPY` era un diccionario desvinculado a nivel memoria que guardaba descripciones largas.
   - **En Postgres:** Se unificó limpiamente utilizando los campos `short_description` y `long_description` dentro de la propia tabla de `projects`. Garantiza cargas atómicas (No más *n+1 queries*).

3. **Supresión del JSON Embedded para Hero Images y Bloques de Proyecto**
   - **En `mocks.ts`:** Una entidad de detalle arrastraba un Array Javascript de *blocks*.
   - **En Postgres:** Generamos tablas planas Relacionales (`hero_images` y `project_blocks`) acompañadas de restricciones seguras FK con borrado en cascada `ON DELETE CASCADE`.

---

## C) Campos que quedaron fuera del MVP

De acuerdo al mandato de infraestructura, evitamos migrar constructos temporales o en memoria a la Base de Datos:

1. **`mockSsoSessions` (SSO Flags & Persistencia Memoria)**
   - El estado de los Tokens Temporales y Enlaces Livianos generados a mano nunca tuvieron impacto persistente útil en este stage. Ahora serán puramente controlados por JSON Web Tokens en el Auth server-side de Supabase usando el estándar Stateless por 5 minutos de TTL. La tabla de "Sesiones" se rechaza para abaratar los queries.
2. **`mockUiState` / `mockAuthState`**
   - Ninguna bandera UI (`loading`, `error`, `currentUserEmail`, flag de demoras de simulación `sleep()`) pasó de forma alguna a DB. Estos seguirán existiendo transitoriamente como simple UI state management (Ej: `useState(false)`) local durante el fetching real.
3. **Rol de perfil `admin`**
   - La estructura de permisos en UI apuntaba a una triada: superadmin, admin, member. Para simplicidad del Contrato MVP según línea base impartida por el usuario: Se restringieron a exclusivamente `superadmin` y `member` usando CHECK Constraint en Postgres.
4. **Campos Temporales como `avatar_url` Nullable**
   - Aunque forma parte del objeto `profiles`, temporalmente continuará siendo Nullable y su manipulación ocurrirá enteramente vía `supabase.storage` en iteraciones futuras, no en el MVP funcional nivel 0.

---

## D) Justificación de cada Tabla (Normalización SQL)

| Tabla Propuesta         | Justificación y Razonamiento                               |
|:---                     |:---                                                      |
| `profiles`              | Centraliza los metadatos de usuario amparados detrás de la entidad de capa en Supabase `auth.users`. Esto separa la identidad segura (password/UUID) de la visualización (Nombres/Fotos), imperativo estricto del producto Supabase Auth. |
| `projects`              | Repositorio central de los servicios listados en el Hub que servirá de piedra angular al ecosistema completo. Absorbe copys largos y metadatos base para optimización de Indexeo e índices BTREE rápidos. |
| `user_project_accesses` | Única manera íntegra y estandarizada SQL de cruzar qué persona puede habilitarse para qué proyecto. (Cardinalidad NxM). Resuelve con seguridad máxima escalable los accesos sin campos mágicos en perfiles. |
| `home_branding` / `home_hero` | Singletons (Tablas de Un Registro Fijo). Resuelven la necesidad de parametrizar el front estético del sitio sin necesidad de alterar código React o crear monstruosos archivos estáticos de config. |
| `hero_images` / `project_blocks` | Relaciones 1-a-Muchos que conservan los Arrays ordenados nativos que existían en JSON de React, mediante un `order_index`. Resultan indispensables para el Front público no lineal. |
| `audit_log`             | Bitácora estricta Append-Only para el cumplimiento regulatorio de visualizaciones. Funciona nativamente con Postgres `now()` y su PK es irrelevante para modificación. |

---

## E) Relación Repo Proxy -> Tabla Supabase Futura

Cuando se instalen los SDKs, la transición se dará de manera horizontal de los repos proxy a endpoints `@supabase/supabase-js` transparentemente:

| Repositorio en React  | Invocación Planificada contra SQL en FASE 2 |
|:---                   |:--- |
| `authRepo.ts`         | Llamará a la librería `supabase.auth...` pero los metadatos sincronos del usuario leerán la tabla **`profiles`** con UUID. |
| `profilesRepo.ts`     | CRUD directo en tabla **`profiles`** usando políticas Seguras (`SELECT/UPDATE...`). |
| `projectsRepo.ts`     | Selects sobre **`projects`**. |
| `accessesRepo.ts`     | Inner Joins desde **`user_project_accesses`** hacia **`projects`**. |
| `homeRepo.ts`         | Múltiples selects paralelos `await Promise.all()` contra **`home_branding`**, **`home_hero`**, **`hero_images`**, y **`project_blocks`**. |
| `auditRepo.ts`        | Único canal que realizará `.insert()` masivo en **`audit_log`** sin permisos `.delete()` (Truncable solo en SQL panel admin). |
| `ssoRepo.ts`          | Emitirá links JWT autografiados, por lo tanto NO interactuará con tablas nativas de Postgres en este MVP. |
