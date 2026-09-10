import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, ImageRun,
  Header, Footer, AlignmentType, BorderStyle, WidthType, ShadingType,
  VerticalAlign, PageNumber, PageBreak, HeadingLevel, LevelFormat } from 'docx';

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dir, '..');
const OUT = resolve(ROOT, 'versión para compartir', 'InferStat_Manual_Usuario_UNACAR.docx');

// ---------- helpers ----------
const BRAND = '2563EB';
const DARK = '111827';
const GRAY = '4B5563';

function t(text, opts = {}) {
  return new TextRun({ text, size: opts.size ?? 20, bold: opts.bold ?? false, italics: opts.italics ?? false, color: opts.color ?? DARK, font: 'Segoe UI', ...opts });
}
function p(text, opts = {}) {
  const runs = Array.isArray(text) ? text : [t(text)];
  return new Paragraph({ spacing: { after: opts.after ?? 120, before: opts.before ?? 0, line: 280 }, alignment: opts.align, children: runs });
}
function bullet(text, opts = {}) {
  const runs = Array.isArray(text) ? text : [t(text)];
  return new Paragraph({ children: runs, bullet: { level: 0 }, spacing: { after: 60, line: 280 }, alignment: opts.align });
}
function num(text) {
  return new Paragraph({ children: [t(text)], numbering: { reference: 'num', level: 0 }, spacing: { after: 60, line: 280 } });
}
function h1(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 240, after: 120 }, children: [t(text, { size: 30, bold: true, color: BRAND })] });
}
function h2(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 180, after: 90 }, children: [t(text, { size: 24, bold: true, color: '1D4ED8' })] });
}
function spacer(twips = 200) {
  return new Paragraph({ children: [t('')], spacing: { after: twips } });
}
function caption(text) {
  return new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [t(text, { size: 16, italics: true, color: GRAY })] });
}
function cell(text, { header = false, fill = null, align = AlignmentType.LEFT } = {}) {
  return new TableCell({
    shading: fill ? { type: ShadingType.CLEAR, fill } : undefined,
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({ alignment: align, children: [t(text, { size: 18, bold: header, color: header ? 'FFFFFF' : DARK })] })],
  });
}
function table(headers, rows, { zebra = true } = {}) {
  const headerRow = new TableRow({ tableHeader: true, children: headers.map((hd) => cell(hd, { header: true, fill: BRAND })) });
  const bodyRows = rows.map((r, i) => new TableRow({ children: r.map((c) => cell(c, { fill: zebra && i % 2 === 1 ? 'F3F4F6' : null })) }));
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
      left: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
      right: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
    },
    rows: [headerRow, ...bodyRows],
  });
}

// ---------- images ----------
function pngDims(buf) {
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}
const infographic = readFileSync(resolve(ROOT, 'assets', 'visual_inference_infographic.png'));
const rules = readFileSync(resolve(ROOT, 'assets', 'inference_rules_diagram.png'));
function scaled(img, maxW = 520) {
  const { width, height } = pngDims(img);
  const r = Math.min(1, maxW / width);
  return new ImageRun({ type: 'png', data: img, transformation: { width: Math.round(width * r), height: Math.round(height * r) } });
}

// ---------- cover ----------
const cover = [
  spacer(400),
  p('UNIVERSIDAD AUTÓNOMA DEL CARMEN', { align: AlignmentType.CENTER, runOpts: { bold: true, size: 26, color: '#0F1115' } }),
  p('Facultad de Ciencias Naturales', { align: AlignmentType.CENTER }),
  p('Maestría en Ciencias en Restauración Ecológica · Bases de Datos para la Experimentación', { align: AlignmentType.CENTER }),
  spacer(1200),
  p('Manual de Usuario', { align: AlignmentType.CENTER, runOpts: { bold: true, color: BRAND, size: 24 } }),
  p('InferStat — Evaluador de Inferencia Visual', { align: AlignmentType.CENTER, runOpts: { size: 40, bold: true } }),
  p('OVA de barras de error, intervalos de confianza y reglas de inferencia visual de Geoff Cumming', { align: AlignmentType.CENTER, runOpts: { italics: true, size: 20 } }),
  spacer(900),
  p('Dr. Rolando Gelabert Fernández', { align: AlignmentType.CENTER, runOpts: { size: 22, bold: true } }),
  p('Año académico 2026', { align: AlignmentType.CENTER }),
  spacer(300),
  p('Acceso: https://inferstat.vercel.app', { align: AlignmentType.CENTER, runOpts: { size: 18, color: BRAND } }),
  new Paragraph({ children: [new PageBreak()] }),
];

// ---------- fichas / presentación ----------
const backmatter = [
  h1('Presentación del manual'),
  p('Este manual te guía en el uso de InferStat, un Objeto Virtual de Aprendizaje (OVA) de inferencia estadística visual. Con él aprenderás a leer y a interpretar barras de error, intervalos de confianza al 95 % y a decidir si dos o más grupos difieren significativamente mediante las reglas de inferencia visual de Geoff Cumming («inference by eye»).'),
  p('InferStat es la versión actualizada del OVA GEMS usado en la asignatura; además del simulador incluye un modo de auto-evaluación (Desafío), letras de agrupación (CLD), chequeo de varianzas (Fmax) y un asistente de inteligencia artificial para resolver dudas.'),
  spacer(100),
  h2('Ficha técnica'),
  table(
    ['Elemento', 'Descripción'],
    [
      ['Aplicación', 'InferStat — Evaluador de Inferencia Visual'],
      ['Acceso web', 'https://inferstat.vercel.app'],
      ['Modo offline', 'Archivo InferStat_Evaluador_Inferencia.html (versión para compartir); se abre en cualquier navegador sin instalar nada.'],
      ['Requisitos', 'Navegador moderno (Chrome, Edge, Firefox). Internet solo para el Chat IA.'],
      ['Tecnología', 'HTML único · Tailwind CSS · Chart.js v4 · Vercel Functions · Gemini'],
      ['Autor', 'Dr. Rolando Gelabert Fernández (UNACAR)'],
      ['Familia', 'OVA «-Stat» (NormaStat, HomoStat, InferStat)'],
    ],
  ),
  new Paragraph({ children: [new PageBreak()] }),
];

// ---------- sección 1-2 ----------
const body1 = [
  h1('1. ¿Qué es InferStat?'),
  p('InferStat es un simulador estadístico que dibuja en tiempo real las medias de hasta cinco grupos con sus barras de error. Cambia la media (M), la desviación estándar (SD) y el tamaño de muestra (n) y observa de inmediato cómo cambia el solapamiento de las barras, es decir, qué tan compatibles son los grupos entre sí.'),
  p('La idea central proviene de las recomendaciones de Cumming y Finch (2005): en lugar de depender solo del p-value, conviene inspeccionar visualmente los intervalos de confianza. Si las barras no se solapan, hay evidencia fuerte de diferencia; si se solapan mucho, no hay evidencia suficiente.'),

  h1('2. Acceso'),
  h2('2.1 En línea'),
  bullet([t('Abre el navegador y entra a '), t('https://inferstat.vercel.app', { bold: true, color: BRAND })]),
  h2('2.2 Sin conexión (versión para compartir)'),
  bullet('Recibe el archivo InferStat_Evaluador_Inferencia.html.'),
  bullet('Haz doble clic sobre el archivo: se abre en el navegador (no necesita instalación).'),
  bullet('Todo funciona sin Internet excepto el Chat IA (que muestra un aviso y no detiene la app).'),
  spacer(100),
  p([t('💡 ', {}), t('Marca en favoritos la URL o guarda el archivo HTML en una carpeta visible para tener el simulador siempre a mano.', { italics: true })]),
  new Paragraph({ children: [new PageBreak()] }),
];

// ---------- sección 3 ----------
const body2 = [
  h1('3. Modo Libre (Simulador)'),
  p('Es el corazón del OVA. Al cargar la app verás la pestaña «Análisis» con un gráfico y las tarjetas de los grupos.'),

  h2('3.1 Tarjetas de grupo (M, SD, n)'),
  table(
    ['Parámetro', 'Qué significa', 'Consejo'],
    [
      ['M — Media', 'Valor central de cada grupo', 'Muévela para separar o acercar los grupos'],
      ['SD — Desv. estándar', 'Dispersión de los datos', 'Una SD alta alarga las barras de error'],
      ['n — Muestra', 'Número de observaciones', 'Con n ≤ 3 las barras se vuelven inestables; usar n ≥ 10 para lecturas confiables'],
    ],
  ),
  p([t('Los botones ', {}), t('＋ / −', { bold: true }), t(' del encabezado de cada tarjeta agregan o quitan grupos (de 2 a 5).')]),

  h2('3.2 Tipo de barras'),
  p('En «Error» elige qué barras se dibujan sobre cada media:'),
  table(
    ['Tipo', 'Uso recomendado', 'Regla de lectura'],
    [
      ['SE (Error Estándar)', 'Exploración general', 'Dos SE ≈ un IC aproximado; sensibilidad media'],
      ['IC 95% (Intervalo de Confianza)', 'Inferencia formal', 'Es la base de las reglas de Cumming de este manual'],
      ['SD (Desviación Estándar)', 'Ver dispersión de los datos', 'NO usar para decidir diferencias (barras muy sensibles)'],
      ['Ambas', 'Ver todo', 'El IC se dibuja más grueso y oscuro; la SD más ligera'],
    ],
  ),
  p('Siempre compara el mismo tipo de barra entre grupos.'),

  h2('3.3 Asistente pedagógico e interpretación'),
  p('Debajo del gráfico, el asistente lee los solapamientos entre grupos consecutivos (G1 vs G2, G2 vs G3, …) y estima el nivel de significancia (p < 0.01, p < 0.05, p > 0.05). Úsalo como retroalimentación inmediata mientras exploras.'),

  h2('3.4 Letras de agrupación (CLD)'),
  p('Al activar «Letras de agrupación», cada grupo recibe una letra (a, b, c, …):'),
  bullet('Grupos que comparten al menos una letra NO difieren significativamente.'),
  bullet('Grupos que no comparten letras SÍ difieren significativamente.'),
  bullet('Un grupo puede tener dos letras (ej. «ab») si no se distingue de dos vecinos que sí se distinguen entre sí.'),
  p('Es la manera estándar de reportar resultados en publicaciones científicas.'),

  h2('3.5 Chequeo de varianzas (Fmax)'),
  p('El sistema calcula la razón de varianzas máxima (Fmax = SDmax² / SDmin²). Si Fmax > 3 aparece un aviso: las varianzas son heterogéneas y el solapamiento visual puede resultar engañoso.'),

  h2('3.6 Escenarios de demostración'),
  p('Los botones rápidos cargan situaciones pedagógicas listas para discutir:'),
  table(
    ['Escenario', 'Qué muestra'],
    [
      ['Diferencia clara', 'IC sin solapamiento → p < 0.01'],
      ['Sin diferencia', 'IC muy solapados → p > 0.05'],
      ['Solapamiento ligero', 'IC solapados menos de la mitad de un brazo → p < 0.05'],
      ['Paradoja transitiva', 'G1 ≈ G2 y G2 ≈ G3 pero G1 ≠ G3 (solapamiento no transitivo)'],
    ],
  ),
  new Paragraph({ children: [new PageBreak()] }),
];

// ---------- sección 4 ----------
const body3 = [
  h1('4. Interpretación de resultados'),
  p('Las reglas de Cumming se aplican sobre los intervalos de confianza al 95 %:'),
  spacer(80),
  table(
    ['Situación visual', 'Veredicto', 'Notación'],
    [
      ['Los IC no se solapan', 'Evidencia muy fuerte de diferencia', 'p < 0.01'],
      ['Los IC se solapan menos de ½ brazo', 'Evidencia moderada de diferencia', 'p < 0.05'],
      ['Los IC se solapan ½ brazo o más', 'No hay evidencia suficiente de diferencia', 'p > 0.05'],
    ],
  ),
  spacer(100),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [scaled(infographic)] }),
  caption('Figura 1. Infografía: cómo leer el solapamiento de los intervalos de confianza.'),
  spacer(100),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [scaled(rules)] }),
  caption('Figura 2. Diagrama de las reglas de inferencia visual (inference by eye).'),
  spacer(100),
  p([t('⚠️ ', {}), t('Precaución: con n ≤ 3 las barras de SE e IC son inestables. Con varianzas heterogéneas (Fmax > 3) el solapamiento visual puede ser engañoso. Compara siempre el mismo tipo de barras entre grupos.', { bold: true })]),
  new Paragraph({ children: [new PageBreak()] }),
];

// ---------- sección 5-7 ----------
const body4 = [
  h1('5. Modo Desafío (auto-evaluación)'),
  p('Sirve para entrenar el «ojo clínico»:'),
  num('El sistema genera dos grupos aleatorios con sus IC al 95 %.'),
  num('Tú decides: ¿existe diferencia significativa (p < 0.05)?'),
  num('Recibes retroalimentación inmediata (✅ / ❌) con la explicación visual.'),
  num('Pulsa «🎲 Nuevo reto» para obtener ejercicios infinitos.'),
  p('Consejo: completa al menos 10 retos por sesión y anota tus aciertos y errores.'),

  h1('6. Exportar / Importar escenarios'),
  bullet([t('💾 Exportar: ', { bold: true }), t('descarga el estado actual como inferstat_escenario.json para reutilizarlo en clase o en tu práctica.')]),
  bullet([t('📂 Importar: ', { bold: true }), t('carga un escenario guardado, incluso los archivos del antiguo GEMS (GEMS_Scenario_*.json).')]),
  bullet([t('Recomendación: ', { bold: true }), t('nombra los escenarios de forma descriptiva, ej. paradoja_no_transitiva.json.')]),

  h1('7. Chat IA'),
  p('La pestaña «Chat IA» consulta un asistente con Gemini especializado en barras de error, intervalos de confianza, reglas de Cumming, letras CLD, homocedasticidad y errores comunes. Pregúntale dudas como:'),
  bullet('¿Qué significa que dos IC se toquen exactamente en el borde?'),
  bullet('¿Por qué mi Fmax es alto y qué hago?'),
  bullet('¿Cómo asignó las letras el programa en este caso?'),
  p('Si el despliegue no tiene el Chat IA configurado, la app sigue funcionando y solo muestra un aviso.'),
  new Paragraph({ children: [new PageBreak()] }),
];

// ---------- sección 8 práctica guiada ----------
const practice = [
  h1('8. Práctica guiada'),
  p('Realiza los ejercicios en el Modo Libre. Usa el botón del escenario cuando se indique.'),
  h2('Ejercicio 1 · Diferencia clara'),
  num('Pulsa el botón del escenario «Diferencia clara».'),
  num('Observa la interpretación: ¿qué nivel de significancia reporta?'),
  num('Activa «Letras de agrupación»: ¿los grupos comparten o no letras?'),
  num('Escribe una conclusión de una frase usando M, IC y p.'),
  h2('Ejercicio 2 · Sin diferencia'),
  num('Pulsa «Sin diferencia».'),
  num('Describe el solapamiento entre G1 y G2 (¿más de media braza?).'),
  num('¿Qué letras reciben ambos grupos? ¿Qué concluyes sobre p?'),
  h2('Ejercicio 3 · Solapamiento ligero (el caso límite)'),
  num('Pulsa «Solapamiento ligero».'),
  num('Aproxima a ojo si los IC se solapan menos de la mitad de un brazo.'),
  num('Compara tu veredicto con el del asistente y con las letras CLD.'),
  h2('Ejercicio 4 · Paradoja de la transitividad'),
  num('Con 3 grupos, carga M = 100, 105 y 140; SD = 15; n = 30 en cada grupo.'),
  num('Comprueba que G1 vs G2 y G2 vs G3 no difieren, pero G1 vs G3 sí (p < 0.01).'),
  num('¿Por qué «no significativo» no es transitivo? Explícalo en 2–3 líneas.'),
  h2('Ejercicio 5 · Desafío'),
  num('Cambia al Modo Desafío y genera 10 retos; lleva registro de tus respuestas.'),
  num('Exporta el escenario «Paradoja transitiva» como paradoja_no_transitiva.json.'),
  h2('Entregable sugerido'),
  p('Redacta un informe breve (1 hoja) con: objetivos, los 4 escenarios analizados, tres capturas interpretadas por ti, tus resultados del Desafío y una lista de 3 errores comunes que hayas detectado.'),
  new Paragraph({ children: [new PageBreak()] }),
];

// ---------- sección 9-10 ----------
const backmatter2 = [
  h1('9. Precauciones y errores comunes'),
  table(
    ['Error común', 'Por qué evitarlo'],
    [
      ['Comparar barras de SD para decidir diferencias', 'Las barras SD casi siempre se solapan; no sirven para inferir p'],
      ['Usar n ≤ 3', 'SE e IC se vuelven inestables y los resultados visuales son engañosos'],
      ['Ignorar el aviso de Fmax > 3', 'Con varianzas heterogéneas el solapamiento de IC puede ser engañoso'],
      ['Comparar distinto tipo de barra entre grupos', 'Las reglas de Cumming solo aplican comparando barras iguales'],
      ['Interpretar «no significativo» como «igual»', 'p > 0.05 solo indica falta de evidencia, no equivalencia'],
    ],
  ),
  h1('10. Referencias'),
  p('Cumming, G., & Finch, S. (2005). Inference by eye: Confidence intervals and how to read pictures of data. The American Statistician, 59(2), 170–177.'),
  p('Cumming, G. (2009). Inference by eye: Reading the overlap of independent confidence intervals. Statistics in Medicine, 28(2), 205–220.'),
  p('Cumming, G. (2012). Understanding The New Statistics: Effect Sizes, Confidence Intervals, and Meta-Analysis. Routledge.'),
  p('GEMS OVA original y familia de OVA estadísticos «-Stat» (NormaStat, HomoStat, InferStat) — formato y despliegue descritos en la skill stat-ova-format.'),
  spacer(200),
  p([t('InferStat · OVA Estadístico de la Universidad Autónoma del Carmen. ', {}), t('https://inferstat.vercel.app', { color: BRAND })]),
];

// ---------- document assembly ----------
const doc = new Document({
  creator: 'Dr. Rolando Gelabert Fernández',
  title: 'InferStat — Manual de Usuario',
  subject: 'OVA de inferencia estadística visual (UNACAR)',
  description: 'Manual de uso y práctica guiada para el evaluador de inferencia visual InferStat.',
  styles: { default: { document: { run: { font: 'Segoe UI', size: 20, color: DARK }, paragraph: { spacing: { line: 280 } } } } },
  numbering: { config: [{ reference: 'num', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.START, style: { paragraph: { indent: { left: 360, hanging: 360 } } } }] }] },
  sections: [
    {
      headers: { first: new Header({ children: [] }), default: new Header({ children: [] }) },
      footers: { first: new Footer({ children: [] }), default: new Footer({ children: [] }) },
      children: cover,
    },
    {
      headers: { default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [t('InferStat · Manual de Usuario', { size: 16, color: GRAY, italics: true })] })] }) },
      footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ children: ['Página ', PageNumber.CURRENT, ' de ', PageNumber.TOTAL_PAGES], size: 16, color: GRAY })] })] }) },
      children: [...backmatter, ...body1, ...body2, ...body3, ...body4, ...practice, ...backmatter2],
    },
  ],
});

Packer.toBuffer(doc).then((buf) => {
  writeFileSync(OUT, buf);
  console.log('OK', OUT, buf.length, 'bytes');
}).catch((e) => { console.error('ERROR', e); process.exit(1); });