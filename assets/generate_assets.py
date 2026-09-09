import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import numpy as np
from PIL import Image, ImageDraw
import os

OUT = os.path.dirname(os.path.abspath(__file__))

# ============================================================
# 1. BACKGROUND
# ============================================================
def generate_background():
    W, H = 1920, 1080
    arr = np.zeros((H, W, 3), dtype=np.uint8)
    for y in range(H):
        t = y / H
        r = int((10 + t * 25) * (1 - t*0.3))
        g = int((20 + t * 40) * (1 - t*0.2))
        b = int((50 + t * 30))
        arr[y, :] = (min(r,255), min(g,255), min(b,255))
    img = Image.fromarray(arr, 'RGB')
    draw = ImageDraw.Draw(img)
    for i in range(0, H, 40):
        alpha = int(8 + 4 * np.sin(i * np.pi / 200))
        draw.line([(0, i), (W, i)], fill=(30, 55, 80, alpha), width=1)
    for i in range(0, W, 60):
        alpha = int(5 + 3 * np.sin(i * np.pi / 300))
        draw.line([(i, 0), (i, H)], fill=(25, 50, 75, alpha), width=1)
    for r in range(300, 0, -1):
        alpha = int(15 * (1 - r/300))
        draw.ellipse([-r, -r, r, r], fill=(0, 0, 0, alpha))
        draw.ellipse([W-r, -r, W+r, r], fill=(0, 0, 0, alpha))
        draw.ellipse([-r, H-r, r, H+r], fill=(0, 0, 0, alpha))
        draw.ellipse([W-r, H-r, W+r, H+r], fill=(0, 0, 0, alpha))
    path = os.path.join(OUT, 'simulator_bg.png')
    img.save(path, 'PNG')
    print(f'[OK] Background: {path}')

# ============================================================
# 2. DIAGRAM (three-panel) — versión simplificada
# ============================================================
def generate_diagram():
    fig, axes = plt.subplots(1, 3, figsize=(18, 6))
    fig.patch.set_facecolor('#FAFAFA')

    panels = [
        {'title': 'Regla 1: IC se traslapan Poco', 'result': 'p < 0.05  →  Significativo',
         'color': '#2E7D32', 'ctrl_m': 10, 'ctrl_ci': 4.0, 'trt_m': 17, 'trt_ci': 4.0},
        {'title': 'Regla 2: Media Fuera del IC Ajeno', 'result': 'p < 0.01  →  Altamente Significativo',
         'color': '#1565C0', 'ctrl_m': 10, 'ctrl_ci': 4.0, 'trt_m': 22, 'trt_ci': 4.0},
        {'title': 'Regla 3: IC se traslapan Ampliamente', 'result': 'p > 0.05  →  No Significativo',
         'color': '#757575', 'ctrl_m': 10, 'ctrl_ci': 4.0, 'trt_m': 13, 'trt_ci': 4.0},
    ]

    for ax, p in zip(axes, panels):
        m1, ci1 = p['ctrl_m'], p['ctrl_ci']
        m2, ci2 = p['trt_m'], p['trt_ci']
        x = np.array([1, 2])

        ax.errorbar(x, [m1, m2], yerr=[ci1, ci2], fmt='o', color='#1A237E',
                     capsize=12, capthick=3, markersize=16, linewidth=3, zorder=5)
        ax.plot(x, [m1, m2], 'o', color='#D32F2F', markersize=10, zorder=6)

        for i, (m, ci) in enumerate(zip([m1, m2], [ci1, ci2])):
            ax.annotate(f'Media = {m}', (x[i], m + ci + 0.6),
                       ha='center', fontsize=11, fontweight='bold', color='#1A237E')

        ax.set_xticks([1, 2])
        ax.set_xticklabels(['Control', 'Tratamiento'], fontsize=13, fontweight='bold')
        ax.set_ylabel('Valor', fontsize=11)
        ax.set_ylim(0, 30)
        ax.set_title(p['title'], fontsize=13, fontweight='bold', pad=12, color='#1A237E')
        ax.grid(axis='y', alpha=0.15)

        ax.text(0.5, -0.08, p['result'], transform=ax.transAxes,
               ha='center', fontsize=13, fontweight='bold', color=p['color'])

    fig.suptitle('Las 3 Reglas de Inferencia Visual por Solapamiento de IC 95%',
                 fontsize=17, fontweight='bold', y=1.01, color='#1A237E')
    plt.tight_layout()
    path = os.path.join(OUT, 'inference_rules_diagram.png')
    plt.savefig(path, dpi=200, bbox_inches='tight', facecolor='#FAFAFA')
    plt.close()
    print(f'[OK] Diagram: {path}')

# ============================================================
# 3. INFOGRAPHIC — FOREST PLOT STYLE
#    Each rule uses a forest plot (horizontal CI bars stacked)
#    so there is NO vertical distortion of overlap.
# ============================================================
def generate_infographic():
    fig = plt.figure(figsize=(16, 11))
    fig.patch.set_facecolor('#FAFAFA')

    ax_title = fig.add_axes([0, 0.925, 1, 0.07])
    ax_title.axis('off')
    ax_title.text(0.5, 0.65, 'Inferencia Visual: Las 3 Reglas del Solapamiento de IC 95%',
                  ha='center', fontsize=20, fontweight='bold', color='#1A237E',
                  transform=ax_title.transAxes)
    ax_title.text(0.5, 0.2, 'Compara los intervalos de confianza al 95% entre dos grupos usando estas reglas',
                  ha='center', fontsize=13, color='#555', style='italic',
                  transform=ax_title.transAxes)

    # Rule definitions with carefully chosen values
    # Each CI is mean +/- ci_half
    rules = [
        {
            'y0': 0.62, 'h': 0.28,
            'title': 'Regla 1: Diferencia Significativa',
            'subtitle': 'El solapamiento de IC es MENOR que la mitad del margen de error',
            'conclusion': 'p < 0.05  →  Conclusión: SÍ hay diferencia significativa',
            'color': '#2E7D32', 'icon': '✓', 'bg': '#E8F5E9',
            'ctrl_mean': 10, 'ctrl_ci': 4.0,
            'trt_mean': 17,  'trt_ci': 4.0,
        },
        {
            'y0': 0.33, 'h': 0.28,
            'title': 'Regla 2: Diferencia Altamente Significativa',
            'subtitle': 'La media de un grupo cae FUERA del IC del otro grupo',
            'conclusion': 'p < 0.01  →  Conclusión: Diferencia MUY significativa',
            'color': '#1565C0', 'icon': '★', 'bg': '#E3F2FD',
            'ctrl_mean': 10, 'ctrl_ci': 4.0,
            'trt_mean': 22,  'trt_ci': 4.0,
        },
        {
            'y0': 0.04, 'h': 0.28,
            'title': 'Regla 3: Sin Diferencia Significativa',
            'subtitle': 'El solapamiento de IC es MAYOR que la mitad del margen de error',
            'conclusion': 'p > 0.05  →  Conclusión: NO hay diferencia significativa',
            'color': '#616161', 'icon': '⊘', 'bg': '#F5F5F5',
            'ctrl_mean': 10, 'ctrl_ci': 4.0,
            'trt_mean': 13,  'trt_ci': 4.0,
        },
    ]

    for r in rules:
        y0, h = r['y0'], r['h']

        # Background card
        card_ax = fig.add_axes([0.015, y0, 0.97, h])
        card_ax.axis('off')
        card = mpatches.FancyBboxPatch((0, 0), 1, 1,
                                        boxstyle="round,pad=0.02",
                                        facecolor=r['bg'], edgecolor=r['color'],
                                        linewidth=2.5, alpha=0.85,
                                        transform=card_ax.transAxes)
        card_ax.add_patch(card)
        card_ax.plot([0.008, 0.008], [0.05, 0.95], color=r['color'],
                     linewidth=8, alpha=0.7, transform=card_ax.transAxes,
                     clip_on=False, solid_capstyle='round')

        # Icon
        card_ax.text(0.03, 0.7, r['icon'], fontsize=28, ha='center', va='center',
                    color=r['color'], fontweight='bold', transform=card_ax.transAxes)

        # Title, subtitle, conclusion
        card_ax.text(0.06, 0.75, r['title'], fontsize=15, fontweight='bold',
                    color='#1A237E', va='center', transform=card_ax.transAxes)
        card_ax.text(0.06, 0.42, r['subtitle'], fontsize=10.5, color='#444',
                    va='center', transform=card_ax.transAxes)
        card_ax.text(0.06, 0.14, r['conclusion'], fontsize=11.5, fontweight='bold',
                    color=r['color'], va='center', transform=card_ax.transAxes)

        # ---- Forest-plot style mini chart (simplified) ----
        ax_chart = fig.add_axes([0.52, y0 + 0.03, 0.44, h - 0.06])
        ax_chart.set_facecolor('white')

        ctrl_m = r['ctrl_mean']
        ctrl_ci = r['ctrl_ci']
        trt_m = r['trt_mean']
        trt_ci = r['trt_ci']

        ax_chart.errorbar(ctrl_m, 1, xerr=ctrl_ci, fmt='o', color='#1A237E',
                           capsize=8, capthick=2.5, markersize=16, linewidth=3, zorder=5)
        ax_chart.plot(ctrl_m, 1, 'o', color='#D32F2F', markersize=10, zorder=6)
        ax_chart.annotate(f'Media = {ctrl_m}', (ctrl_m, 1),
                         textcoords='offset points', xytext=(0, 16),
                         fontsize=10, fontweight='bold', color='#1A237E', ha='center', va='bottom')

        ax_chart.errorbar(trt_m, 2, xerr=trt_ci, fmt='o', color='#E65100',
                           capsize=8, capthick=2.5, markersize=16, linewidth=3, zorder=5)
        ax_chart.plot(trt_m, 2, 'o', color='#D32F2F', markersize=10, zorder=6)
        ax_chart.annotate(f'Media = {trt_m}', (trt_m, 2),
                         textcoords='offset points', xytext=(0, -16),
                         fontsize=10, fontweight='bold', color='#E65100', ha='center', va='top')

        ax_chart.set_yticks([1, 2])
        ax_chart.set_yticklabels(['Control', 'Tratamiento'], fontsize=11, fontweight='bold')
        ax_chart.set_xlabel('Valor', fontsize=9)
        ax_chart.axvline(x=ctrl_m, ymin=0, ymax=1, color='#1A237E', linestyle=':', alpha=0.3, linewidth=1)
        ax_chart.axvline(x=trt_m, ymin=0, ymax=1, color='#E65100', linestyle=':', alpha=0.3, linewidth=1)

        # Shade overlap region
        ctrl_left  = ctrl_m - ctrl_ci
        ctrl_right = ctrl_m + ctrl_ci
        trt_left   = trt_m - trt_ci
        trt_right  = trt_m + trt_ci
        o_left  = max(ctrl_left, trt_left)
        o_right = min(ctrl_right, trt_right)
        if o_right > o_left:
            ax_chart.axvspan(o_left, o_right, ymin=0.05, ymax=0.95,
                            color=r['color'], alpha=0.12, zorder=1)

        all_x = [ctrl_m - ctrl_ci, ctrl_m + ctrl_ci, trt_m - trt_ci, trt_m + trt_ci]
        x_pad = 3
        ax_chart.set_xlim(min(all_x) - x_pad, max(all_x) + x_pad)
        ax_chart.set_ylim(0.3, 2.7)
        ax_chart.grid(axis='x', alpha=0.15)

    # Footer
    ax_footer = fig.add_axes([0, 0.0, 1, 0.03])
    ax_footer.axis('off')
    ax_footer.text(0.5, 0.5, 'Basado en: Cumming, G. (2014). The New Statistics. Psychological Science.',
                   ha='center', fontsize=10, style='italic', color='#999',
                   transform=ax_footer.transAxes)

    path = os.path.join(OUT, 'visual_inference_infographic.png')
    plt.savefig(path, dpi=200, bbox_inches='tight', facecolor='#FAFAFA')
    plt.close()
    print(f'[OK] Infographic: {path}')


if __name__ == '__main__':
    generate_background()
    generate_diagram()
    generate_infographic()
    print('\nAll 3 assets generated successfully!')
