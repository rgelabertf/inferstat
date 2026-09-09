# 🔬 InferStat — Evaluador de Inferencia Visual

**InferStat** es un **Objeto Virtual de Aprendizaje (OVA)** de inferencia estadística visual basado en el Laboratorio **GEMS**, reconstruido con el formato de la familia `-Stat` (NormaStat, HomoStat).

Permite a estudiantes y docentes explorar cómo la variabilidad, el tamaño de muestra y el tipo de barras de error (SE, IC 95%, SD) afectan la interpretación de la significancia estadística mediante las **reglas de solapamiento de Geoff Cumming**.

> 🌐 Desplegada en: **https://inferstat.vercel.app**

## 🚀 Características

- **Modo Libre (Simulador)**: ajuste en tiempo real de media (M), desviación estándar (SD) y tamaño de muestra (n) para 2–5 grupos.
- **Modo Desafío**: dos grupos aleatorios; el estudiante decide si la diferencia es significativa (p < 0.05) con retroalimentación inmediata y retos infinitos.
- **Tipos de barras de error**: Error Estándar (SE), Intervalo de Confianza 95% (IC), Desviación Estándar (SD) y Ambas.
- **Inferencia basada en evidencia**: reglas de Geoff Cumming ([Cumming & Finch, 2005](https://doi.org/10.1111/j.1467-9639.2005.00205.x)) para estimar p < 0.01, p < 0.05 o no significativo.
- **Letras de agrupación (CLD)**: algoritmo Bron–Kerbosch para notablemente marcar qué grupos difieren.
- **Chequeo de varianzas (Fmax)**: alerta cuando las varianzas son heterogéneas.
- **Asistente Pedagógico IA**: pestaña *Chat IA* (Gemini) que explica conceptos de inferencia visual.
- **Gestión docente**: exportación/importación de escenarios en JSON (compatible con `GEMS_Scenario_*.json`).
- **Manual integrado** con las 3 reglas de inferencia y diagramas de referencia.

## 🛠️ Stack

| Componente | Tecnología |
|---|---|
| Frontend | HTML único + Tailwind CSS v3 (CDN) |
| Gráficas | Chart.js v4 (plugin custom de barras de error) |
| IA | `api/chat.ts` en Vercel con `@google/genai` (Gemini 2.5 Flash) |
| Hosting | Vercel (plan Hobby) |
| Repo | rgelabertf/inferstat |

## 📂 Estructura del proyecto

```
Inferencia Visual/
  InferStat-Evaluador-Inferencia.html   # App principal (archivo único)
  api/chat.ts                           # Proxy Chat IA (Gemini)
  package.json · vercel.json · LICENSE
  docs/                                 # Manual de Usuario y reglas
  assets/                               # Diagramas del manual
  "versión para compartir/"             # HTMLs distribuibles
```

## ⚙️ Despliegue local

1. Abre `InferStat-Evaluador-Inferencia.html` en cualquier navegador (sin servidor).
2. Para el Chat IA, despliega en Vercel y añade la env var `GEMINI_API_KEY`.

## 📜 Licencia

MIT © 2026 — Rolando Gelabert Fernández · Universidad Autónoma del Carmen