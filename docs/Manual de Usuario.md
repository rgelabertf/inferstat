# 📘 InferStat — Manual de Usuario

**InferStat** es un Objeto Virtual de Aprendizaje (OVA) de inferencia estadística visual: permite dominar la interpretación de barras de error, intervalos de confianza y significancia estadística mediante las reglas de solapamiento de Geoff Cumming.

## Modos de uso

### 1. Modo Libre (Simulador)

El corazón del OVA, para exploración libre:

- **Grupos (2–5)**: la media (M), desviación estándar (SD) y tamaño de muestra (n) de cada grupo se editan en las tarjetas.
- **Tipo de barras**: Error Estándar (SE), Intervalo de Confianza al 95% (IC), Desviación Estándar (SD) o Ambas. Cada tipo se dibuja con color y grosor propios.
- **Gráfico en tiempo real**: el solapamiento se actualiza al mover cualquier control.
- **Asistente Pedagógico**: debajo del gráfico se interpretan los solapamientos entre grupos consecutivos (G1 vs G2, G2 vs G3, …) con estimación del p-value (p < 0.01, p < 0.05, p > 0.05).
- **Letras de agrupación (CLD)**: al activarlas, los grupos que comparten letra NO difieren significativamente; los que no comparten letras SÍ difieren.
- **Chequeo de varianzas (Fmax)**: alerta cuando las varianzas son heterogéneas (Fmax > 3), señalando que el solapamiento puede ser engañoso.
- **Escenarios de demostración**: botones con configuraciones pedagógicas (diferencia clara, sin diferencia, solapamiento ligero, paradoja transitiva).

### 2. Modo Desafío (Evaluación interactiva)

Para poner a prueba el «ojo clínico» del estudiante:

1. Se generan **dos grupos aleatorios** con sus IC al 95%.
2. El estudiante decide: *¿existe diferencia significativa (p < 0.05)?*
3. El sistema valida la respuesta con retroalimentación inmediata (✅/❌ y explicación).
4. «🎲 Nuevo reto» genera ejercicios infinitos. Opcionalmente se incluye el chequeo de varianzas.

## Gestión docente

### Exportar / Importar escenarios (JSON)

- **💾 Exportar**: descarga el estado actual como `inferstat_escenario.json` para reutilizarlo en clase.
- **📂 Importar**: carga un escenario guardado (inclusive archivos del antiguo GEMS `GEMS_Scenario_*.json`).
- **Recomendación**: nómbralos con un nombre descriptivo, ej. `paradoja_no_transitiva.json`.

## Interpretación de resultados

| Situación visual | Significado |
|---|---|
| IC no se solapan | Evidencia muy fuerte de diferencia (p < 0.01) |
| IC se solapan menos de ½ brazo | Evidencia moderada (p < 0.05) |
| IC se solapan más de ½ brazo | No hay evidencia de diferencia (p > 0.05) |

> **Precaución:** con n ≤ 3 las barras de SE e IC son inestables. Con varianzas heterogéneas (Fmax > 3), el solapamiento visual puede ser engañoso. Siempre compara el mismo tipo de barras entre grupos.

## Chat IA

La pestaña **Chat IA** consulta a un asistente con Gemini (proxy en `api/chat.ts`) sobre barras de error, IC, reglas de Cumming, CLD, homocedasticidad y errores comunes. Si el despliegue no tiene la función `api/chat` configurada, la app sigue funcionando y muestra un aviso.

## Atribución

- Reglas de inferencia visual: Cumming, G. & Finch, S. (2005). *Inference by Eye: Confidence Intervals and How to Read Pictures of Data.* The American Statistician.
- Formato de la familia `-Stat` (skill `stat-ova-format`).