# casaverdecanas

Sitio público y panel interno de Casa Verde Canas (GitHub Pages) + funciones
de servidor en Netlify. La documentación técnica completa vive en
`interno/CASAVERDEDOCUMENTACION.md` — leerla antes de tocar procesos, modelo
de datos o reglas de Firestore.

## Secretos

Este proyecto usa: `GEMINI_API_KEY`, `CLOUDINARY_API_KEY`,
`CLOUDINARY_API_SECRET`, `CALLMEBOT_PHONE`, `CALLMEBOT_APIKEY` (ver detalle y
estado de cada una en el índice de abajo).

Los valores reales viven en **Netlify → proyecto `serene-scone-76bd4e` →
Environment variables** (el repo NO está conectado a Netlify a propósito —
se despliega con un .zip a mano, ver comentario en `netlify.toml`). Este
repo no usa GitHub Actions, así que GitHub Secrets no aplica acá.

Índice completo y actualizado: repo privado `casaverdecanas-blip/datos` →
`secretos/casaverdecanas.md`.

**Nunca** un valor real de estas variables va en este repo — ni en código, ni
en `interno/` (esos `.md` se sirven en texto plano y son públicos vía GitHub
Pages, aunque el nombre de la carpeta sugiera lo contrario).
