"""Why a circle's area is pi r squared: cut it into rings, straighten the rings, stack them.

Contract: cut a circle into thin rings, straighten each ring, and they stack into a triangle whose
height is r and whose base is 2 pi r; half base times height is pi r squared.

Beat sheet (one narration line per beat; ids match the `## id` headings in narration.md):

  scene    beat         on screen                                                  job
  Hook     hook         a disc with its radius r; "Why pi r^2?" beside it; the     pose the question, picture first
                        radius sweeps once round and the swept area lights up
  Rings    cutting      a ripple runs outward and cuts the disc into 8 rings       the rings are the pieces
           ringlength   one ring lit, the rest dimmed; an ember fill runs along    a ring is about its circumference
                        it behind a glowing dot; a small brace marks its width     long, and very thin
  Unroll   unrolling    the disc moves aside; copies of the rings straighten one   the move that makes it computable
                        by one into strips (outer-edge length), shortest on top
           pileup       the pile flashes bottom to top; a dashed triangle outline  "close to", not "equal to"
                        and a translucent veil show the steps that stick out
  Refine   refining     refine(): 8 -> 16 -> 32 rings, circle and stair together   thinner rings, smaller steps
           limit        64 rings; the steps vanish: rings -> disc, stair -> triangle   in the limit it is exact
  Label    heightline   a copy of the radius flies onto the triangle's side: r     symbols label what is on screen
           baseline     the circumference lights up and unrolls onto the base: 2 pi r
  Payoff   halfbh       A = 1/2 . 2 pi r . r assembled from copies of the labels   half base times height
           result       1/2 and 2 cancel (A = pi r . r), then A = pi r^2, boxed    the result, earned
           ending       both shapes outlined; end on the image (poster)            same area

Strips use the OUTER circumference as their length (the researcher's recommendation): the bottom strip
is exactly 2 pi r at every ring count, the stair sits slightly over the triangle and the overshoot
shrinks as the rings get thinner. Strips are left-aligned, so the limit is a right triangle; the
narration still only says "a triangle".

Every beat changes a large part of the picture on its words (fills dim to focus on a line, shapes
flash), so no stretch reads as a frozen frame (showtime qa warns at 2.5 s).

Colours (manim.json "colors"): area = hue1 (disc, rings, strips, triangle, A, pi r^2), r = hue4,
the circumference 2 pi r = hue3. Layout is by frame shape, so `--aspect 9:16` re-lays itself out.

9:16: a base of 2 pi r across a 1080 px frame keeps the whole diagram tiny. So the strips are
stacked small and horizontal while the narration says "shortest on top", and on "They pile up"
the stack turns a quarter turn and grows (R 1.0 -> 1.6): from then on the base runs down the
left edge (about 1360 px tall), the disc sits beside it and the equation below the disc.
All stair / triangle geometry is written in the frame's own axes (U along the base, V up the
height), so one set of functions draws both layouts.
"""
from st_manim import *

N0 = 8                       # rings in the first cut
SAMPLES = 145                # points per edge of a ring / strip (same for all, so they morph cleanly)


# ------------------------------------------------------------------ layout (16:9 and 9:16)

class Frame:
    """Where a stair / triangle sits: O is the right-angle corner, U runs along the base, V up the height."""

    def __init__(self, O, U, V) -> None:
        self.O, self.U, self.V = (np.array(v, dtype=float) for v in (O, U, V))

    def at(self, x: float, y: float) -> np.ndarray:
        return self.O + x * self.U + y * self.V


class Lay:
    def __init__(self) -> None:
        self.turn = is_portrait()                                     # 9:16: the stack turns on "pile"
        if is_portrait():
            self.R0, self.C0 = 2.55, np.array([0.0, 1.4, 0.0])         # hook / rings: big disc
            self.Q = np.array([0.0, 4.75, 0.0])                         # the question
            self.CNT0 = np.array([0.0, -1.5, 0.0])                      # "rings 8", clear of the captions
            # while the strips are stacked ("shortest on top"): small and horizontal
            self.RS, self.CS = 1.0, np.array([0.0, 3.0, 0.0])
            self.CNTS = np.array([0.0, 4.55, 0.0])
            self.FS = Frame([-3.0, -1.3, 0.0], RIGHT, UP)
            # from "They pile up" on: turned a quarter turn, base down the left edge, disc beside it
            self.R, self.C = 1.6, np.array([0.85, 3.55, 0.0])
            self.CNT = np.array([0.85, 1.35, 0.0])
            self.F = Frame([-3.45, 5.6, 0.0], DOWN, RIGHT)
            self.EQ, self.EQW = np.array([0.3, 1.1, 0.0]), 0.7         # under the disc; right edge ~910 px
        else:
            self.R0, self.C0 = 2.55, np.array([-3.0, -0.2, 0.0])
            self.Q = np.array([3.35, 0.35, 0.0])
            self.CNT0 = np.array([3.35, -1.25, 0.0])
            self.R, self.C = 1.9, np.array([-4.2, 1.4, 0.0])
            self.RS, self.CS = self.R, self.C
            self.CNT = self.CNTS = np.array([1.2, 3.0, 0.0])
            self.F = self.FS = Frame([-6.05, -2.75, 0.0], RIGHT, UP)
            self.EQ, self.EQW = np.array([2.6, 1.15, 0.0]), 0.56


LAY = Lay()
AREA = T.var("A") or T.hue(1)
RCOL = T.var("r") or T.hue(2)
CCOL = T.var("2") or T.hue(3)
SHADE = [AREA, interpolate_color(ManimColor(AREA), ManimColor(T.bg), 0.42).to_hex()]
LIT = interpolate_color(ManimColor(AREA), ManimColor(T.ink), 0.55).to_hex()


# ------------------------------------------------------------------ geometry

def band_points(a: float, b: float, u: float, anchor: np.ndarray, fr: Frame, closed: bool = True) -> np.ndarray:
    """The ring between radii a and b, straightened by u (0 = ring, 1 = flat strip).

    The outer edge keeps its length 2 pi b and bends with curvature (1-u)/b around `anchor`, its
    lowest point; the inner edge is the outer edge moved (b-a) toward the centre. At u=0 that is
    exactly the ring (split opposite `anchor`); at u=1 it is a 2 pi b x (b-a) rectangle sitting on
    `anchor`. Drawn in the frame's axes: x along fr.U, "up" along fr.V.
    """
    L = 2 * PI * b
    s = np.linspace(-0.5, 0.5, SAMPLES)
    k = (1.0 - u) / b
    z = np.zeros_like(s)
    if k > 1e-7:
        rho = 1.0 / k
        phi = s * L * k
        P = np.stack([rho * np.sin(phi), rho * (1 - np.cos(phi)), z], axis=1)
        Nrm = np.stack([-np.sin(phi), np.cos(phi), z], axis=1)
    else:
        P = np.stack([s * L, z, z], axis=1)
        Nrm = np.stack([z, np.ones_like(s), z], axis=1)
    def put(Q: np.ndarray) -> np.ndarray:
        return anchor + np.outer(Q[:, 0], fr.U) + np.outer(Q[:, 1], fr.V)

    if not closed:
        return put(P)
    inner = P + (b - a) * Nrm
    return put(np.concatenate([P, inner[::-1], P[:1]]))


def shape(points: np.ndarray, color: str) -> VMobject:
    m = VMobject(stroke_width=0)
    m.set_points_as_corners(points)
    m.set_fill(color, opacity=1.0)
    return m


def ring(i: int, n: int, C: np.ndarray, R: float, color: str = None, fr: Frame = None) -> VMobject:
    fr = fr or LAY.F
    a, b = i * R / n, (i + 1) * R / n
    return shape(band_points(a, b, 0.0, C - b * fr.V, fr), color or SHADE[i % 2])


def strip_anchor(i: int, n: int, R: float, fr: Frame = None) -> np.ndarray:
    """Where ring i's strip sits: aligned at the corner O, the outermost ring on the base."""
    fr = fr or LAY.F
    b = (i + 1) * R / n
    return fr.at(PI * b, (n - 1 - i) * R / n)


def strip(i: int, n: int, R: float, fr: Frame = None) -> VMobject:
    fr = fr or LAY.F
    a, b = i * R / n, (i + 1) * R / n
    return shape(band_points(a, b, 1.0, strip_anchor(i, n, R, fr), fr), SHADE[i % 2])


def rings(n: int, C: np.ndarray, R: float) -> VGroup:
    return VGroup(*[ring(i, n, C, R) for i in range(n)])


def stair(n: int, R: float) -> VGroup:
    return VGroup(*[strip(i, n, R) for i in range(n)])


def triangle(R: float, fr: Frame = None) -> Polygon:
    fr = fr or LAY.F
    t = Polygon(fr.at(0, 0), fr.at(2 * PI * R, 0), fr.at(0, R), stroke_width=0)
    t.set_fill(AREA, opacity=1.0)
    return t


def overhangs(n: int, R: float, fr: Frame = None) -> VGroup:
    """The bits of each strip that stick out past the triangle's slanted side (one small triangle each)."""
    fr = fr or LAY.F
    out = VGroup()
    for i in range(n):
        b, y0 = (i + 1) * R / n, (n - 1 - i) * R / n
        x1 = 2 * PI * b
        t = Polygon(fr.at(x1 - 2 * PI * R / n, y0 + R / n), fr.at(x1, y0 + R / n), fr.at(x1, y0), stroke_width=0)
        out.add(t.set_fill(T.emph, opacity=0.0))
    return out.set_z_index(4)


def disc(C: np.ndarray, R: float) -> Circle:
    return Circle(radius=R, stroke_width=0).set_fill(AREA, opacity=1.0).move_to(C)


def radius(C: np.ndarray, R: float) -> VGroup:
    """The radius (centre to the right edge) and its label, above the rings."""
    line = Line(C, C + np.array([R, 0.0, 0.0]), color=RCOL, stroke_width=T.stroke["data"] + 1)
    backstroke(line, width=3)
    dot = Dot(C, radius=0.06, color=RCOL)
    lab = backstroke(eq("r", font_size=80), width=7).next_to(line, UP, buff=0.1)
    g = VGroup(line, dot, lab)
    g.set_z_index(5)
    return g


def moved(m: Mobject, C: np.ndarray = None, R: float = None) -> Mobject:
    """What Unroll does to the hook picture: shrink from R0 to R about C0, then move C0 to C."""
    C = LAY.C if C is None else C
    k = (R or LAY.R) / LAY.R0
    return m.scale(k).move_to(C + (m.get_center() - LAY.C0) * k)


def to_stack(m: Mobject) -> Mobject:
    """Hook picture -> the stacking layout (the same as the final one in 16:9)."""
    return moved(m, LAY.CS, LAY.RS)


def grow(m: Mobject) -> Mobject:
    """9:16, on "pile": the disc part of the stacking layout -> the final layout."""
    return m.scale(LAY.R / LAY.RS, about_point=LAY.CS).shift(LAY.C - LAY.CS)


def turn(m: Mobject) -> Mobject:
    """9:16, on "pile": the stair of the stacking layout -> the final layout (a quarter turn, grown)."""
    ang = angle_of_vector(LAY.F.U) - angle_of_vector(LAY.FS.U)
    return m.rotate(ang, about_point=LAY.FS.O).scale(LAY.R / LAY.RS, about_point=LAY.FS.O).shift(LAY.F.O - LAY.FS.O)


def r_label() -> VMobject:
    """The triangle's r, styled exactly like the disc's (same size after the shrink, same backstroke)."""
    return backstroke(eq("r", font_size=80 * LAY.R / LAY.R0), width=7)


def side_labels() -> dict:
    """The height line + r (inside the triangle) and the base line + 2 pi r, as Label ends and Payoff starts."""
    R, F = LAY.R, LAY.F
    hline = Line(F.at(0, 0), F.at(0, R), color=RCOL, stroke_width=T.stroke["data"] + 1).set_z_index(4)
    hlab = r_label().next_to(hline, F.U, buff=0.16).set_z_index(5)
    base = Line(F.at(0, 0), F.at(2 * PI * R, 0), color=CCOL, stroke_width=T.stroke["data"] + 1.5).set_z_index(4)
    blab = backstroke(eq(r"2\pi r", font_size=72), width=6).set_z_index(5)
    if LAY.turn:   # beside the base, past the slanted side, above the burned captions
        blab.next_to(F.at(0.65 * 2 * PI * R, 0.35 * R), RIGHT, buff=0.25)
    else:
        blab.next_to(base, DOWN, buff=0.16)
    return dict(hline=hline, hlab=hlab, base=base, blab=blab)


def circumference() -> Circle:
    """The disc's rim, starting where it splits to unroll onto the base."""
    return Circle(radius=LAY.R, color=CCOL, stroke_width=T.stroke["data"] + 1.5).rotate(
        angle_of_vector(-LAY.F.V)).move_to(LAY.C).set_z_index(4)


def question() -> VGroup:
    """'Why pi r^2?': display type and the equation on one line (the display font has no Greek).
    mixed_line puts all three parts on the text's baseline, scales the math to the text's x-height and
    sets it bold to match the heavy display weight; q[1] is the math."""
    q = mixed_line("Why", tex(r"\pi r^2"), "?", size=80 if LAY.turn else 88).move_to(LAY.Q)
    if LAY.turn:   # 9:16: the "y" stays clear of the big disc under it
        q.shift(UP * max(0.0, LAY.C0[1] + LAY.R0 + 0.3 - q.get_bottom()[1]))
    return q


def ring_count(n: int) -> VGroup:
    """'rings 8': the label and the number on one baseline (the "g" of "rings" must not lower it)."""
    num = counter(n, font_size=44, color=T.ink)
    lab = label("rings", color=T.muted)
    g = VGroup(lab, num).arrange(RIGHT, buff=0.25)
    align_baseline(lab, num)
    g.num = num  # type: ignore[attr-defined]
    return g


def at_layout() -> dict:
    """The state every scene from Unroll on starts from (disc moved aside, 8 rings, 8 strips)."""
    C, R = LAY.C, LAY.R
    d = disc(C, R)
    rs = rings(N0, C, R).set_z_index(1)
    rad = moved(radius(LAY.C0, LAY.R0))            # the hook's radius, shrunk with the picture
    cnt = ring_count(N0).move_to(LAY.CNT)
    st = stair(N0, R).set_z_index(1)
    ghost_tri = DashedVMobject(triangle(R).set_fill(opacity=0).set_stroke(T.ghost, 2.5), num_dashes=70)
    ghost_tri.set_z_index(3)
    veil = triangle(R).set_fill(T.ink, opacity=0.2).set_z_index(3)
    return dict(disc=d, rings=rs, radius=rad, count=cnt, stair=st, ghost=ghost_tri, veil=veil)


class UnrollBand(Animation):
    """Straighten a ring into its strip while carrying it from `start` to `end` (its lowest point)."""

    def __init__(self, mob: VMobject, a: float, b: float, start: np.ndarray, end: np.ndarray, fr: Frame,
                 closed: bool = True, **kw) -> None:
        self.a, self.b, self.start_pt, self.end_pt, self.closed = a, b, np.array(start), np.array(end), closed
        self.fr = fr
        super().__init__(mob, **kw)

    def interpolate_mobject(self, alpha: float) -> None:
        t = self.rate_func(alpha)
        u = min(1.0, t * 1.15)                      # flat a little before it lands
        anchor = self.start_pt + (self.end_pt - self.start_pt) * t
        self.mobject.set_points_as_corners(band_points(self.a, self.b, u, anchor, self.fr, closed=self.closed))


# ------------------------------------------------------------------ scenes

class Hook(ShowScene):
    def construct(self):
        self.beat("hook")
        d = disc(LAY.C0, LAY.R0)
        q = question()
        self.add(d, q)                                  # the hook is complete at t=0
        rad = radius(LAY.C0, LAY.R0)
        self.play(Create(rad[0]), FadeIn(rad[1]), FadeIn(rad[2], shift=0.15 * UP), run_time=0.6)
        self.at("area")
        self.play(Indicate(d, color=LIT, scale_factor=1.03), run_time=1.0)
        self.at("circle")                               # the radius sweeps the whole disc once
        line0, lab_c = rad[0].copy(), rad[2].get_center() - LAY.C0

        wedge = Sector(radius=LAY.R0, angle=1e-3, stroke_width=0).set_fill(LIT, opacity=0.55).move_arc_center_to(LAY.C0)

        def sweep(m: VGroup, a: float) -> None:        # the area it sweeps lights up behind it
            th = TAU * a                                # a arrives eased (smooth)
            m[0].become(line0.copy().rotate(th, about_point=LAY.C0))
            m[1].move_to(LAY.C0 + rotate_vector(lab_c, th))
            m[2].become(Sector(radius=LAY.R0, angle=max(th, 1e-3), stroke_width=0)
                        .set_fill(LIT, opacity=0.55 * (1 - a) ** 0.5).move_arc_center_to(LAY.C0))

        self.add(wedge)
        self.play(UpdateFromAlphaFunc(VGroup(rad[0], rad[2], wedge), sweep), run_time=1.5)
        self.remove(wedge)
        self.play(Indicate(q[1], color=T.var("A"), scale_factor=1.15), run_time=0.8)


class Rings(ShowScene):
    def construct(self):
        self.beat("cutting")
        C, R = LAY.C0, LAY.R0
        d = disc(C, R)
        q = question()
        rad = radius(C, R)
        self.add(d, q, rad)                             # opens on Hook's last frame
        rs = rings(N0, C, R).set_z_index(1)
        for r in rs:
            r.set_fill(LIT)
        cnt = ring_count(1).move_to(LAY.CNT0)
        self.at("cut")
        # the ripple: rings light up from the centre outward, one click each (audio/mix.json)
        self.play(LaggedStart(*[FadeIn(r) for r in rs], lag_ratio=0.22), FadeIn(cnt),
                  count_to(cnt.num, N0, rate_func=linear), run_time=1.8)
        self.play(LaggedStart(*[r.animate.set_fill(SHADE[i % 2]) for i, r in enumerate(rs)], lag_ratio=0.12),
                  run_time=1.0)
        self.at("onion")                                 # the layers pulse outward, like an onion's
        self.play(LaggedStart(*[Indicate(r, color=LIT, scale_factor=1.0) for r in rs], lag_ratio=0.18), run_time=1.1)

        self.beat("ringlength")
        k = 5                                            # one ring, near the rim so its length reads
        others = [r for i, r in enumerate(rs) if i != k]
        self.at("ring")
        self.play(*[r.animate.set_fill(opacity=0.28) for r in others], d.animate.set_fill(opacity=0.28),
                  rs[k].animate.set_fill(LIT), run_time=1.0)
        mid = (k + 0.5) * R / N0
        path = Circle(radius=mid).rotate(-PI / 2).move_to(C)
        dot = glow_dot(path.get_start(), color=T.emph, radius=0.26, layers=10).set_z_index(7)
        a_in, a_out = k * R / N0, (k + 1) * R / N0

        def fill_ring(m: VMobject, a: float) -> None:   # the ring fills along its length behind the dot
            th = TAU * a                                # a arrives eased (smooth)
            m.become(AnnularSector(inner_radius=a_in, outer_radius=a_out, angle=max(th, 1e-3), start_angle=-PI / 2,
                                   stroke_width=0, fill_color=T.emph, fill_opacity=0.8).move_arc_center_to(C))

        trace = AnnularSector(inner_radius=a_in, outer_radius=a_out, angle=1e-3, start_angle=-PI / 2,
                              stroke_width=0, fill_opacity=0).move_arc_center_to(C).set_z_index(6)
        self.at("about")
        self.add(trace)
        self.play(FadeIn(dot, scale=0.5), run_time=0.3)
        self.play(MoveAlongPath(dot, path), UpdateFromAlphaFunc(trace, fill_ring), run_time=2.0)
        self.play(FadeOut(dot, scale=0.5), run_time=0.3)
        p_in = C + np.array([0.0, -k * R / N0, 0.0])
        p_out = C + np.array([0.0, -(k + 1) * R / N0, 0.0])
        br = Brace(Line(p_out, p_in), LEFT, buff=0.08, color=T.ink, sharpness=1.2).set_z_index(6)
        # "very thin": the ring's two edges light up bright and heavy, so its width reads at phone size
        edges = VGroup(*[Circle(radius=rr, stroke_color=T.ink, stroke_width=7).rotate(-PI / 2).move_to(C)
                         for rr in (a_in, a_out)]).set_z_index(6)
        self.at("thin")
        self.play(Create(edges), GrowFromCenter(br), run_time=0.5)
        self.hold(0.5)
        self.play(FadeOut(br), FadeOut(edges), FadeOut(trace), *[r.animate.set_fill(opacity=1.0) for r in others], d.animate.set_fill(opacity=1.0),
                  rs[k].animate.set_fill(SHADE[k % 2]), run_time=0.6)


class Unroll(ShowScene):
    def construct(self):
        self.beat("unrolling")
        C0, R0, C, R, FS = LAY.C0, LAY.R0, LAY.CS, LAY.RS, LAY.FS
        d = disc(C0, R0)
        q = question()
        rad = radius(C0, R0)
        rs = rings(N0, C0, R0).set_z_index(1)
        cnt = ring_count(N0).move_to(LAY.CNT0)
        self.add(d, q, rs, rad, cnt)                    # opens on Rings' last frame
        pic = VGroup(d, rs, rad)
        target = at_layout()
        self.play(ApplyFunction(to_stack, pic), FadeOut(q, shift=0.3 * RIGHT), cnt.animate.move_to(LAY.CNTS),
                  run_time=1.0)
        # copies of the rings straighten into strips; the rings stay (before and after, side by side)
        strips = VGroup()
        anims = []
        for i in range(N0):
            a, b = i * R / N0, (i + 1) * R / N0
            m = ring(i, N0, C, R, fr=FS).set_z_index(2)
            strips.add(m)
            anims.append(UnrollBand(m, a, b, C - b * FS.V, strip_anchor(i, N0, R, FS), FS,
                                    rate_func=smooth, run_time=1.6))
        self.at("into")
        # 9:16: a little slower, so the longest strip lands on "longest at the bottom" (no still stretch
        # before the turn; the small stack's flashes are too small to count as motion)
        self.play(LaggedStart(*anims, lag_ratio=0.45), run_time=5.6 if LAY.turn else 5.0)
        self.at("bottom")
        self.play(Indicate(strips[-1], color=LIT, scale_factor=1.03), run_time=0.8)
        self.beat("pileup")
        if LAY.turn:                                     # 9:16: "They pile up": the pile turns a quarter
            self.play(ApplyFunction(grow, pic), ApplyFunction(turn, strips, path_arc=-PI / 2),   # turn, grows
                      FadeOut(cnt), run_time=1.3)          # (the counter would cross the growing disc)
            cnt.move_to(LAY.CNT)
        else:                                            # the pile, bottom to top
            self.at("pile")
            self.play(LaggedStart(*[Indicate(m, color=LIT, scale_factor=1.0) for m in reversed(strips)],
                                  lag_ratio=0.15), run_time=1.2)
        self.at("something")
        self.play(Create(target["ghost"]), *([FadeIn(cnt)] if LAY.turn else []), run_time=1.1)
        self.at("triangle")                              # inside the triangle vs the steps that stick out
        self.play(FadeIn(target["veil"]), run_time=1.5)
        ov = overhangs(N0, LAY.R)                        # the steps that stick out flash once, against
        self.add(ov)                                     # a brighter veil over what is inside
        self.play(ov.animate.set_fill(opacity=1.0), target["veil"].animate.set_fill(opacity=0.45),
                  rate_func=there_and_back, run_time=1.0)
        self.remove(ov)


class Refine(ShowScene):
    def construct(self):
        self.beat("refining")
        C, R = LAY.C, LAY.R
        s = at_layout()
        self.add(s["disc"], s["rings"], s["radius"], s["count"], s["stair"], s["ghost"], s["veil"])
        state = {"old": VGroup(s["rings"], s["stair"])}

        def build(n: int) -> VGroup:
            g = VGroup(rings(n, C, R), stair(n, R)).set_z_index(1)
            if n != N0 and state["old"] is not None:
                # refine() fades in its first picture; that picture is an exact copy of what is
                # already on screen, so the fade is invisible. Drop the originals under it now.
                self.remove(*state["old"])
                state["old"] = None
            if n != N0:
                s["count"].num.set_value(n)
            return g

        cur = refine(self, build, ns=(8, 16, 32), run_times=(0.15, 1.5, 1.0), show_n=False, hold=0.35)
        self.beat("limit")
        self.at("thinner")                               # "as the rings get thinner": the last step, 64
        last = build(64)
        self.play(ReplacementTransform(cur, last), run_time=0.7)
        tri = triangle(R).set_z_index(1)
        self.at("vanish")
        self.play(FadeOut(last), FadeOut(s["veil"]), FadeIn(tri), run_time=1.4)
        self.at("triangle")
        self.play(FadeOut(s["ghost"]), Indicate(tri, color=LIT, scale_factor=1.04), run_time=1.0)


class Label(ShowScene):
    def construct(self):
        self.beat("heightline")
        C, R = LAY.C, LAY.R
        s = at_layout()
        tri = triangle(R).set_z_index(1)
        self.add(s["disc"], s["radius"], s["count"], tri)
        fills = VGroup(s["disc"], tri)
        rline, rlab = s["radius"][0], s["radius"][2]
        lab = side_labels()
        hline, hlab = lab["hline"], lab["hlab"]
        self.at("height")                                 # focus: fills dim, the lines stay bright
        self.play(FadeOut(s["count"]), fills.animate.set_fill(opacity=0.38), run_time=0.6)
        self.at("radius")
        self.play(TransformFromCopy(rline, hline, path_arc=-PI / 2), run_time=1.1)
        self.at("r")
        self.play(TransformFromCopy(rlab, hlab), run_time=0.7)
        self.play(fills.animate.set_fill(opacity=1.0), run_time=0.5)

        self.beat("baseline")
        circ = circumference()
        # the outermost ring lights up pink, then drains away as its edge unrolls onto the base
        outer = Annulus(inner_radius=R * (N0 - 1) / N0, outer_radius=R, stroke_width=0).move_to(C)
        outer.set_fill(CCOL, opacity=0.0).set_z_index(3)
        self.add(outer)
        self.at("outermost")
        self.play(Create(circ), fills.animate.set_fill(opacity=0.38), outer.animate.set_fill(opacity=0.7),
                  run_time=1.0)
        base = VMobject(stroke_color=CCOL, stroke_width=T.stroke["data"] + 1.5).set_z_index(4)
        F = LAY.F
        base.set_points_as_corners(band_points(R, R, 0.0, C - R * F.V, F, closed=False))
        self.at("unrolled")
        self.play(UnrollBand(base, R, R, C - R * F.V, F.at(PI * R, 0), F, closed=False, rate_func=smooth),
                  outer.animate.set_fill(opacity=0.0), run_time=1.8)
        self.remove(outer)
        blab = lab["blab"]
        self.at("circumference")
        self.play(Write(blab), run_time=0.8)
        self.at("two")
        self.play(Indicate(blab, color=CCOL, scale_factor=1.15), fills.animate.set_fill(opacity=1.0), run_time=0.8)


class Payoff(ShowScene):
    def construct(self):
        self.beat("halfbh")
        C, R = LAY.C, LAY.R
        s = at_layout()
        tri = triangle(R).set_z_index(1)
        lab = side_labels()
        hline, hlab, base, blab = lab["hline"], lab["hlab"], lab["base"], lab["blab"]
        circ = circumference()
        self.add(s["disc"], s["radius"], tri, hline, hlab, circ, base, blab)   # Label's last frame

        e1 = eq(r"A = \tfrac{1}{2} \cdot 2 \pi r \cdot r", font_size=128)
        fit_width(e1, LAY.EQW)
        e1.move_to(LAY.EQ)
        for k in range(len(e1.keys)):                   # the kit keeps declared keys as written; morph's
            e1.keys[k] = e1.keys[k].replace(" ", "")     # key_map compares them without spaces
        fills = VGroup(s["disc"], tri)
        self.at("triangles")                              # "a triangle's area": the triangle, then A
        self.play(Indicate(tri, color=LIT, scale_factor=1.0), FadeIn(e1["A"]), FadeIn(e1["="]), run_time=1.0)
        self.at("half")
        self.play(Write(e1[r"\tfrac{1}{2}"]), FadeIn(e1.part(r"\cdot", 1)), run_time=0.4)
        self.at("base")                                   # picture to symbol: the labels fly into A
        self.play(TransformFromCopy(blab, VGroup(e1["2"], e1[r"\pir"])), fills.animate.set_fill(opacity=0.38),
                  run_time=0.8)
        self.at("height")
        self.play(FadeIn(e1.part(r"\cdot", 2)), TransformFromCopy(hlab, e1["r"]), run_time=0.8)
        self.play(fills.animate.set_fill(opacity=1.0), run_time=0.5)
        # the flown copies and the separately written parts give way to the one equation e1
        # (fills.animate put the disc and triangle into the scene as one group: keep that group)
        keep = [s["radius"], hline, hlab, circ, base, blab, fills]
        self.remove(*[m for m in self.mobjects if m not in keep])
        self.add(e1)

        self.beat("result")
        e2 = eq(r"A = \pi r \cdot r").move_to(e1, aligned_edge=LEFT)
        e2.scale(e1[0].height / e2[0].height, about_edge=LEFT)
        e2.keys = [k.replace(" ", "") for k in e2.keys]
        box = highlight(VGroup(e1[r"\tfrac{1}{2}"], e1.part(r"\cdot", 1), e1["2"]))
        self.at("half")                                   # focus on the algebra: the fills dim
        self.play(Create(box), fills.animate.set_fill(opacity=0.38), run_time=0.5)
        self.at("pi")                                     # 1/2 and 2 leave together, then pi r closes up
        gone = [e1[r"\tfrac{1}{2}"], e1.part(r"\cdot", 1), e1["2"]]
        self.play(FadeOut(box), *[g.animate.set_opacity(0) for g in gone], run_time=0.4)
        self.play(morph(e1, e2), run_time=0.8)
        e3 = eq(r"A = \pi r^2")
        e3.scale(e1[0].height / e3[0].height).move_to(e2, aligned_edge=LEFT)
        e3.keys = [k.replace(" ", "") for k in e3.keys]
        self.at("is")                                     # the triangle's area is pi r^2
        self.play(morph(e2, e3, key_map={r"\pir": r"\pir^2"}), fills.animate.set_fill(opacity=1.0),
                  run_time=1.1)                            # ... and the area comes back with the result
        box2 = highlight(e3, buff=0.2)
        self.at("result.end", lead=0.05)
        self.play(Create(box2), run_time=0.5)            # the chime lands here (audio/mix.json)

        self.beat("ending")
        # on the circumference itself (it covers the pink rim), so the poster shows one ring, not two
        o_c = circumference().set_stroke(T.emph, width=T.stroke["data"] + 3).set_z_index(6)
        # on the triangle's own edges, under the r and 2 pi r lines (an offset outline would overshoot the 9 degree tip)
        o_t = triangle(R).set_fill(opacity=0).set_stroke(T.emph, 4.5).set_z_index(3)
        self.at("same")
        self.play(Create(o_t), Indicate(tri, color=LIT, scale_factor=1.0), run_time=1.2)
        self.at("circle")
        self.play(Create(o_c), Indicate(s["disc"], color=LIT, scale_factor=1.0), run_time=1.0)
        self.at("squared")                                # both shapes and the result, together
        self.play(Indicate(e3, color=AREA, scale_factor=1.08), Indicate(box2, color=T.emph, scale_factor=1.08),
                  Indicate(s["disc"], color=LIT, scale_factor=1.0), Indicate(tri, color=LIT, scale_factor=1.0),
                  run_time=1.0)
        self.hold(0.5)
        self.mark("poster")
