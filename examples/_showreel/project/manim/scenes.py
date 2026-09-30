"""Halves: 1/2 + 1/4 + 1/8 + ... = 1, one tile per musical beat (0.5 s), 4.0 s in all.

Beat sheet (silent clip for the showreel page, placed at film 21.0 s)
  1. t=0     the unit square, its first half lit, the series and the running sum 0.5 (frame 0 complete)
  2. t=0.5.. one more tile per beat, each half of what is left; the running sum stays true
  3. t=3.0   the rest cascades in; the sum becomes the limit: = 1
"""
from st_manim import *

SIDE = 4.5
TERMS = ["0.5", "0.75", "0.875", "0.9375", "0.96875", "0.984375"]


def tiles(n):
    """Rectangles (x0, y0, w, h) of the first n halvings of a square, alternating the split."""
    x, y, w, h = -SIDE / 2, -SIDE / 2, SIDE, SIDE
    out = []
    for k in range(n):
        if k % 2 == 0:      # split vertically: take the left half
            out.append((x, y, w / 2, h)); x += w / 2; w /= 2
        else:               # split horizontally: take the top half
            out.append((x, y + h / 2, w, h / 2)); h /= 2
    return out


class Halves(ShowCameraScene):
    def construct(self):
        ink, mint, muted = T.ink, T.emph, T.muted
        origin = np.array([-3.85, 0.3, 0])
        frame = Square(side_length=SIDE, stroke_color=muted, stroke_width=3).move_to(origin)

        def rect(r, color, opacity):
            x0, y0, w, h = r
            m = Rectangle(width=w, height=h, stroke_color=T.bg, stroke_width=4,
                          fill_color=color, fill_opacity=opacity)
            m.move_to(origin + np.array([x0 + w / 2, y0 + h / 2, 0]))
            return m

        R = tiles(12)
        first = rect(R[0], mint, 1.0)
        half = MathTex(r"\tfrac{1}{2}", color=T.bg, font_size=96).move_to(first)

        series = MathTex(r"\tfrac{1}{2}", "+", r"\tfrac{1}{4}", "+", r"\tfrac{1}{8}", "+", r"\cdots",
                         color=ink, font_size=80)
        series.next_to(frame, RIGHT, buff=0.75).align_to(frame, UP).shift(DOWN * 0.1)
        cap = Text("sum of the tiles so far", font=T.body, weight=NORMAL, color=muted).scale(0.36)
        cap.next_to(series, DOWN, buff=0.75).align_to(series, LEFT)
        num = Text(TERMS[0], font=T.body, weight=MEDIUM, color=ink).scale(1.05)
        num.next_to(cap, DOWN, buff=0.3).align_to(cap, LEFT)
        rule = Text("each tile is half of what is left", font=T.body, color=muted).scale(0.3)
        rule.next_to(frame, DOWN, buff=0.32).align_to(frame, LEFT)

        self.add(frame, first, half, series, cap, num, rule)     # frame 0 is complete
        cam = self.camera.frame
        cam.save_state()
        # a slow push over the whole clip keeps it alive between beats
        self.play(cam.animate.scale(0.985).shift(np.array([0.04, 0.01, 0])), run_time=0.5, rate_func=linear)

        prev = first
        for k in range(1, 6):
            t = rect(R[k], mint, 1.0)
            new_num = Text(TERMS[k], font=T.body, weight=MEDIUM, color=ink).scale(1.05)
            new_num.move_to(num, aligned_edge=LEFT)
            grow = GrowFromEdge(t, LEFT if k % 2 == 0 else UP)
            self.play(grow, prev.animate.set_fill(ink, opacity=0.16 + 0.05 * k),
                      FadeOut(half) if k == 1 else Wait(0),
                      FadeTransform(num, new_num), run_time=0.24, rate_func=rate_functions.ease_out_cubic)
            num = new_num
            prev = t
            self.play(cam.animate.scale(0.996), run_time=0.26, rate_func=linear)

        # t = 3.0: the rest cascades in and the sum becomes its limit
        rest = VGroup(*[rect(r, ink, 0.4) for r in R[6:]])
        one = MathTex("=", "1", font_size=80)
        one[0].set_color(ink); one[1].set_color(mint)
        one.next_to(series, RIGHT, buff=0.3)
        final = Text("1", font=T.body, weight=MEDIUM, color=mint).scale(1.05).move_to(num, aligned_edge=LEFT)
        self.play(LaggedStart(*[FadeIn(m, scale=0.6) for m in rest], lag_ratio=0.25),
                  prev.animate.set_fill(ink, opacity=0.45),
                  frame.animate.set_stroke(mint, width=5),
                  Write(one), FadeTransform(num, final), run_time=0.4, rate_func=rate_functions.ease_out_cubic)
        self.play(cam.animate.scale(0.992), run_time=0.6, rate_func=linear)
        self.mark("poster")
