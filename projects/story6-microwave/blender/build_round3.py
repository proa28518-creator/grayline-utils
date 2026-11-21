# projects/story6-microwave/blender/build_round3.py
# Story 6 — ROUND-3 props batch (Track A). Designs: orch/A23_props_round2.md (plaque/gauge
# verbatim; items 3-8 per ROUND3_BRIEF one-line specs + RULINGS_03 R3-2/R3-7/R3-12, the A23
# file on disk being truncated after item 2) + orch/ROUND3_BRIEF.md Track A.
# Same conventions as build_dressing.py: 1 Blender unit = 1 D; Z up in Blender -> Y up in
# the engine (glTF export_yup); engine front (+Z, camera side) = Blender -Y; every prop
# stands on z = 0, centred on x = y = 0 (exception: ceiling_beam, origin at beam underside).
#
# TEXT METHOD — geometry, NOT canvas textures: world/look/glb.js reads "geometry and
# material names only ... no textures", so a baked PNG would be invisible in the film.
# All numerals/diagrams are real geometry (vector-font text converted to mesh, tick/grid
# boxes, chalk tubes) in named materials — the same technique as wall_clock's hands/ticks.
# Writes assets/blender/<prop>.blend + .glb for:
#   plaque_1947, height_gauge, rope_barrier, chalkboard, vacuum_tube_rack,
#   signal_generator, ceiling_beam, charcoal_panel, calendar_1945, horn_mast_ext
# Run: ~/workspace/tools/blender-4.2.23/blender --background --python projects/story6-microwave/blender/build_round3.py
import os, math, bpy, bmesh
from mathutils import Matrix, Euler, Vector

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.normpath(os.path.join(HERE, '..', 'assets', 'blender'))
os.makedirs(OUT, exist_ok=True)
FONT = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'


def clear():
    bpy.ops.wm.read_factory_settings(use_empty=True)


def mat(name, rgb, metal=0.2, rough=0.5, emit=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes.get('Principled BSDF')
    b.inputs['Base Color'].default_value = (*rgb, 1)
    b.inputs['Metallic'].default_value = metal
    b.inputs['Roughness'].default_value = rough
    if emit > 0:
        b.inputs['Emission Color'].default_value = (*rgb, 1)
        b.inputs['Emission Strength'].default_value = emit
    return m


def obj(name, bm, m, smooth=False):
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me); bm.free()
    for p in me.polygons:
        p.use_smooth = smooth
    o = bpy.data.objects.new(name, me)
    o.data.materials.append(m)
    bpy.context.collection.objects.link(o)
    return o


def xf(bm, loc=(0, 0, 0), rot=(0, 0, 0)):
    bmesh.ops.rotate(bm, cent=(0, 0, 0), matrix=Euler(rot, 'XYZ').to_matrix(), verts=bm.verts)
    bmesh.ops.translate(bm, vec=loc, verts=bm.verts)


def box(name, m, size, loc, rot=(0, 0, 0), bevel=0.03):
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    bmesh.ops.scale(bm, vec=size, verts=bm.verts)
    if bevel > 0:
        bmesh.ops.bevel(bm, geom=bm.edges[:], offset=bevel, segments=2, affect='EDGES')
    xf(bm, loc, rot)
    return obj(name, bm, m)


def cyl(name, m, r1, r2, depth, loc, rot=(0, 0, 0), seg=24, smooth=True):
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=seg, radius1=r1, radius2=r2, depth=depth)
    xf(bm, loc, rot)
    return obj(name, bm, m, smooth)


def sphere(name, m, r, loc, scale=(1, 1, 1), seg=24):
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=seg, v_segments=seg // 2, radius=r)
    bmesh.ops.scale(bm, vec=scale, verts=bm.verts)
    xf(bm, loc)
    return obj(name, bm, m, True)


def torus(name, m, R, r, loc, rot=(0, 0, 0), seg=32, rseg=10, arc=2 * math.pi):
    bm = bmesh.new()
    verts = []
    n = seg if arc >= 2 * math.pi - 1e-6 else seg + 1
    for i in range(n):
        a = arc * i / seg
        ring = []
        for j in range(rseg):
            b = 2 * math.pi * j / rseg
            x = (R + r * math.cos(b)) * math.cos(a)
            y = (R + r * math.cos(b)) * math.sin(a)
            z = r * math.sin(b)
            ring.append(bm.verts.new((x, y, z)))
        verts.append(ring)
    closed = n == seg
    for i in range(seg if closed else seg):
        a, b2 = verts[i], verts[(i + 1) % n]
        for j in range(rseg):
            bm.faces.new((a[j], b2[j], b2[(j + 1) % rseg], a[(j + 1) % rseg]))
    xf(bm, loc, rot)
    return obj(name, bm, m, True)


def tube(name, m, pts, r, seg=10):
    """Tube along a polyline of Vector-like points, with end caps."""
    bm = bmesh.new()
    P = [Vector(p) for p in pts]
    n = len(P)
    rings = []
    for i, p in enumerate(P):
        if i == 0:
            t = P[1] - P[0]
        elif i == n - 1:
            t = P[-1] - P[-2]
        else:
            t = P[i + 1] - P[i - 1]
        tv = t.normalized()
        up = Vector((0, 0, 1)) if abs(tv.z) < 0.9 else Vector((0, 1, 0))
        n1 = tv.cross(up).normalized()
        n2 = tv.cross(n1).normalized()
        ring = []
        for j in range(seg):
            a = 2 * math.pi * j / seg
            v = p + r * (math.cos(a) * n1 + math.sin(a) * n2)
            ring.append(bm.verts.new(tuple(v)))
        rings.append(ring)
    for i in range(n - 1):
        for j in range(seg):
            bm.faces.new((rings[i][j], rings[i + 1][j], rings[i + 1][(j + 1) % seg], rings[i][(j + 1) % seg]))
    for ring, p in ((rings[0], P[0]), (rings[-1], P[-1])):
        c = bm.verts.new(tuple(p))
        for j in range(seg):
            bm.faces.new((c, ring[j], ring[(j + 1) % seg]))
    return obj(name, bm, m, True)


def text(name, m, s, cap, cx, face_y, baseline_z):
    """Vector-font text as geometry on a vertical face looking toward -Y.
    cap = exact cap height in world units (measured + rescaled after conversion).
    (cx, baseline_z) = centre-x and baseline height on the face; the glyphs extrude
    from face_y toward -Y by ~0.006. Returns the object (named `name`)."""
    bpy.ops.object.text_add(location=(0, 0, 0))
    o = bpy.context.object
    o.data.body = s
    o.data.font = bpy.data.fonts.load(FONT)
    o.data.size = 1.0
    o.data.extrude = 0.03
    o.data.bevel_depth = 0.0
    o.data.resolution_u = 5
    o.data.align_x = 'CENTER'
    o.data.align_y = 'CENTER'
    bpy.ops.object.convert(target='MESH')
    me = o.data
    xs = [v.co.x for v in me.vertices]
    ys = [v.co.y for v in me.vertices]
    h0 = max(ys) - min(ys)
    if h0 <= 0:
        raise RuntimeError('empty text: ' + s)
    me.transform(Matrix.Scale(cap / h0, 4))
    xs = [v.co.x for v in me.vertices]
    ys = [v.co.y for v in me.vertices]
    cx0 = (max(xs) + min(xs)) / 2.0
    # local: centre x on 0, baseline on y=0, face plane z=0 extruding +Z;
    # rotate +90 deg about X: (x, y, z) -> (x, -z, y) so text faces -Y, up = +Z.
    M = Matrix.Translation((cx, face_y, baseline_z)) @ Euler((math.pi / 2, 0, 0), 'XYZ').to_matrix().to_4x4() @ Matrix.Translation((-cx0, -min(ys), 0))
    me.transform(M)
    me.materials.append(m)
    o.name = name
    return o


def save(name):
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT, name + '.blend'))
    p = os.path.join(OUT, name + '.glb')
    bpy.ops.export_scene.gltf(filepath=p, export_format='GLB', export_yup=True, export_materials='EXPORT', export_apply=True)
    print('EXPORTED', p, os.path.getsize(p))


# ---------------------------------------------------------------------------------------------
# 1. PLAQUE_1947 — matte brass plinth plaque. A23 size 1.3 x 0.4 x 0.06 with R3-7 caps
#    ("1947" >= 0.28, the "1" of "No. 1" >= 0.20) is physically impossible stacked in 0.4
#    (0.28 + gap + 0.20 = 0.51 min) -> height grown to 0.55, still centred on the plinth
#    face at y=0.4 (spans 0.125..0.675 of the 0..0.8 face). RULINGS numbers govern (brief).
#    Engraved look: dark ink glyphs standing 0.006 proud on the brass face + rim frame.
# ---------------------------------------------------------------------------------------------
def plaque_1947():
    clear()
    brass = mat('PlaqueBrass', (0.62, 0.44, 0.16), 0.85, 0.32)
    brass_d = mat('PlaqueBrassDark', (0.45, 0.31, 0.10), 0.85, 0.38)
    ink = mat('PlaqueInk', (0.10, 0.07, 0.02), 0.2, 0.6)
    box('Plate', brass, (1.30, 0.06, 0.55), (0, 0, 0.275), bevel=0.012)
    # rim frame standing proud of the face (face plane y = -0.030)
    box('RimT', brass_d, (1.22, 0.014, 0.035), (0, -0.033, 0.5125), bevel=0.004)
    box('RimB', brass_d, (1.22, 0.014, 0.035), (0, -0.033, 0.0375), bevel=0.004)
    box('RimL', brass_d, (0.035, 0.014, 0.44), (-0.6125, -0.033, 0.275), bevel=0.004)
    box('RimR', brass_d, (0.035, 0.014, 0.44), (0.6125, -0.033, 0.275), bevel=0.004)
    # two screw heads, upper corners
    for sx in (-1, 1):
        cyl('Screw' + ('L' if sx < 0 else 'R'), brass_d, 0.028, 0.028, 0.014, (sx * 0.55, -0.034, 0.475), rot=(math.pi / 2, 0, 0), seg=16)
        box('ScrewSlot' + ('L' if sx < 0 else 'R'), ink, (0.036, 0.004, 0.007), (sx * 0.55, -0.0405, 0.475), bevel=0.0)
    # engraved lines: "1947" cap 0.28 (baseline 0.205), "No. 1" below (baseline 0.045;
    # "No." cap 0.13, the "1" cap 0.20 per R3-7)
    text('Text1947', ink, '1947', 0.28, 0.0, -0.030, 0.205)
    text('TextNo', ink, 'No.', 0.13, -0.110, -0.030, 0.045)
    text('Text1', ink, '1', 0.20, 0.169, -0.030, 0.045)
    save('plaque_1947')


# ---------------------------------------------------------------------------------------------
# 2. HEIGHT_GAUGE — 0.9 x 3.4 cream panel on the plinth deck (datum = panel base).
#    Ticks every 0.25 (short) / 0.5 (long) + labels at 0.5 steps (cap 0.15, R3-12);
#    bold red line at 2.9 with arrow + red "2.9" (A23 proof line).
# ---------------------------------------------------------------------------------------------
def height_gauge():
    clear()
    cream = mat('GaugeCream', (0.91, 0.88, 0.80), 0.0, 0.7)
    wood = mat('GaugeWood', (0.30, 0.19, 0.10), 0.0, 0.7)
    ink = mat('GaugeInk', (0.05, 0.05, 0.05), 0.0, 0.6)
    red = mat('GaugeRed', (0.72, 0.07, 0.07), 0.0, 0.55)
    box('Panel', cream, (0.90, 0.08, 3.40), (0, 0, 1.70), bevel=0.01)
    # dark wood frame, proud of the face (face plane y = -0.040)
    box('FrameL', wood, (0.06, 0.10, 3.40), (-0.45, 0, 1.70), bevel=0.008)
    box('FrameR', wood, (0.06, 0.10, 3.40), (0.45, 0, 1.70), bevel=0.008)
    box('FrameT', wood, (0.96, 0.10, 0.06), (0, 0, 3.42), bevel=0.008)
    box('Foot', wood, (1.00, 0.16, 0.06), (0, 0, 0.03), bevel=0.008)
    # ticks from the left edge; labels at the 0.5 steps
    for k in range(1, 14):
        h = 0.25 * k
        long = (k % 2 == 0)
        ln = 0.30 if long else 0.16
        box(f'Tick{k}', ink, (ln, 0.014, 0.022), (-0.43 + ln / 2, -0.045, h), bevel=0.0)
        if long:
            lab = f'{h:.1f}'
            text(f'Label{lab}', ink, lab, 0.15, 0.13, -0.040, h - 0.075)
    # proof line at 2.9: bold red band + arrowhead pointing at it from the right + label
    box('RedLine', red, (0.72, 0.014, 0.045), (-0.07, -0.046, 2.90), bevel=0.0)
    cyl('RedArrow', red, 0.050, 0.001, 0.14, (0.375, -0.046, 2.90), rot=(0, -math.pi / 2, 0), seg=12)
    text('Label29', red, '2.9', 0.15, -0.24, -0.040, 2.90 + 0.10)
    save('height_gauge')


# ---------------------------------------------------------------------------------------------
# 3. ROPE_BARRIER — 4 brass posts in a row (x = -1.8, -0.6, 0.6, 1.8) + sagging red velvet
#    rope (sag 0.24, bottom of sag z = 0.62, below the S18 door-sill line per R3-12).
#    Brass carries bevels + balls for glints (R3-11).
# ---------------------------------------------------------------------------------------------
def rope_barrier():
    clear()
    brass = mat('RopeBrass', (0.62, 0.44, 0.16), 0.95, 0.24)
    velvet = mat('RopeVelvet', (0.42, 0.04, 0.08), 0.0, 0.95)
    posts = (-1.8, -0.6, 0.6, 1.8)
    for i, x in enumerate(posts):
        cyl(f'Base{i}', brass, 0.16, 0.17, 0.03, (x, 0, 0.015), seg=20)
        cyl(f'Pole{i}', brass, 0.028, 0.032, 0.90, (x, 0, 0.48), seg=16)
        torus(f'Collar{i}', brass, 0.040, 0.012, (x, 0, 0.80), seg=12, rseg=6)
        sphere(f'Ball{i}', brass, 0.050, (x, 0, 0.965), seg=12)
        torus(f'Eye{i}', brass, 0.034, 0.010, (x, 0, 0.86), rot=(0, math.pi / 2, 0), seg=12, rseg=6)
    for i in range(3):
        x0, x1 = posts[i], posts[i + 1]
        pts = []
        for k in range(13):
            t = k / 12
            pts.append((x0 + (x1 - x0) * t, 0, 0.86 - 0.24 * 4 * t * (1 - t)))
        tube(f'Rope{i}', velvet, pts, 0.034, seg=8)
        sphere(f'Cap{i}L', brass, 0.042, (x0, 0, 0.86), seg=10)
        sphere(f'Cap{i}R', brass, 0.042, (x1, 0, 0.86), seg=10)
    save('rope_barrier')


# ---------------------------------------------------------------------------------------------
# 4. CHALKBOARD — 2.4 x 1.5 BLACK slate (R3-12: black, never green) on an A-frame easel.
#    Chalk work as geometry: sine wave, bounce-in-box ray diagram, molecule sketch.
# ---------------------------------------------------------------------------------------------
def chalkboard():
    clear()
    slate = mat('SlateBlack', (0.06, 0.06, 0.07), 0.0, 0.9)
    chalk = mat('ChalkWhite', (0.88, 0.89, 0.86), 0.0, 0.9)
    wood = mat('BoardWood', (0.35, 0.22, 0.12), 0.0, 0.7)
    # slate + wood frame (slate face plane y = -0.025, centre z = 1.22)
    box('Slate', slate, (2.40, 0.05, 1.50), (0, 0, 1.22), bevel=0.01)
    box('FrameT', wood, (2.48, 0.07, 0.07), (0, 0, 2.005), bevel=0.01)
    box('FrameB', wood, (2.48, 0.07, 0.07), (0, 0, 0.435), bevel=0.01)
    box('FrameL', wood, (0.07, 0.07, 1.50), (-1.205, 0, 1.22), bevel=0.01)
    box('FrameR', wood, (0.07, 0.07, 1.50), (1.205, 0, 1.22), bevel=0.01)
    fy = -0.033  # chalk sits just proud of the slate face
    # sine wave (upper left): axis + 1.5-period curve
    box('WaveAxis', chalk, (0.95, 0.006, 0.012), (-0.62, fy, 1.62), bevel=0.0)
    pts = []
    for k in range(25):
        t = k / 24
        pts.append((-1.08 + 0.92 * t, fy, 1.62 + 0.13 * math.sin(t * 3 * math.pi)))
    tube('WaveCurve', chalk, pts, 0.009, seg=8)
    # bounce-in-box diagram (upper right): box outline + zigzag ray + exit arrow
    bx, bz, bw, bh = 0.62, 1.62, 0.78, 0.52
    box('BoxT', chalk, (bw, 0.006, 0.014), (bx, fy, bz + bh / 2), bevel=0.0)
    box('BoxB', chalk, (bw, 0.006, 0.014), (bx, fy, bz - bh / 2), bevel=0.0)
    box('BoxL', chalk, (0.014, 0.006, bh), (bx - bw / 2, fy, bz), bevel=0.0)
    box('BoxR', chalk, (0.014, 0.006, bh), (bx + bw / 2, fy, bz), bevel=0.0)
    ray = [(bx - 0.34, fy, bz + 0.22), (bx - 0.10, fy, bz - 0.24), (bx + 0.14, fy, bz + 0.24),
           (bx + 0.34, fy, bz - 0.10), (bx + 0.52, fy, bz + 0.06)]
    tube('BoxRay', chalk, ray, 0.009, seg=8)
    cyl('RayArrow', chalk, 0.001, 0.028, 0.09, (bx + 0.56, fy, bz + 0.085), rot=(math.radians(90), 0, math.radians(-65)), seg=10)
    # molecule sketch (lower left): three atoms + double bonds + two satellites
    for nm, x, z, r in (('AtomA', -0.78, 0.86, 0.052), ('AtomB', -0.58, 0.94, 0.040), ('AtomC', -0.90, 0.70, 0.036)):
        torus(nm, chalk, r, 0.010, (x, fy, z), rot=(math.pi / 2, 0, 0), seg=16, rseg=6)
    tube('BondAB', chalk, [(-0.735, fy, 0.885), (-0.625, fy, 0.925)], 0.007, seg=8)
    tube('BondAC', chalk, [(-0.815, fy, 0.815), (-0.875, fy, 0.745)], 0.007, seg=8)
    sphere('AtomD', chalk, 0.020, (-0.50, fy, 0.80), seg=10)
    sphere('AtomE', chalk, 0.016, (-0.99, fy, 0.95), seg=10)
    # chalk squiggle lines (lower right, "handwriting")
    for i, z in enumerate((0.92, 0.80, 0.68)):
        pts = []
        for k in range(13):
            t = k / 12
            pts.append((0.18 + 0.62 * t, fy, z + 0.012 * math.sin(t * 9 + i * 2)))
        tube(f'Squiggle{i}', chalk, pts, 0.007, seg=8)
    # A-frame easel: front legs, splayed back legs, cross brace, chalk tray + chalks
    for sx in (-1, 1):
        box(f'LegF{sx}', wood, (0.07, 0.05, 2.10), (sx * 0.98, -0.07, 1.055), rot=(math.radians(-4), 0, sx * math.radians(-3)), bevel=0.01)
        box(f'LegB{sx}', wood, (0.07, 0.05, 2.00), (sx * 0.98, 0.34, 0.94), rot=(math.radians(22), 0, sx * math.radians(-3)), bevel=0.01)
    box('HingeBar', wood, (2.10, 0.06, 0.06), (0, 0.02, 2.03), bevel=0.01)
    box('Brace', wood, (1.90, 0.04, 0.05), (0, 0.52, 0.55), bevel=0.008)
    box('Tray', wood, (1.70, 0.10, 0.03), (0, -0.075, 0.42), bevel=0.008)
    cyl('Chalk1', chalk, 0.011, 0.011, 0.09, (-0.4, -0.085, 0.445), rot=(0, math.pi / 2, 0), seg=8)
    cyl('Chalk2', chalk, 0.011, 0.011, 0.06, (0.15, -0.085, 0.445), rot=(0, math.pi / 2, 0), seg=8)
    box('Eraser', wood, (0.13, 0.05, 0.035), (0.55, -0.075, 0.45), bevel=0.006)
    save('chalkboard')


# ---------------------------------------------------------------------------------------------
# 5. VACUUM_TUBE_RACK — 5 glass tubes, amber emissive filaments, dark bakelite base.
# ---------------------------------------------------------------------------------------------
def vacuum_tube_rack():
    clear()
    base = mat('RackBase', (0.09, 0.085, 0.08), 0.3, 0.5)
    dark = mat('SocketDark', (0.05, 0.05, 0.05), 0.2, 0.6)
    glass = mat('TubeGlass', (0.78, 0.86, 0.84), 0.05, 0.12)
    plate = mat('TubePlate', (0.45, 0.46, 0.48), 0.7, 0.4)
    glow = mat('FilamentGlow', (1.00, 0.60, 0.16), 0.0, 0.4, emit=3.0)
    box('Base', base, (1.15, 0.38, 0.10), (0, 0, 0.05), bevel=0.015)
    for k in range(4):
        box(f'Vent{k}', dark, (0.10, 0.012, 0.03), (-0.36 + k * 0.24, -0.192, 0.05), bevel=0.0)
    for sx in (-1, 1):
        for sy in (-1, 1):
            cyl(f'Foot{sx}{sy}', dark, 0.030, 0.034, 0.025, (sx * 0.50, sy * 0.13, 0.012), seg=10)
    for i, x in enumerate((-0.44, -0.22, 0.0, 0.22, 0.44)):
        cyl(f'Socket{i}', dark, 0.070, 0.075, 0.05, (x, 0, 0.125), seg=20)
        cyl(f'Glass{i}', glass, 0.055, 0.058, 0.26, (x, 0, 0.28), seg=20)
        sphere(f'Dome{i}', glass, 0.055, (x, 0, 0.41), scale=(1, 1, 0.7), seg=16)
        box(f'Plate{i}', plate, (0.050, 0.018, 0.16), (x, 0, 0.27), bevel=0.004)
        cyl(f'Filament{i}', glow, 0.016, 0.016, 0.10, (x, 0, 0.25), seg=10)
        for wx in (-1, 1):
            cyl(f'Wire{i}{wx}', plate, 0.004, 0.004, 0.15, (x + wx * 0.026, 0, 0.245), seg=6)
    save('vacuum_tube_rack')


# ---------------------------------------------------------------------------------------------
# 6. SIGNAL_GENERATOR — olive-grey bench box: 3 dials, needle meter, BNC socket, toggles.
# ---------------------------------------------------------------------------------------------
def signal_generator():
    clear()
    body = mat('GenBody', (0.32, 0.34, 0.27), 0.35, 0.55)
    panel = mat('GenPanel', (0.55, 0.56, 0.50), 0.5, 0.4)
    dark = mat('GenDial', (0.08, 0.08, 0.08), 0.2, 0.55)
    cream = mat('GenCream', (0.93, 0.88, 0.72), 0.0, 0.5)
    needle = mat('GenNeedle', (0.60, 0.08, 0.06), 0.0, 0.5)
    brass = mat('GenBrass', (0.62, 0.44, 0.16), 0.8, 0.3)
    lamp = mat('GenLamp', (0.90, 0.20, 0.10), 0.0, 0.4, emit=1.5)
    box('Body', body, (0.85, 0.55, 0.50), (0, 0, 0.28), bevel=0.03)
    box('Panel', panel, (0.79, 0.03, 0.44), (0, -0.278, 0.28), bevel=0.008)
    for sx in (-1, 1):
        for sy in (-1, 1):
            cyl(f'Foot{sx}{sy}', dark, 0.035, 0.04, 0.03, (sx * 0.34, sy * 0.20, 0.015), seg=10)
    fy = -0.293  # control plane, proud of the panel face (-0.293 face at -0.278-0.015)
    # needle meter (upper left of panel): cream face + rim + needle + hub
    box('MeterFace', cream, (0.30, 0.012, 0.19), (-0.19, fy + 0.004, 0.395), bevel=0.004)
    box('MeterRimT', dark, (0.32, 0.014, 0.02), (-0.19, fy + 0.002, 0.50), bevel=0.0)
    box('MeterRimB', dark, (0.32, 0.014, 0.02), (-0.19, fy + 0.002, 0.29), bevel=0.0)
    box('MeterNeedle', needle, (0.012, 0.006, 0.15), (-0.150, fy - 0.004, 0.379), rot=(0, math.radians(32), 0), bevel=0.0)
    sphere('MeterHub', dark, 0.016, (-0.19, fy - 0.006, 0.315), seg=10)
    # pilot lamp + BNC socket (upper right)
    cyl('Lamp', lamp, 0.018, 0.018, 0.02, (0.10, fy, 0.42), rot=(math.pi / 2, 0, 0), seg=12)
    cyl('BNC', brass, 0.035, 0.035, 0.05, (0.27, fy - 0.008, 0.395), rot=(math.pi / 2, 0, 0), seg=14)
    cyl('BNCHole', dark, 0.016, 0.016, 0.052, (0.27, fy - 0.009, 0.395), rot=(math.pi / 2, 0, 0), seg=10)
    # 3 dials in a row + pointer marks
    for k, x in enumerate((-0.26, 0.0, 0.26)):
        cyl(f'Dial{k}', dark, 0.068, 0.068, 0.045, (x, fy - 0.006, 0.155), rot=(math.pi / 2, 0, 0), seg=24)
        box(f'DialMark{k}', cream, (0.012, 0.02, 0.038), (x + 0.02, fy - 0.032, 0.185), rot=(0, 0.5, 0), bevel=0.0)
        for a in (-0.9, 0.0, 0.9):
            box(f'Tick{k}_{int(a*10)}', dark, (0.008, 0.006, 0.022),
                (x + 0.095 * math.sin(a), fy + 0.002, 0.155 + 0.095 * math.cos(a)), bevel=0.0)
    # 2 toggle switches
    for k, x in enumerate((-0.10, 0.10)):
        box(f'Switch{k}', brass, (0.040, 0.045, 0.085), (x, fy - 0.004, 0.155), rot=(0.35, 0, 0), bevel=0.006)
    save('signal_generator')


# ---------------------------------------------------------------------------------------------
# 7. CEILING_BEAM — dark steel I-beam + 3 drop rods. ORIGIN AT THE BEAM'S UNDERSIDE
#    CENTRE: beam occupies z 0..0.30, rods hang to z = -1.30 (they terminate the floating
#    lamp cables, A23 P3). Mount with the origin at the desired underside height (~9.7).
# ---------------------------------------------------------------------------------------------
def ceiling_beam():
    clear()
    steel = mat('BeamSteel', (0.13, 0.13, 0.145), 0.65, 0.5)
    rod = mat('RodSteel', (0.20, 0.20, 0.21), 0.7, 0.45)
    box('FlangeB', steel, (6.40, 0.34, 0.045), (0, 0, 0.0225), bevel=0.006)
    box('Web', steel, (6.40, 0.05, 0.21), (0, 0, 0.15), bevel=0.0)
    box('FlangeT', steel, (6.40, 0.34, 0.045), (0, 0, 0.2775), bevel=0.006)
    for i, x in enumerate((-2.4, 0.0, 2.4)):
        box(f'RodPlate{i}', steel, (0.16, 0.16, 0.02), (x, 0, -0.01), bevel=0.004)
        cyl(f'Rod{i}', rod, 0.020, 0.020, 1.28, (x, 0, -0.66), seg=12)
        torus(f'Eye{i}', rod, 0.050, 0.014, (x, 0, -1.33), seg=16, rseg=8)
    save('ceiling_beam')


# ---------------------------------------------------------------------------------------------
# 8. CHARCOAL_PANEL — matte charcoal backdrop panel, 2.6 x 2.2, surface value 0.10
#    (inside the R3-3 band 0.08-0.12), NO emissive. Serves S09 + S10-S12 backgrounds.
# ---------------------------------------------------------------------------------------------
def charcoal_panel():
    clear()
    panel = mat('CharcoalMat', (0.10, 0.10, 0.105), 0.0, 0.95)
    foot = mat('CharcoalFoot', (0.07, 0.07, 0.075), 0.0, 0.9)
    box('Panel', panel, (2.60, 0.06, 2.20), (0, 0, 1.10), bevel=0.01)
    for sx in (-1, 1):
        box(f'Foot{sx}', foot, (0.34, 0.34, 0.05), (sx * 0.90, 0, 0.025), bevel=0.008)
    save('charcoal_panel')


# ---------------------------------------------------------------------------------------------
# 9. CALENDAR_1945 — wall calendar with TWO page meshes on one GLB (R3-7 time bridge):
#    Page1945 in front, Page1947 directly behind it; Track B hides Page1945 (+ its
#    Year1945/Grid1945 children-named meshes) to flip to 1947. Year cap 0.23, red header
#    band, day grid as geometry, one red-circled date per page.
# ---------------------------------------------------------------------------------------------
def _calendar_page(tag, year, page_y, circle_col, circle_row, M):
    page, red, white, grid = M['page'], M['red'], M['white'], M['grid']
    box(f'Page{tag}', page, (0.86, 0.004, 1.04), (0, page_y, 0.55), bevel=0.0)
    fy = page_y - 0.002  # front surface of this page
    box(f'Band{tag}', red, (0.86, 0.004, 0.24), (0, fy - 0.001, 0.95), bevel=0.0)
    text(f'Year{tag}', white, year, 0.23, 0.0, fy - 0.002, 0.835)
    # day grid: 7 cols x 6 rows over z 0.10..0.78, x -0.40..0.40
    for c in range(8):
        box(f'GridV{tag}{c}', grid, (0.003, 0.003, 0.68), (-0.40 + c * (0.80 / 7), fy - 0.001, 0.44), bevel=0.0)
    for r in range(7):
        box(f'GridH{tag}{r}', grid, (0.80, 0.003, 0.003), (0, fy - 0.001, 0.10 + r * (0.68 / 6)), bevel=0.0)
    cx = -0.40 + (circle_col + 0.5) * (0.80 / 7)
    cz = 0.10 + (5 - circle_row + 0.5) * (0.68 / 6)
    torus(f'Circle{tag}', red, 0.052, 0.008, (cx, fy - 0.002, cz), rot=(math.pi / 2, 0, 0), seg=20, rseg=6)


def calendar_1945():
    clear()
    back = mat('CalBack', (0.42, 0.10, 0.10), 0.0, 0.7)
    bind = mat('CalBind', (0.15, 0.15, 0.16), 0.6, 0.45)
    box('Backing', back, (0.94, 0.04, 1.16), (0, 0, 0.58), bevel=0.01)
    cyl('BindRoll', bind, 0.035, 0.035, 0.94, (0, 0, 1.13), rot=(0, math.pi / 2, 0), seg=14)
    for i, x in enumerate((-0.30, 0.0, 0.30)):
        torus(f'Ring{i}', bind, 0.045, 0.009, (x, 0, 1.10), seg=12, rseg=6)
    M = {'page': mat('CalPage', (0.93, 0.92, 0.87), 0.0, 0.85),
         'red': mat('CalRed', (0.62, 0.10, 0.10), 0.0, 0.6),
         'white': mat('CalYearWhite', (0.95, 0.94, 0.90), 0.0, 0.6),
         'grid': mat('CalGrid', (0.45, 0.45, 0.46), 0.0, 0.8)}
    # 1947 page BEHIND, 1945 page IN FRONT. Stack spacing is set so the back page's
    # proud decorations (year text front = page_y - 0.0135, circle front = page_y - 0.012)
    # stay BEHIND the front page's back face (page_y - 0.002): 1947 decors reach -0.0375,
    # the 1945 page occupies -0.046..-0.042 -> 0.0045 clearance, nothing ghosts through.
    _calendar_page('1947', '1947', -0.024, 1, 0, M)
    _calendar_page('1945', '1945', -0.044, 3, 2, M)
    save('calendar_1945')


# ---------------------------------------------------------------------------------------------
# 10. HORN_MAST_EXT — standalone mast + horn silhouette piece for the S05 background
#     (R3-2 set-dressing route). The radar_device GLB does NOT need modification: this
#     prop stands on the device table at the cabinet's far-left bay (world x ~ -6.9,
#     base y = 1.3) and its horn tip lands at local z = 2.09 -> world y ~ 3.39 ~ 3.4.
#     Dark steel (silhouette value ~0.25 per R3-2), brass clamp straps, restrained
#     amber glow tip in the device's own NozzleGlow family.
# ---------------------------------------------------------------------------------------------
def horn_mast_ext():
    clear()
    steel = mat('MastSteel', (0.16, 0.18, 0.20), 0.6, 0.45)
    dark = mat('MastDark', (0.08, 0.09, 0.10), 0.5, 0.55)
    brass = mat('MastBrass', (0.62, 0.44, 0.16), 0.8, 0.3)
    glow = mat('HornGlow', (1.00, 0.62, 0.20), 0.0, 0.3, emit=3.0)
    box('BasePlate', dark, (0.34, 0.30, 0.04), (0, 0, 0.02), bevel=0.008)
    for sx in (-1, 1):
        for sy in (-1, 1):
            cyl(f'Bolt{sx}{sy}', brass, 0.018, 0.018, 0.022, (sx * 0.12, sy * 0.10, 0.045), seg=10)
    cyl('Pole', steel, 0.045, 0.050, 1.70, (0, 0, 0.89), seg=16)
    torus('StrapLow', brass, 0.052, 0.012, (0, 0, 0.32), seg=16, rseg=8)
    torus('StrapHigh', brass, 0.052, 0.012, (0, 0, 1.50), seg=16, rseg=8)
    cyl('CableRun', dark, 0.013, 0.013, 1.10, (0, 0.058, 1.15), seg=8)
    cyl('Collar', brass, 0.065, 0.065, 0.08, (0, 0, 1.76), seg=16)
    # horn flare tilted 55 deg toward engine front (Blender -Y); mouth centre ~(0,-0.213,1.916)
    flare_rot = (math.radians(55), 0, 0)
    cyl('HornFlare', steel, 0.075, 0.210, 0.30, (0, -0.09, 1.83), rot=flare_rot, seg=24)
    cyl('HornThroat', dark, 0.078, 0.078, 0.05, (0, -0.028, 1.755), rot=flare_rot, seg=16)
    cyl('HornTip', glow, 0.170, 0.170, 0.015, (0, -0.206, 1.909), rot=flare_rot, seg=24)
    save('horn_mast_ext')


for fn in (plaque_1947, height_gauge, rope_barrier, chalkboard, vacuum_tube_rack,
           signal_generator, ceiling_beam, charcoal_panel, calendar_1945, horn_mast_ext):
    fn()
print('ROUND-3 PROPS DONE')
