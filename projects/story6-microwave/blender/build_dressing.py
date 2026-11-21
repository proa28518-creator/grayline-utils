# projects/story6-microwave/blender/build_dressing.py
# Story 6 «الشوكولاتة اللي ساحت» — lab-dressing props modelled in Blender so the 1945 radar
# lab feels rich and professional (Ricks Clips density). Same conventions as build_props.py:
# 1 Blender unit = 1 D (one head). Z up in Blender -> Y up in the engine (glTF export_yup).
# Engine front (+Z, camera side) = Blender -Y. Every prop stands on z = 0, centred on x = y = 0.
# Writes assets/blender/<prop>.blend + assets/blender/<prop>.glb for:
#   osc_scope, desk_lamp, tool_rack, papers, mug, cable_spool,
#   shelf_jars, wall_clock, popcorn_bowl, egg, stool
# Run: ~/workspace/tools/blender-4.2.23/blender --background --python projects/story6-microwave/blender/build_dressing.py
import os, math, bpy, bmesh
from mathutils import Matrix, Euler

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.normpath(os.path.join(HERE, '..', 'assets', 'blender'))
os.makedirs(OUT, exist_ok=True)


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


def ico(name, m, r, loc, scale=(1, 1, 1), rot=(0, 0, 0)):
    bm = bmesh.new()
    bmesh.ops.create_icosphere(bm, subdivisions=1, radius=r)
    bmesh.ops.scale(bm, vec=scale, verts=bm.verts)
    xf(bm, loc, rot)
    return obj(name, bm, m, True)


def save(name):
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT, name + '.blend'))
    p = os.path.join(OUT, name + '.glb')
    bpy.ops.export_scene.gltf(filepath=p, export_format='GLB', export_yup=True, export_materials='EXPORT', export_apply=True)
    print('EXPORTED', p, os.path.getsize(p))


# ---------------------------------------------------------------------------------------------
# 1. OSCILLOSCOPE / TEST BOX — 0.9 wide, 1.1 tall, 0.8 deep. Glowing green round screen on the
#    front (-Y), 3 knobs, 2 toggle switches.
# ---------------------------------------------------------------------------------------------
def osc_scope():
    clear()
    body = mat('ScopeBody', (0.16, 0.18, 0.20), 0.6, 0.5)
    bezel = mat('ScopeBezel', (0.45, 0.48, 0.50), 0.85, 0.3)
    glow = mat('ScopeGlow', (0.20, 1.00, 0.45), 0.0, 0.3, emit=3.5)
    grid = mat('ScopeGrid', (0.04, 0.28, 0.11), 0.0, 0.6)
    knob = mat('ScopeKnob', (0.09, 0.08, 0.08), 0.2, 0.55)
    brass = mat('ScopeBrass', (0.62, 0.44, 0.16), 0.8, 0.3)
    box('Body', body, (0.9, 0.8, 1.02), (0, 0, 0.55), bevel=0.05)
    box('TopPanel', bezel, (0.94, 0.84, 0.05), (0, 0, 1.085), bevel=0.02)
    for sx in (-1, 1):
        for sy in (-1, 1):
            cyl(f'Foot{sx}{sy}', knob, 0.04, 0.045, 0.05, (sx * 0.36, sy * 0.30, 0.025), seg=12)
    # round screen: bezel ring + emissive disc + dark grid cross
    torus('ScreenBezel', bezel, 0.28, 0.032, (-0.14, -0.415, 0.68), rot=(math.pi / 2, 0, 0), seg=36, rseg=10)
    cyl('Screen', glow, 0.26, 0.26, 0.03, (-0.14, -0.405, 0.68), rot=(math.pi / 2, 0, 0), seg=36)
    box('GridH', grid, (0.42, 0.006, 0.014), (-0.14, -0.424, 0.68), bevel=0.0)
    box('GridV', grid, (0.014, 0.006, 0.42), (-0.14, -0.424, 0.68), bevel=0.0)
    # 3 knobs in a column on the right of the front face
    for k, z in enumerate((0.88, 0.66, 0.44)):
        cyl(f'Knob{k}', knob, 0.055, 0.055, 0.05, (0.29, -0.42, z), rot=(math.pi / 2, 0, 0), seg=20)
        box(f'KnobMark{k}', brass, (0.012, 0.02, 0.04), (0.29, -0.45, z + 0.028), bevel=0.0)
    # 2 toggle switches + BNC socket along the bottom of the front face
    for k, x in enumerate((0.10, 0.26)):
        box(f'Switch{k}', brass, (0.045, 0.05, 0.09), (x, -0.425, 0.26), rot=(0.35, 0, 0), bevel=0.008)
    cyl('BNC', bezel, 0.035, 0.035, 0.05, (-0.30, -0.42, 0.24), rot=(math.pi / 2, 0, 0), seg=14)
    # side vent slots
    for k in range(4):
        box(f'Vent{k}', knob, (0.02, 0.4, 0.05), (0.455, 0, 0.55 + k * 0.13), bevel=0.0)
    save('osc_scope')


# ---------------------------------------------------------------------------------------------
# 2. DESK LAMP — heavy base, two articulated arms, cone shade, warm glowing bulb.
#    Leans toward -Y (engine front). Head joint at (0, -0.34, 0.62).
# ---------------------------------------------------------------------------------------------
def desk_lamp():
    clear()
    steel = mat('LampSteel', (0.18, 0.20, 0.22), 0.7, 0.4)
    dark = mat('LampDark', (0.07, 0.07, 0.08), 0.4, 0.55)
    glow = mat('LampGlow', (1.00, 0.80, 0.50), 0.0, 0.3, emit=4.0)
    cyl('Base', steel, 0.17, 0.13, 0.05, (0, 0, 0.025), seg=28)
    sphere('BaseDome', steel, 0.10, (0, 0, 0.05), scale=(1, 1, 0.5), seg=20)
    sphere('BaseJoint', dark, 0.045, (0, 0, 0.10), seg=14)
    # lower arm: (0,0,0.08) -> elbow (0,-0.10,0.48); upper arm: elbow -> head (0,-0.34,0.62)
    cyl('ArmLow', steel, 0.024, 0.024, 0.42, (0, -0.05, 0.28), rot=(math.radians(14), 0, 0), seg=12)
    sphere('Elbow', dark, 0.048, (0, -0.10, 0.48), seg=14)
    cyl('ArmUp', steel, 0.022, 0.022, 0.29, (0, -0.22, 0.55), rot=(math.radians(60), 0, 0), seg=12)
    sphere('HeadJoint', dark, 0.045, (0, -0.34, 0.62), seg=14)
    # cone shade: axis along (0,-0.707,-0.707), wide glowing opening at the far end
    shade_rot = (math.radians(135), 0, 0)
    cyl('Shade', steel, 0.05, 0.16, 0.18, (0, -0.407, 0.553), rot=shade_rot, seg=28)
    cyl('Bulb', glow, 0.085, 0.085, 0.02, (0, -0.471, 0.489), rot=shade_rot, seg=24)
    # power cable drooping off the back of the base
    torus('Cable', dark, 0.16, 0.016, (0, 0.20, 0.03), rot=(0, 0, math.radians(90)), seg=24, rseg=8, arc=math.pi)
    save('desk_lamp')


# ---------------------------------------------------------------------------------------------
# 3. TOOL RACK — wall board 1.6 x 1.0 with hanging wrench, screwdriver, pliers, hammer.
#    Board front face at y = -0.025; tools hang at y ~ -0.05.
# ---------------------------------------------------------------------------------------------
def tool_rack():
    clear()
    board = mat('RackBoard', (0.35, 0.22, 0.12), 0.0, 0.8)
    steel = mat('ToolSteel', (0.55, 0.58, 0.62), 0.85, 0.35)
    grip = mat('ToolGrip', (0.55, 0.15, 0.10), 0.1, 0.6)
    dark = mat('ToolDark', (0.10, 0.10, 0.11), 0.4, 0.55)
    box('Board', board, (1.6, 0.05, 1.0), (0, 0, 0.5), bevel=0.015)
    box('BoardTrim', dark, (1.64, 0.03, 0.06), (0, 0.005, 0.97), bevel=0.01)
    for k, x in enumerate((-0.52, -0.12, 0.28, 0.62)):
        cyl(f'Peg{k}', steel, 0.015, 0.015, 0.09, (x, -0.06, 0.90), rot=(math.pi / 2, 0, 0), seg=10)
    # wrench: flat handle + open ring head
    box('WrenchHandle', steel, (0.07, 0.025, 0.36), (-0.52, -0.05, 0.50), bevel=0.01)
    torus('WrenchHead', steel, 0.065, 0.022, (-0.52, -0.05, 0.74), rot=(math.pi / 2, 0, 0), seg=20, rseg=8, arc=4.4)
    # screwdriver: red grip + shaft
    cyl('DriverGrip', grip, 0.034, 0.030, 0.14, (-0.12, -0.05, 0.70), seg=14)
    cyl('DriverShaft', steel, 0.011, 0.011, 0.20, (-0.12, -0.05, 0.53), seg=10)
    box('DriverTip', steel, (0.026, 0.008, 0.04), (-0.12, -0.05, 0.415), bevel=0.0)
    # pliers: two crossed legs + jaws
    box('PlierLegA', steel, (0.035, 0.025, 0.30), (0.265, -0.05, 0.52), rot=(0, 0, 0.10), bevel=0.008)
    box('PlierLegB', steel, (0.035, 0.025, 0.30), (0.295, -0.055, 0.52), rot=(0, 0, -0.10), bevel=0.008)
    box('PlierJawA', steel, (0.028, 0.02, 0.12), (0.262, -0.05, 0.71), rot=(0, 0, -0.07), bevel=0.005)
    box('PlierJawB', steel, (0.028, 0.02, 0.12), (0.298, -0.055, 0.71), rot=(0, 0, 0.07), bevel=0.005)
    cyl('PlierPin', dark, 0.02, 0.02, 0.03, (0.28, -0.055, 0.63), rot=(math.pi / 2, 0, 0), seg=12)
    # hammer: handle + head
    box('HammerHandle', board, (0.05, 0.028, 0.36), (0.62, -0.05, 0.50), bevel=0.01)
    box('HammerHead', dark, (0.22, 0.055, 0.075), (0.62, -0.05, 0.70), bevel=0.012)
    save('tool_rack')


# ---------------------------------------------------------------------------------------------
# 4. PAPERS — stack of sheets with the top one askew, one loose flat sheet, one leaning sheet.
# ---------------------------------------------------------------------------------------------
def papers():
    clear()
    paper = mat('PaperWhite', (0.93, 0.91, 0.85), 0.0, 0.9)
    cream = mat('PaperCream', (0.90, 0.84, 0.70), 0.0, 0.9)
    for i in range(6):
        m = cream if i == 2 else paper
        rot = (0, 0, (i - 2.5) * 0.02)
        box(f'Sheet{i}', m, (0.52, 0.72, 0.008), ((i % 3 - 1) * 0.008, (i % 2) * 0.01 - 0.005, 0.006 + i * 0.009), rot=rot, bevel=0.001)
    box('SheetTop', paper, (0.52, 0.72, 0.008), (0.01, 0.0, 0.062), rot=(0, 0, 0.14), bevel=0.001)
    box('SheetLoose', cream, (0.52, 0.72, 0.008), (-0.52, -0.30, 0.005), rot=(0, 0, 0.35), bevel=0.001)
    # leaning sheet: bottom edge on the floor, top leaning back (+Y)
    box('SheetLean', paper, (0.52, 0.006, 0.72), (0.55, 0.16, 0.152), rot=(math.radians(-65), 0, 0), bevel=0.001)
    save('papers')


# ---------------------------------------------------------------------------------------------
# 5. MUG — enamel mug with a ring handle and a coffee surface.
# ---------------------------------------------------------------------------------------------
def mug():
    clear()
    enamel = mat('MugEnamel', (0.86, 0.83, 0.78), 0.1, 0.35)
    rim = mat('MugRim', (0.15, 0.25, 0.45), 0.3, 0.4)
    coffee = mat('MugCoffee', (0.16, 0.08, 0.03), 0.0, 0.25)
    cyl('Body', enamel, 0.075, 0.085, 0.16, (0, 0, 0.08), seg=28)
    torus('Rim', rim, 0.082, 0.007, (0, 0, 0.16), seg=32, rseg=8)
    cyl('Coffee', coffee, 0.074, 0.074, 0.012, (0, 0, 0.152), seg=28)
    torus('Handle', enamel, 0.050, 0.013, (0.105, 0, 0.085), rot=(math.pi / 2, 0, 0), seg=28, rseg=8)
    save('mug')


# ---------------------------------------------------------------------------------------------
# 6. CABLE SPOOL — two wooden flanges, metal core, dark cable wound in a torus stack.
# ---------------------------------------------------------------------------------------------
def cable_spool():
    clear()
    wood = mat('SpoolWood', (0.45, 0.32, 0.18), 0.0, 0.75)
    core = mat('SpoolCore', (0.20, 0.20, 0.22), 0.6, 0.5)
    cable = mat('SpoolCable', (0.05, 0.05, 0.06), 0.1, 0.7)
    cyl('FlangeB', wood, 0.28, 0.28, 0.04, (0, 0, 0.02), seg=32)
    cyl('FlangeT', wood, 0.28, 0.28, 0.04, (0, 0, 0.42), seg=32)
    cyl('Core', core, 0.15, 0.15, 0.36, (0, 0, 0.22), seg=24)
    for k, z in enumerate((0.11, 0.165, 0.22, 0.275, 0.33)):
        torus(f'Wind{k}', cable, 0.175, 0.030, (0, 0, z), seg=36, rseg=10)
    cyl('AxleCap', core, 0.05, 0.05, 0.03, (0, 0, 0.455), seg=16)
    save('cable_spool')


# ---------------------------------------------------------------------------------------------
# 7. SHELF JARS — wall shelf (1.8 long) on brackets, 4 jars (2 with coloured contents), 2 books.
# ---------------------------------------------------------------------------------------------
def shelf_jars():
    clear()
    wood = mat('ShelfWood', (0.40, 0.27, 0.15), 0.0, 0.7)
    glass = mat('JarGlass', (0.78, 0.86, 0.84), 0.05, 0.12)
    lid = mat('JarLid', (0.55, 0.45, 0.25), 0.8, 0.35)
    amber = mat('JarAmber', (0.85, 0.55, 0.15), 0.0, 0.5)
    green = mat('JarGreen', (0.30, 0.55, 0.30), 0.0, 0.5)
    bookr = mat('BookRed', (0.55, 0.16, 0.13), 0.0, 0.7)
    bookb = mat('BookBlue', (0.14, 0.24, 0.48), 0.0, 0.7)
    for sx in (-1, 1):
        box(f'Bracket{sx}', wood, (0.07, 0.26, 0.46), (sx * 0.68, 0.03, 0.27), bevel=0.01)
    box('Shelf', wood, (1.8, 0.30, 0.05), (0, 0, 0.52), bevel=0.01)
    top = 0.545
    jars = [(-0.68, 0.095, 0.34, amber), (-0.32, 0.085, 0.28, None),
            (0.04, 0.100, 0.38, green), (0.38, 0.080, 0.26, None)]
    for k, (x, r, h, content) in enumerate(jars):
        cyl(f'Jar{k}', glass, r, r * 1.04, h, (x, 0, top + h / 2), seg=24)
        cyl(f'JarNeck{k}', glass, r * 0.8, r * 0.8, 0.04, (x, 0, top + h + 0.01), seg=20)
        cyl(f'Lid{k}', lid, r * 0.88, r * 0.88, 0.035, (x, 0, top + h + 0.045), seg=20)
        if content is not None:
            cyl(f'Contents{k}', content, r * 0.82, r * 0.85, h * 0.55, (x, 0, top + h * 0.28), seg=18)
    box('BookA', bookr, (0.15, 0.22, 0.30), (0.64, 0, top + 0.15), bevel=0.01)
    box('BookB', bookb, (0.13, 0.20, 0.26), (0.80, 0, top + 0.13), rot=(0, 0, -0.06), bevel=0.01)
    save('shelf_jars')


# ---------------------------------------------------------------------------------------------
# 8. WALL CLOCK — round clock; rim bottom rests on z = 0, centre at z = 0.36, face toward -Y.
#    Hands read ~10:10.
# ---------------------------------------------------------------------------------------------
def wall_clock():
    clear()
    rim = mat('ClockRim', (0.25, 0.16, 0.10), 0.1, 0.6)
    face = mat('ClockFace', (0.95, 0.94, 0.90), 0.0, 0.6)
    dark = mat('ClockDark', (0.08, 0.08, 0.09), 0.3, 0.5)
    cyl('Rim', rim, 0.35, 0.35, 0.07, (0, 0, 0.36), rot=(math.pi / 2, 0, 0), seg=40)
    cyl('Face', face, 0.305, 0.305, 0.075, (0, -0.004, 0.36), rot=(math.pi / 2, 0, 0), seg=40)
    for k, (dx, dz) in enumerate(((0, 0.22), (0.22, 0), (0, -0.22), (-0.22, 0))):
        box(f'Tick{k}', dark, (0.03, 0.012, 0.09) if dx == 0 else (0.09, 0.012, 0.03),
            (dx, -0.048, 0.36 + dz), bevel=0.0)
    # hour hand -> 10 (-55 deg from +Z), minute hand -> 2 (+60 deg)
    box('HourHand', dark, (0.035, 0.012, 0.15), (-0.045, -0.052, 0.391), rot=(0, math.radians(-55), 0), bevel=0.0)
    box('MinHand', dark, (0.026, 0.012, 0.23), (0.082, -0.052, 0.408), rot=(0, math.radians(60), 0), bevel=0.0)
    sphere('Hub', rim, 0.028, (0, -0.055, 0.36), seg=12)
    save('wall_clock')


# ---------------------------------------------------------------------------------------------
# 9. POPCORN BOWL — wide red enamel bowl heaped with 14 popcorn blobs.
# ---------------------------------------------------------------------------------------------
def popcorn_bowl():
    clear()
    bowl = mat('BowlRed', (0.60, 0.10, 0.10), 0.1, 0.35)
    inner = mat('BowlInner', (0.30, 0.06, 0.06), 0.0, 0.6)
    cream = mat('BowlCream', (0.92, 0.88, 0.78), 0.0, 0.5)
    popw = mat('PopWhite', (0.96, 0.93, 0.85), 0.0, 0.7)
    popb = mat('PopButter', (0.98, 0.85, 0.55), 0.0, 0.7)
    cyl('BowlBase', bowl, 0.16, 0.13, 0.04, (0, 0, 0.02), seg=32)
    cyl('BowlWall', bowl, 0.335, 0.16, 0.21, (0, 0, 0.145), seg=36)
    cyl('BowlInnerDisc', inner, 0.29, 0.29, 0.015, (0, 0, 0.252), seg=32)
    torus('BowlRim', cream, 0.33, 0.016, (0, 0, 0.25), seg=40, rseg=8)
    pops = [
        (0.00, 0.00, 0.345, 0.095, popw), (0.06, 0.05, 0.375, 0.080, popb), (-0.07, -0.03, 0.365, 0.085, popw),
        (0.15, 0.00, 0.300, 0.080, popw), (0.075, 0.13, 0.300, 0.082, popb), (-0.075, 0.13, 0.300, 0.078, popw),
        (-0.15, 0.00, 0.300, 0.083, popb), (-0.075, -0.13, 0.300, 0.079, popw), (0.075, -0.13, 0.300, 0.081, popw),
        (0.224, 0.073, 0.265, 0.078, popb), (0.00, 0.235, 0.265, 0.082, popw), (-0.224, 0.073, 0.265, 0.080, popw),
        (-0.138, -0.190, 0.265, 0.077, popb), (0.138, -0.190, 0.265, 0.083, popw),
    ]
    scales = [(1, 0.85, 0.8), (0.9, 1, 0.75), (1.05, 0.8, 0.85), (0.95, 0.9, 0.8)]
    for k, (x, y, z, r, m) in enumerate(pops):
        ico(f'Pop{k}', m, r, (x, y, z), scale=scales[k % 4], rot=(0, 0, k * 0.7))
    save('popcorn_bowl')


# ---------------------------------------------------------------------------------------------
# 10. EGG — one whole egg + cracked shell pair (cup + dome) + spilled yolk on a white splat.
# ---------------------------------------------------------------------------------------------
def egg():
    clear()
    shell = mat('EggWhite', (0.96, 0.94, 0.90), 0.0, 0.4)
    yolk = mat('YolkGlow', (1.00, 0.55, 0.10), 0.0, 0.35, emit=0.35)
    sphere('EggWhole', shell, 0.095, (-0.28, 0.02, 0.115), scale=(0.88, 0.88, 1.22), seg=24)
    # shell cup: bottom half of a sphere, rim up
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=20, v_segments=14, radius=0.088)
    bmesh.ops.scale(bm, vec=(1, 1, 1.15), verts=bm.verts)
    bmesh.ops.delete(bm, geom=[v for v in bm.verts if v.co.z > 0.002], context='VERTS')
    xf(bm, (0.16, 0.06, 0.101), (0.12, 0, 0.3))
    obj('ShellCup', bm, shell, True)
    # shell dome: top half resting on its rim
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=20, v_segments=14, radius=0.088)
    bmesh.ops.scale(bm, vec=(1, 1, 1.15), verts=bm.verts)
    bmesh.ops.delete(bm, geom=[v for v in bm.verts if v.co.z < -0.002], context='VERTS')
    xf(bm, (0.36, -0.10, 0.0), (0, 0, -0.4))
    obj('ShellDome', bm, shell, True)
    # spilled white splat + yolk disc
    cyl('Splat', shell, 0.095, 0.105, 0.008, (0.17, -0.16, 0.004), seg=24)
    cyl('Yolk', yolk, 0.055, 0.058, 0.024, (0.17, -0.16, 0.014), seg=24)
    save('egg')


# ---------------------------------------------------------------------------------------------
# 11. STOOL — round lab stool: wooden disc seat, 3 splayed steel legs, foot ring.
# ---------------------------------------------------------------------------------------------
def stool():
    clear()
    wood = mat('StoolWood', (0.50, 0.35, 0.20), 0.0, 0.65)
    steel = mat('StoolSteel', (0.30, 0.32, 0.35), 0.8, 0.4)
    cyl('Seat', wood, 0.26, 0.26, 0.05, (0, 0, 0.63), seg=32)
    cyl('SeatUnder', steel, 0.19, 0.19, 0.04, (0, 0, 0.595), seg=24)
    tilt = 7.6
    for k, adeg in enumerate((0, 120, 240)):
        a = math.radians(adeg)
        dx, dy = math.cos(a), math.sin(a)
        rot = (math.radians(-tilt * dy), math.radians(tilt * dx), 0)
        cyl(f'Leg{k}', steel, 0.024, 0.024, 0.61, (0.20 * dx, 0.20 * dy, 0.30), rot=rot, seg=12)
    torus('FootRing', steel, 0.227, 0.014, (0, 0, 0.10), seg=36, rseg=8)
    save('stool')


for fn in (osc_scope, desk_lamp, tool_rack, papers, mug, cable_spool,
           shelf_jars, wall_clock, popcorn_bowl, egg, stool):
    fn()
print('ALL DRESSING DONE')
