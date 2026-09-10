# Avances de sesión — InferStat (2026-09-09)

## Objetivo
Reconstruir el OVA **GEMS** (inferencia con barras de error) como **InferStat**, app standalone en formato `-Stat` y desplegarla.

## Resultado final
- **App viva:** https://inferstat.vercel.app · Repo: https://github.com/rgelabertf/inferstat (público)
- Funcionalidades verificadas en vivo + local (Playwright): simulador 2–5 grupos (M/SD/n), barras SE/IC 95%/SD/Ambas, reglas de Cumming, CLD (Bron–Kerbosch), Fmax (varianzas), Modo Desafío, export/import JSON (compatible GEMS legacy), presets, Manual integrado, Chat IA (Gemini).

## Origen del motor
- `ESDEPED 2025/OVA/index.html` (desplegada) + `2025/OVAGit/gems-ova/index.html` (58 KB).
- Estadísticas: `se = sd/√n`, `t = 4.3 (n≤3) / 2.3 (4–9) / 2 (n≥10)`, `ci = t·se`.
- Reglas de Cumming: overlap ≤ 0 → p<0.01; overlap < ½ arm → p<0.05; else NS.

## Hitazos técnicos resueltos
1. **CLD:** asignar letra propia a grupos aislados (cliques singleton) via greedy sobre maximal cliques de Bron–Kerbosch.
2. **Chat IA latencia:** `gemini-3.1-flash-lite` (~1 s) en vez de `gemini-2.5-flash` (~30 s de razonamiento).
3. **Vercel timeout 504:** un `export default` que devuelve `Response` es IGNORADO por el runtime Node → timeout. Fix: `export async function POST(request)` + `export const config = { maxDuration: 30 }`.
4. **TS2580:** añadir `@types/node` en devDependencies.

## Archivos
- `InferStat-Evaluador-Inferencia.html` (app, ~50 KB)
- `api/chat.ts` (proxy Gemini + CORS)
- `vercel.json` · `package.json` · `LICENSE` (MIT) · `.gitignore`
- `docs/Manual de Usuario.md` · `docs/reglas-de-cumming.md`
- `assets/` (diagramas: inference_rules_diagram.png, visual_inference_infographic.png)
- `versión para compartir/` (HTML standalone)

## Docs / skill
- Skill **`stat-ova-format`** actualizada con lecciones (POST export, modelo lite, timeout, @types/node).
- Obsidian: `Proyectos/InferStat.md` creado; `Informe 3.1.1 ESDEPED 2026.md` sección 6.1 (fila "liga pendiente" → InferStat) y sección 8 (pregunta 1 resuelta). InferStat clasificado como **recurso didáctico**.

## Pendiente / notas
- `GEMINI_API_KEY` configurada como env var de producción en el proyecto Vercel `inferstat`.
- Vercel autenticado como `rgelabertf-5243` (token renovado en esta sesión).
- La app era "liga pendiente" del indicador 3.1.1; ahora desplegada (1ª vez que se publica).

## Arreglo posterior (misma sesión) — accesibilidad modo oscuro
- **Bug:** en modo oscuro los valores de `num-groups` y M/SD/n no se veían.
- **Causa:** `.stat-input { @apply ... }` (y `.chip`) → el **Tailwind Play CDN NO procesa `@apply` en `<style>` normal** → quedaban `{}` → inputs con default del navegador (texto casi blanco sobre blanco).
- **Fix:** ambos selectores reescritos en CSS puro (con `.dark .x` y `color-scheme`). Verificado local y en vivo: blanco sobre `#0D1117`. Commit `c552472`.