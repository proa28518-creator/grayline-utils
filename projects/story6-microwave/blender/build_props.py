# projects/story6-microwave/blender/build_props.py
# Story 6 «الشوكولاتة اللي ساحت» — hero props modelled in Blender (owner's word 2026-11-21: Blender is a REQUIRED stage).
# Units: 1 Blender unit = 1 D (one head). Z up in Blender -> Y up in the engine (glTF export_yup).
# Engine front (+Z, camera side) = Blender -Y. Every prop stands on z = 0, centred on x = y = 0.
# Writes   assets/blender/<prop>.blend  +  assets/blender/<prop>.glb   for:
#   radar_device   huge 1945 military radar cabinet + horn dish + glowing tube nozzle (the wave source, never named)
#   kettle         metal tea kettle (براد) with lid, spout, handle
#   wave_box       riveted iron box with a door + glow window (the trapped waves)
#   giant_oven     the first wave oven: man's height cabinet, door window, dials, vents, feet
#   scale          showroom platform scale with big round dial + separate needle (ScaleNeedle)
# Run: ~/workspace/tools/blender-4.2.23/blender --background --python projects/story6-microwave/blender/build_props.py
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


def save(name):
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT, name + '.blend'))
    p = os.path.join(OUT, name + '.glb')
    bpy.ops.export_scene.gltf(filepath=p, export_format='GLB', export_yup=True, export_materials='EXPORT', export_apply=True)
    print('EXPORTED', p, os.path.getsize(p))


# ---------------------------------------------------------------------------------------------
# 1. RADAR DEVICE — ~7.4 D tall war machine. Nozzle tube points at Blender -Y (engine +Z, toward camera side).
# ---------------------------------------------------------------------------------------------
def radar_device():
    clear()
    steel = mat('RadarSteel', (0.20, 0.27, 0.30), 0.6, 0.45)
    dark = mat('RadarDark', (0.08, 0.10, 0.12), 0.5, 0.55)
    olive = mat('RadarOlive', (0.28, 0.31, 0.22), 0.3, 0.6)
    brass = mat('RadarBrass', (0.62, 0.44, 0.16), 0.8, 0.3)
    glow = mat('NozzleGlow', (1.0, 0.62, 0.20), 0.0, 0.3, emit=4.0)
    lamp = mat('WarnLamp', (1.0, 0.36, 0.10), 0.0, 0.3, emit=3.0)
    dial = mat('DialFace', (0.92, 0.86, 0.66), 0.0, 0.6)
    # main cabinet: stepped plinth + tall body
    # PHASE-2 TRIM (2026-11-21): plinth depth 3.0 -> 2.2, front edge pulled back
    # (centre y 0 -> +0.40; Blender -Y = engine +Z front). The original plinth
    # reached glTF z +1.5 and, after the anchor's 90° rotation, swallowed the
    # popcorn bowl staged at the cabinet's front foot (S09 hard blocker — the
    # bowl was INSIDE the plinth slab). Front now ends at glTF z +0.70; the
    # cabinet body (front z +1.25) cantilevers 0.55 over the bench as a toe-kick.
    box('Plinth', dark, (5.2, 2.2, 0.5), (0, 0.40, 0.25), bevel=0.06)
    box('Body', olive, (4.4, 2.5, 4.4), (0, 0, 2.7), bevel=0.10)
    box('Crown', steel, (4.7, 2.7, 0.35), (0, 0, 5.05), bevel=0.06)
    # vertical ribs + rivet rows on the front face
    for i, x in enumerate([-1.9, -0.95, 0.95, 1.9]):
        box(f'Rib{i}', steel, (0.14, 0.12, 4.2), (x, -1.28, 2.7), bevel=0.02)
    for row, z in enumerate([0.75, 4.65]):
        for k in range(12):
            sphere(f'Rivet{row}_{k}', brass, 0.05, (-2.0 + k * 0.364, -1.29, z), seg=8)
    # front instrument panel: 3 round dials + switch row + vents
    for k, x in enumerate([-1.4, 0, 1.4]):
        cyl(f'DialRim{k}', brass, 0.36, 0.36, 0.08, (x, -1.29, 3.95), rot=(math.pi / 2, 0, 0))
        cyl(f'Dial{k}', dial, 0.30, 0.30, 0.09, (x, -1.30, 3.95), rot=(math.pi / 2, 0, 0))
        box(f'DialNeedle{k}', dark, (0.03, 0.02, 0.24), (x + 0.05, -1.36, 4.0), rot=(0, 0.6 - k * 0.5, 0), bevel=0)
    for k in range(7):
        box(f'Switch{k}', brass, (0.07, 0.16, 0.16), (-1.2 + k * 0.4, -1.33, 3.35), rot=(0.4, 0, 0), bevel=0.01)
    for k in range(6):
        box(f'Vent{k}', dark, (2.6, 0.06, 0.07), (0, -1.27, 1.2 + k * 0.18), bevel=0.0)
    # warning lamps on top corners
    for k, x in enumerate([-2.05, 2.05]):
        cyl(f'LampBase{k}', steel, 0.2, 0.2, 0.18, (x, -0.9, 5.32))
        sphere(f'WarnLamp{k}', lamp, 0.22, (x, -0.9, 5.55), seg=16)
    # THE TUBE / NOZZLE: thick horizontal barrel out of the front, flared cone, glowing core
    cyl('TubeCollar', steel, 0.75, 0.75, 0.5, (0, -1.45, 2.35), rot=(math.pi / 2, 0, 0))
    cyl('Tube', dark, 0.48, 0.42, 1.6, (0, -2.4, 2.35), rot=(math.pi / 2, 0, 0))
    for k in range(4):
        torus(f'TubeRing{k}', brass, 0.47 - k * 0.012, 0.05, (0, -1.85 - k * 0.38, 2.35), rot=(math.pi / 2, 0, 0), seg=24, rseg=8)
    cyl('NozzleFlare', steel, 0.42, 0.72, 0.55, (0, -3.42, 2.35), rot=(math.pi / 2, 0, 0))
    cyl('NozzleCore', glow, 0.55, 0.55, 0.06, (0, -3.70, 2.35), rot=(math.pi / 2, 0, 0))
    sphere('NozzleBulb', glow, 0.32, (0, -3.62, 2.35), scale=(1, 0.5, 1), seg=16)
    # big horn dish on top on a yoke (radar silhouette)
    cyl('YokePost', steel, 0.28, 0.32, 0.9, (0, 0.2, 5.65))
    box('Yoke', steel, (2.2, 0.3, 0.25), (0, 0.2, 6.15), bevel=0.04)
    for s in (-1, 1):
        box(f'YokeArm{s}', steel, (0.2, 0.3, 0.9), (s * 1.05, 0.2, 6.55), bevel=0.03)
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=False, cap_tris=False, segments=32, radius1=0.25, radius2=1.55, depth=0.9)
    xf(bm, (0, -0.25, 6.75), (math.radians(70), 0, 0))
    obj('Dish', bm, steel, True)
    cyl('DishFeed', brass, 0.06, 0.06, 1.3, (0, -0.85, 6.95), rot=(math.radians(70), 0, 0), seg=8)
    sphere('DishFeedTip', lamp, 0.10, (0, -1.45, 7.2), seg=10)
    # thick cables down the back + side cabinet with valves (tubes)
    for k, x in enumerate([-1.6, -1.2, 1.3]):
        cyl(f'Cable{k}', dark, 0.09, 0.09, 4.6, (x, 1.45, 2.6), seg=10)
    box('SideCab', olive, (1.2, 1.8, 2.6), (3.0, 0.2, 1.3), bevel=0.06)
    for k in range(3):
        cyl(f'Valve{k}', glow, 0.10, 0.10, 0.5, (3.0 - 0.35 + k * 0.35, -0.72, 1.9), seg=12)
        cyl(f'ValveCap{k}', steel, 0.12, 0.12, 0.08, (3.0 - 0.35 + k * 0.35, -0.72, 2.18), seg=12)
    save('radar_device')


# ---------------------------------------------------------------------------------------------
# 2. KETTLE — 0.75 D tall metal tea kettle. Spout toward Blender +X.
# ---------------------------------------------------------------------------------------------
def kettle():
    clear()
    metal = mat('KettleMetal', (0.70, 0.72, 0.74), 0.9, 0.25)
    dark = mat('KettleDark', (0.12, 0.10, 0.10), 0.3, 0.6)
    brass = mat('KettleBrass', (0.70, 0.50, 0.18), 0.8, 0.3)
    sphere('Body', metal, 0.36, (0, 0, 0.30), scale=(1, 1, 0.82), seg=32)
    cyl('Base', metal, 0.30, 0.34, 0.06, (0, 0, 0.03), seg=32)
    cyl('Neck', metal, 0.20, 0.17, 0.12, (0, 0, 0.60), seg=32)
    sphere('Lid', metal, 0.18, (0, 0, 0.64), scale=(1, 1, 0.45), seg=24)
    sphere('Knob', dark, 0.055, (0, 0, 0.73), seg=12)
    cyl('Spout', metal, 0.075, 0.035, 0.45, (0.42, 0, 0.42), rot=(0, math.radians(55), 0), seg=16)
    torus('Handle', dark, 0.26, 0.035, (-0.02, 0, 0.62), rot=(math.pi / 2, 0, 0), seg=24, rseg=8, arc=math.pi)
    torus('Band', brass, 0.355, 0.018, (0, 0, 0.30), seg=32, rseg=6)
    save('kettle')


# ---------------------------------------------------------------------------------------------
# 3. WAVE BOX — riveted iron box 1.5 x 1.2 x 1.1 D, door on the front (-Y) with a glow window.
#    Door is its own object group named Door* (hinge on the left edge, x = -0.62).
# ---------------------------------------------------------------------------------------------
def wave_box():
    clear()
    iron = mat('BoxIron', (0.24, 0.24, 0.26), 0.8, 0.45)
    dark = mat('BoxDark', (0.08, 0.08, 0.09), 0.6, 0.5)
    seam = mat('BoxSeam', (0.55, 0.36, 0.18), 0.6, 0.4)
    glow = mat('BoxGlow', (1.0, 0.66, 0.24), 0.0, 0.3, emit=3.5)
    box('Shell', iron, (1.5, 1.1, 1.2), (0, 0, 0.66), bevel=0.04)
    box('Skid', dark, (1.6, 1.2, 0.08), (0, 0, 0.04), bevel=0.02)
    for k, x in enumerate([-0.75, 0.75]):
        box(f'WeldSeam{k}', seam, (0.05, 1.12, 1.22), (x, 0, 0.66), bevel=0.0)
    for k in range(9):
        for zz in (0.12, 1.2):
            sphere(f'Rivet{k}_{zz}', dark, 0.03, (-0.64 + k * 0.16, -0.56, zz), seg=8)
    # door + window + handle + hinges (front, -Y)
    box('DoorPanel', iron, (1.1, 0.06, 0.9), (0.02, -0.58, 0.68), bevel=0.02)
    box('DoorWindow', glow, (0.62, 0.02, 0.42), (-0.02, -0.615, 0.74), bevel=0.0)
    for k in range(4):
        box(f'DoorGrille{k}', dark, (0.02, 0.03, 0.44), (-0.26 + k * 0.16, -0.625, 0.74), bevel=0.0)
    box('DoorHandle', seam, (0.06, 0.08, 0.36), (0.45, -0.65, 0.68), bevel=0.01)
    for k, z in enumerate([0.35, 1.0]):
        cyl(f'Hinge{k}', dark, 0.04, 0.04, 0.16, (-0.55, -0.62, z), seg=10)
    # control knob + cable on the side
    cyl('Knob', seam, 0.08, 0.08, 0.06, (0.76, -0.2, 0.95), rot=(0, math.pi / 2, 0), seg=16)
    cyl('Feed', dark, 0.05, 0.05, 0.7, (0.76, 0.3, 0.6), rot=(0, 0, 0), seg=10)
    save('wave_box')


# ---------------------------------------------------------------------------------------------
# 4. GIANT FIRST OVEN — 2.9 D tall (a man's height), 1.6 wide, 1.3 deep. Front = -Y.
# ---------------------------------------------------------------------------------------------
def giant_oven():
    clear()
    body = mat('OvenBody', (0.62, 0.64, 0.60), 0.7, 0.35)
    trim = mat('OvenChrome', (0.85, 0.86, 0.88), 0.95, 0.15)
    dark = mat('OvenDark', (0.08, 0.09, 0.10), 0.4, 0.5)
    glow = mat('OvenGlow', (1.0, 0.70, 0.30), 0.0, 0.3, emit=3.0)
    dial = mat('OvenDial', (0.94, 0.90, 0.78), 0.0, 0.6)
    red = mat('OvenRed', (0.75, 0.12, 0.10), 0.2, 0.4)
    box('Cabinet', body, (1.6, 1.3, 2.7), (0, 0, 1.55), bevel=0.08)
    box('TopCap', trim, (1.68, 1.38, 0.12), (0, 0, 2.94), bevel=0.04)
    box('Base', dark, (1.66, 1.36, 0.14), (0, 0, 0.27), bevel=0.03)
    for sx in (-1, 1):
        for sy in (-1, 1):
            cyl(f'Foot{sx}{sy}', trim, 0.07, 0.10, 0.20, (sx * 0.68, sy * 0.52, 0.10), seg=12)
    # oven door: chrome frame, dark glass window with warm glow, big handle
    box('DoorFrame', trim, (1.18, 0.06, 1.0), (-0.12, -0.66, 1.75), bevel=0.03)
    box('DoorGlass', dark, (0.96, 0.03, 0.78), (-0.12, -0.695, 1.75), bevel=0.0)
    box('DoorGlow', glow, (0.70, 0.02, 0.52), (-0.12, -0.705, 1.75), bevel=0.0)
    box('DoorHandle', trim, (0.08, 0.10, 0.75), (0.40, -0.74, 1.75), bevel=0.02)
    # control column on the right: 3 dials + red button + timer
    box('Panel', dark, (0.26, 0.04, 1.0), (0.64, -0.665, 1.75), bevel=0.01)
    for k in range(3):
        cyl(f'Dial{k}', dial, 0.09, 0.09, 0.05, (0.64, -0.69, 2.12 - k * 0.26), rot=(math.pi / 2, 0, 0), seg=20)
        box(f'DialMark{k}', dark, (0.015, 0.02, 0.07), (0.64, -0.72, 2.15 - k * 0.26), bevel=0)
    cyl('RedButton', red, 0.06, 0.06, 0.05, (0.64, -0.69, 1.38), rot=(math.pi / 2, 0, 0), seg=16)
    # lower vent grille + nameplate (blank, no text) + side vents + top exhaust stack
    for k in range(7):
        box(f'Vent{k}', dark, (1.2, 0.04, 0.05), (0, -0.66, 0.55 + k * 0.09), bevel=0.0)
    box('Nameplate', trim, (0.6, 0.03, 0.12), (-0.12, -0.665, 2.48), bevel=0.01)
    for s in (-1, 1):
        for k in range(5):
            box(f'Side{s}_{k}', dark, (0.03, 0.8, 0.05), (s * 0.81, 0, 2.2 + k * 0.1), bevel=0.0)
    cyl('Exhaust', trim, 0.12, 0.12, 0.3, (-0.45, 0.25, 3.15), seg=16)
    cyl('ExhaustCap', dark, 0.16, 0.16, 0.05, (-0.45, 0.25, 3.32), seg=16)
    save('giant_oven')


# ---------------------------------------------------------------------------------------------
# 5. SHOWROOM SCALE — platform 2.2 x 1.8 D, column + big round dial (2 D across) facing -Y. Needle separate (ScaleNeedle).
# ---------------------------------------------------------------------------------------------
def scale():
    clear()
    iron = mat('ScaleIron', (0.16, 0.20, 0.24), 0.7, 0.4)
    brass = mat('ScaleBrass', (0.76, 0.56, 0.20), 0.85, 0.25)
    face = mat('ScaleFace', (0.95, 0.92, 0.82), 0.0, 0.6)
    red = mat('ScaleRed', (0.82, 0.12, 0.10), 0.2, 0.4)
    box('Platform', iron, (2.2, 1.8, 0.22), (0, 0, 0.11), bevel=0.05)
    box('Deck', brass, (2.0, 1.6, 0.05), (0, 0, 0.245), bevel=0.02)
    for k in range(5):
        box(f'Tread{k}', iron, (1.9, 0.04, 0.02), (0, -0.6 + k * 0.3, 0.28), bevel=0.0)
    # dial column at the back-right of the platform (so the oven sits in front-left)
    box('Column', iron, (0.35, 0.35, 2.4), (1.35, 0.6, 1.2), bevel=0.04)
    cyl('DialRim', brass, 1.0, 1.0, 0.18, (1.35, 0.42, 3.1), rot=(math.pi / 2, 0, 0), seg=48)
    cyl('DialFace', face, 0.88, 0.88, 0.19, (1.35, 0.40, 3.1), rot=(math.pi / 2, 0, 0), seg=48)
    for k in range(21):
        a = math.radians(-135 + k * 13.5)
        L = 0.16 if k % 5 == 0 else 0.08
        r = 0.78 - L / 2
        box(f'Tick{k}', iron, (0.025, 0.02, L), (1.35 + r * math.sin(a), 0.29, 3.1 + r * math.cos(a)), rot=(0, a, 0), bevel=0)
    # red zone arc at the top end of the dial
    torus('RedZone', red, 0.80, 0.03, (1.35, 0.29, 3.1), rot=(math.pi / 2, 0, math.radians(-45)), seg=16, rseg=6, arc=math.radians(50))
    # needle: separate object around the hub (pivot = dial centre)
    box('ScaleNeedle', red, (0.05, 0.03, 0.72), (1.35, 0.26, 3.1 + 0.32), bevel=0.0)
    sphere('Hub', brass, 0.08, (1.35, 0.26, 3.1), seg=12)
    save('scale')


for fn in (radar_device, kettle, wave_box, giant_oven, scale):
    fn()
print('ALL PROPS DONE')
