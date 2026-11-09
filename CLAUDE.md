# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Proyecto

Frontend de "Buró de Crédito Ecuador": SPA en Quasar 2 (Vite) + Vue 3 + TypeScript + Pinia. Consume un backend Laravel (Sanctum, token Bearer). Por ahora solo se publica como SPA web; `src-capacitor/` y el código para móvil (`Platform.is.capacitor`, `@capacitor/preferences`) existen pero no están en uso, así que no hace falta mantener ni probar la variante móvil. El código, los nombres de dominio y los mensajes de UI están en español.

## Comandos

```bash
npm install            # dependencias (CI usa npm ci con Node 20)
npm run dev            # quasar dev (usa .env.development)
npm run build          # quasar build → dist/spa (usa .env.production)
npm run lint           # eslint .js/.ts/.vue
npm run format         # prettier (sin punto y coma, comillas simples)
```

No hay tests (`npm test` es un no-op). La verificación es `npm run lint` + `npm run build`; el build ejecuta `vue-tsc` (con `tsconfig.vue-tsc.json`) y eslint vía `vite-plugin-checker`, así que los errores de tipos rompen el build.

CI (`.github/workflows/ci-deploy.yml`): en cada push/PR a `main` corre lint y build; en push a `main` despliega `dist/spa` por rsync al servidor. Hacer push a `main` = desplegar a producción.

## Variables de entorno

`quasar.config.js` carga `.env.development` o `.env.production` con dotenv y las expone como `process.env.*`: `APP_NAME`, `LOGO_APP`, `API_URL`, `APP_ID`, `PUSHER_APP_KEY`, `PUSHER_APP_CLUSTER`. `.env_buro_credito_ecuador` y `.env_trabajos_ecuador` son plantillas por marca. `APP_ID` distingue la app: `'1'` = Buró de Crédito Ecuador (la activa), `'2'` = Trabajos Ecuador, **abandonada**: las ramas `APP_ID === '2'`, `menuTrabajosEcuador.ts` y `.env_trabajos_ecuador` son código muerto; no extenderlas ni contemplarlas en cambios nuevos.

## Arquitectura

### Alias de import
`config/`, `shared/`, `pages/`, `sistema/` (= `src/pages/sistema`), `components/`, `stores/`, `layouts/` — definidos en `quasar.config.js` y `tsconfig.json`.

### Estructura de un módulo (`src/pages/<modulo>/`)
Cada módulo sigue capas tipo hexagonal:
- `domain/` — clase de entidad (extiende `EntidadAuditable`, todos los campos inicializados en el constructor) y `configuracionColumnas<X>.ts` (`ColumnConfig<T>[]` para la tabla).
- `infraestructure/` (sic, con esa ortografía) — `<X>Controller` que extiende `TransaccionSimpleController<T>` pasando un `Endpoint` de `config/api.ts`.
- `view/` — `<X>Page.vue` + `<X>Page.ts` separados (el `.ts` exporta `defineComponent` con `setup()`).
- Opcional: `application/`, `modules/` para submódulos.

`src/pages/codigosVerificacion/` es un ejemplo reciente y limpio de este patrón. `src/pages/sistema/roles_old/` y `permisos_old/` son código muerto: no usarlos como referencia (los vigentes son `roles/` y `permisos/`).

### Contenedor CRUD genérico (`src/shared/contenedor/`)
Casi todas las pantallas CRUD se construyen con:
- `new ContenedorSimpleMixin(Entidad, new XController())` → `mixin.useReferencias()` (`entidad`, `listado`, `accion`, `disabled`…), `mixin.useComportamiento()` (`setValidador`, listar/guardar/editar…), `mixin.useHooks()` (hooks antes/después de guardar, consultar, etc.).
- Layouts de vista: `TabLayout.vue` (pestañas formulario/listado, slots `formulario`, `encabezado`, filtros), `SimpleLayout`, `CardLayout`, `MultiplePageLayout`, `TabLayoutFilterTabs`. Reciben `:mixin` y `:configuracionColumnas`.
- Validación con Vuelidate usando los validadores traducidos de `shared/i18n-validators` y registrándolos con `setValidador(v$.value)`.

### HTTP
- `AxiosHttpRepository.getInstance()` (singleton en `shared/http/infraestructure/`) es el cliente real; `src/boot/axios.ts` es el boilerplate de Quasar y no se usa.
- Las rutas del API se declaran como `new Endpoint('ruta', includeApiPath = true)` en `src/config/api.ts` (`endpoints`). `false` para rutas fuera de `/api` (auth de Laravel/Fortify). Construir URLs con `axios.getEndpoint(endpoints.x, args)`.
- El token se lee de `localStorage` en web o de `@capacitor/preferences` en móvil. Una respuesta 401 dispara el evento de ventana `sesion-expirada` (`EVENTO_SESION_EXPIRADA`) que el layout usa para cerrar sesión.
- Notificaciones al usuario: `useNotificaciones()` de `shared/notificaciones` (`notificarCorrecto`, `notificarError`…).

### Rutas, permisos y menú
- `src/router/routes.ts`: rutas hijas de `MainLayout` con `meta.requiresAuth`. El **nombre de la ruta es el permiso**: el guard (`src/router/index.ts`) exige `authentication.can('acceder.' + route.name)`, y `can()` busca `'puede.acceder.<nombre>'` en los permisos del usuario devueltos por el backend. Al agregar una pantalla hay que crear la ruta, el permiso en el backend y la opción de menú con el mismo nombre.
- Redirección post-login por rol: `CLIENTE` → `activar_app` o `archivos_reportes` (según `planPagado`), `EMPRESA` → `busqueda_general`, resto → `tablero`.
- Menú lateral: `stores/menu.ts` combina `menuBuroCreditoEcuador.ts` y `menuAdministracion.ts`; cada `MenuOption` tiene `can: store.can('acceder.x')`.
- Cierre automático por inactividad (30 min, sincronizado entre pestañas): `shared/sesion/useCierrePorInactividad.ts`.

### Tiempo real
Pusher (`stores/notificationRealtime.ts`, eventos en `src/pusherEvents/`) para notificaciones y archivos de reportes generados.

### Comunicación con el backend (`../backend_buro`)
El API es el repo hermano `../backend_buro` (Laravel 9, PHP 8.2), que tiene su propio `CLAUDE.md`; leerlo cuando un cambio requiera tocar endpoints, permisos o respuestas.
- **Entorno local:** `API_URL` en `.env.development` apunta a `http://localhost:8000` (backend con `docker compose up -d`).
- **Mapeo de URLs:** `Endpoint('x')` → `/api/x` (`routes/api.php`, `auth:sanctum`); `Endpoint('public/x')` → `/api/public/x` (`routes/api_publica.php`, sin auth: login, registro, catálogos); `Endpoint('x', false)` → `/x` (rutas de Fortify/Sanctum como `api/user`, `logout`, `user/password`).
- **Forma de las respuestas** (los repositorios de `shared/controller/infraestructure/` dependen de ella):
  - listado: `data` (Resource collection) o `results` + `meta` cuando se envía `paginate=1` (`Src\App\Sistema\PaginationService`);
  - show/store/update: `{ modelo, mensaje }`; destroy: `{ mensaje }`.
  - Filtros del listado van por query string (eloquent-filter en el backend).
- **Permisos:** el backend (spatie/laravel-permission) crea permisos `puede.acceder.<nombre>`; el `<nombre>` debe coincidir con el `name` de la ruta del frontend. Un módulo nuevo requiere: endpoint en `config/api.ts` + ruta en `routes/api.php` (normalmente con `can:puede.acceder.x`) + permiso creado en el backend + ruta y menú aquí.
- **Reportes Multibanco:** el frontend solo habla con Laravel (`reportes-multibanco/*`), que reenvía a n8n con una clave interna. La generación es asíncrona: `generar` devuelve el trabajo y el frontend sondea `reportes-multibanco/generaciones/{id}` hasta que n8n avisa a Laravel por callback. Los códigos de verificación (`codigos-verificacion`) se validan en el backend.
- **Pusher:** los eventos se emiten desde `app/Events/` del backend; el frontend se suscribe a canales públicos, algunos por usuario (p. ej. `archivo-reporte-tracker-<user_id>`). El nombre de canal/evento debe coincidir en ambos repos.
- Ambos repos despliegan a producción en cada push a `main`; las migraciones del backend se corren a mano en el servidor, así que un cambio de frontend que dependa de una columna nueva requiere migrar antes.

### Estilos
SCSS en `src/css/` con temas claro/oscuro (`custom-styles-light/dark.scss`) y clases de vidrio (`glass-layer`, en `glassmorphism.scss`). Íconos: Bootstrap Icons (`bi-*`) y Material; `boot/icons.ts` + `lucideIconMap.ts` mapean íconos.

## Convención de commits

Formato (gitmoji, en español):

```
tipo(scope-opcional): :emoji: Descripción corta en imperativo

Cuerpo opcional que explica el qué y el porqué (viñetas con "-" si son varios cambios).
```

Tipos/emojis usados en el historial: `feat` `:sparkles:`, `fix` `:bug:`, `style` `:lipstick:`, `refactor` `:truck:` (mover/renombrar), `chore` `:wrench:`, `ci` `:construction_worker:` / `:green_heart:`. El scope es el módulo en kebab-case (p. ej. `reportes-multibanco`, `usuarios`). Existe el comando `/commit` (`.claude/commands/commit.md`) que aplica esta convención; agregar archivos explícitamente, nunca `git add -A`.
