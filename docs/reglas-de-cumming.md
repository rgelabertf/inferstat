# Reglas de Cumming (inferencia visual)

Fuente: Cumming, G. & Finch, S. (2005). *Inference by Eye: Confidence Intervals and How to Read Pictures of Data.* The American Statistician.

## La idea

Con **intervalos de confianza al 95%**, la *amplitud del solapamiento* entre dos grupos permite inferir la significancia estadística (p < 0.05) sin calcular un p-value.

Define:

- **Brazo (arm)** = distancia desde la media hasta el límite del IC = `t × SE`, con:
  - `SE = SD / √n`
  - `t ≈ 2` (n ≥ 10), `t ≈ 2.3` (4 ≤ n < 10), `t ≈ 4.3` (n ≤ 3).
- **Solapamiento (overlap)** = `(CI₁ + CI₂) − |M₁ − M₂|` (cuánto se cruzan las dos barras).

## Las 3 reglas

| Regla | Condición | Conclusión |
|---|---|---|
| 1. Separación total | `overlap ≤ 0` | **p < 0.01** — evidencia muy fuerte |
| 2. Solapamiento ligero | `0 < overlap < ½ brazo` (solap. < ½ distancia media-límite) | **p < 0.05** — evidencia moderada |
| 3. Solapamiento grande | `overlap ≥ ½ brazo` | **p > 0.05** — no significativo |

> Nota: el promedio de los dos brazos se usa como referencia del "½ brazo".

## Advertencias clave

1. **Mismas unidades visuales**: comparar grupos con el MISMO tipo de barra (IC con IC).
2. **n pequeño → IC ancho**: ausencia de significancia puede deberse a falta de potencia, no a ausencia de efecto.
3. **Varianzas heterogéneas (Fmax > 3)**: el solapamiento visual es engañoso; interpretar con cautela.
4. **Significancia ≠ relevancia**: p < 0.05 indica evidencia de una diferencia; la magnitud y utilidad práctica se juzgan aparte.

## Implementación en InferStat

Estas reglas están implementadas en `checkSignificance(s1, s2)` y se reflejan en:
- El **Asistente Pedagógico** (interpretación de pares de grupos).
- Las **letras de agrupación (CLD)**: grupos que comparten letra no difieren; sin letras comunes → difieren.
- El **Modo Desafío** (verificación de la respuesta correcta).