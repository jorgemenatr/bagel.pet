# ¿Ya comió? 🐾

PWA mobile-first para registrar las comidas de Bagel, la beagle. Hecha para
Jorge y Brenda: cualquiera registra una comida desde su teléfono y se
sincroniza en tiempo real en el del otro.

## Stack

- **Frontend:** React 19 + Vite + Tailwind CSS v4
- **Datos / realtime:** Supabase (Postgres + Realtime)
- **Gráficas:** Recharts
- **PWA:** vite-plugin-pwa (instalable, funciona offline para la UI)
- **Hosting:** Netlify

## 1. Crear la tabla en Supabase

Antes de correr la app, crea la tabla `feedings` desde el **SQL Editor** de tu
proyecto de Supabase:

```sql
create extension if not exists "pgcrypto";

create type caregiver as enum ('Jorge', 'Brenda');
create type meal_type as enum ('desayuno', 'cena');

create table public.feedings (
  id          uuid primary key default gen_random_uuid(),
  fed_at      timestamptz not null default now(),
  fed_by      caregiver not null,
  meal        meal_type not null,
  note        text,
  created_at  timestamptz not null default now()
);

create index feedings_fed_at_idx on public.feedings (fed_at desc);

alter table public.feedings enable row level security;

create policy "Allow public read" on public.feedings
  for select using (true);

create policy "Allow public insert" on public.feedings
  for insert with check (true);

alter publication supabase_realtime add table public.feedings;
```

> No hay login con contraseña (solo se elige "Jorge" o "Brenda" una vez y se
> guarda en `localStorage`), por eso las policies de RLS son públicas. Es
> aceptable porque la app es privada entre ustedes dos y no maneja datos
> sensibles. Si más adelante agregan autenticación real, cambien las
> policies para usar `auth.uid()`.

El tipo de comida (`desayuno` / `cena`) se calcula en el cliente según la
hora local del dispositivo al momento de registrar: **antes de las 12:00pm =
desayuno, de las 12:00pm en adelante = cena**.

## 2. Variables de entorno

Copia `.env.example` a `.env.local` para desarrollo local:

```
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

Ambas las encuentras en tu proyecto de Supabase, en **Project Settings →
API**. Usa la **anon/public key**, nunca la `service_role`.

### En Netlify

En **Site settings → Environment variables**, agrega exactamente estas dos:

| Variable | Valor |
|---|---|
| `VITE_SUPABASE_URL` | La URL de tu proyecto Supabase |
| `VITE_SUPABASE_ANON_KEY` | La anon/public key de tu proyecto Supabase |

Netlify ya está configurado (`netlify.toml`) con:
- Comando de build: `npm run build`
- Carpeta publicada: `dist`
- Redirect SPA (`/* -> /index.html`) para que las rutas funcionen al recargar

## 3. Desarrollo local

```bash
npm install
npm run dev
```

## 4. Build de producción

```bash
npm run build
npm run preview
```

## Instalación como app (PWA)

Al abrir la app desplegada desde el celular (Safari en iOS, Chrome en
Android), usa "Agregar a pantalla de inicio" / el prompt de instalación del
navegador. Queda con ícono, splash screen y se abre en modo standalone (sin
la barra del navegador).

## Estructura

```
src/
  components/   UI: selector de cuidador, estado, botón, historial, stats
  hooks/        useCaregiver (localStorage), useFeedings (fetch + realtime)
  lib/          supabase client, queries, cálculo de status/stats/tiempo
```
