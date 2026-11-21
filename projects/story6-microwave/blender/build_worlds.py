# projects/story6-microwave/blender/build_worlds.py
# Story 6 «الشوكولاتة اللي ساحت» — the two remaining worlds' key assets (built ahead of design docs,
# per the accepted staging review: S20 starts on ONE hero kitchen, then pulls back to reveal homes;
# the molecule world needs background population + a dark backdrop).
# Units: 1 Blender unit = 1 D (one head). Z up in Blender -> Y up in the engine (glTF export_yup).
# Engine front (+Z, camera side) = Blender -Y. Every prop stands on z = 0, centred on x = y = 0.
# Writes   assets/blender/<prop>.blend  +  assets/blender/<prop>.glb   for:
#   hero_kitchen   one warm modern kitchen unit: cabinets, counter, microwave (MicroGlow), lit window
#   home_block     cutaway apartment block, 3x4 window grid, 4 kitchen hints + warm HomeGlow windows
#   molecule_env   3 satellite water molecules + droplets + dark backdrop disc for the molecule world
# Run: ~/workspace/tools/blender-4.2.23/blender --background --python projects/story6-microwave/blender/build_worlds.py
import os, math, bpy, bmesh
from mathutils import Euler

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
# 1. HERO KITCHEN — 4.2 wide x 0.8 deep x 2.6 tall. Front (doors, microwave face) = -Y.
#    Lower cabinets + counter at z<1, backsplash + lit window mid, wall cabinets up to 2.6.
# ---------------------------------------------------------------------------------------------
def hero_kitchen():
    clear()
    cab = mat('KitchenCab', (0.72, 0.55, 0.36), 0.0, 0.6)          # warm wood
    cabup = mat('KitchenCabUp', (0.78, 0.62, 0.42), 0.0, 0.6)
    counter = mat('KitchenCounter', (0.88, 0.85, 0.78), 0.1, 0.35)  # pale stone
    dark = mat('KitchenDark', (0.10, 0.10, 0.11), 0.4, 0.5)
    tile = mat('TilePanel', (0.80, 0.86, 0.84), 0.0, 0.4)           # light backsplash panel
    frame = mat('WindowFrame', (0.92, 0.90, 0.85), 0.0, 0.5)
    wglow = mat('WindowGlow', (1.0, 0.80, 0.50), 0.0, 0.3, emit=2.2)  # warm evening light
    microbody = mat('MicroBody', (0.82, 0.83, 0.85), 0.6, 0.3)
    microglow = mat('MicroGlow', (1.0, 0.62, 0.22), 0.0, 0.3, emit=1.4)  # lit interior behind door glass
    chrome = mat('FaucetChrome', (0.85, 0.86, 0.88), 0.95, 0.15)
    clay = mat('PotClay', (0.62, 0.30, 0.16), 0.0, 0.7)
    leaf = mat('PlantGreen', (0.20, 0.48, 0.18), 0.0, 0.6)
    mugm = mat('MugCream', (0.94, 0.90, 0.80), 0.1, 0.4)
    # lower cabinet run + recessed dark plinth + 4 doors with seams and handles
    box('CabRun', cab, (4.2, 0.8, 0.92), (0, 0, 0.46), bevel=0.02)
    box('Plinth', dark, (4.0, 0.66, 0.10), (0, 0.05, 0.05), bevel=0.0)
    for k, x in enumerate([-1.575, -0.525, 0.525, 1.575]):
        box(f'Door{k}', cabup, (0.95, 0.03, 0.76), (x, -0.415, 0.50), bevel=0.01)
        box(f'Handle{k}', chrome, (0.30, 0.03, 0.035), (x, -0.445, 0.82), bevel=0.0)
    # countertop slab with a slight overhang
    box('Counter', counter, (4.35, 0.9, 0.06), (0, 0, 0.95), bevel=0.01)
    # backsplash: one flat light panel (no tile grid — too heavy)
    box('Backsplash', tile, (4.2, 0.04, 0.92), (0, 0.38, 1.44), bevel=0.0)
    # window above the sink (sink at x=-0.7): warm pane + frame + cross bars
    box('WinPane', wglow, (1.4, 0.03, 0.68), (-0.7, 0.345, 1.46), bevel=0.0)
    box('WinFrameT', frame, (1.52, 0.05, 0.07), (-0.7, 0.33, 1.835), bevel=0.0)
    box('WinFrameB', frame, (1.52, 0.05, 0.07), (-0.7, 0.33, 1.085), bevel=0.0)
    box('WinFrameL', frame, (0.07, 0.05, 0.82), (-1.435, 0.33, 1.46), bevel=0.0)
    box('WinFrameR', frame, (0.07, 0.05, 0.82), (0.035, 0.33, 1.46), bevel=0.0)
    box('WinCrossV', frame, (0.045, 0.04, 0.68), (-0.7, 0.335, 1.46), bevel=0.0)
    box('WinCrossH', frame, (1.4, 0.04, 0.045), (-0.7, 0.335, 1.46), bevel=0.0)
    # sink inset + faucet under the window
    box('Sink', dark, (0.95, 0.52, 0.04), (-0.7, -0.02, 0.985), bevel=0.0)
    cyl('FaucetPost', chrome, 0.035, 0.035, 0.30, (-0.7, 0.24, 1.13), seg=12)
    cyl('FaucetArm', chrome, 0.028, 0.028, 0.36, (-0.7, 0.07, 1.27), rot=(math.pi / 2, 0, 0), seg=12)
    cyl('FaucetTip', chrome, 0.032, 0.032, 0.07, (-0.7, -0.10, 1.24), seg=12)
    # wall cabinets flanking the window, up to 2.6
    box('UpCabL', cab, (0.7, 0.5, 0.65), (-1.75, 0.13, 2.275), bevel=0.02)
    box('UpCabR', cab, (2.1, 0.5, 0.65), (1.05, 0.13, 2.275), bevel=0.02)
    box('UpDoorL', cabup, (0.6, 0.03, 0.55), (-1.75, -0.135, 2.275), bevel=0.01)
    for k, x in enumerate([0.55, 1.55]):
        box(f'UpDoorR{k}', cabup, (0.92, 0.03, 0.55), (x, -0.135, 2.275), bevel=0.01)
        box(f'UpHandleR{k}', chrome, (0.22, 0.03, 0.03), (x, -0.16, 2.02), bevel=0.0)
    box('UpHandleL', chrome, (0.22, 0.03, 0.03), (-1.75, -0.16, 2.02), bevel=0.0)
    # THE MICROWAVE on the counter (right side): body, glowing door window, dial + button
    box('MicroBody', microbody, (0.9, 0.6, 0.52), (1.35, -0.05, 1.24), bevel=0.03)
    box('MicroDoorFrame', dark, (0.64, 0.02, 0.44), (1.20, -0.355, 1.24), bevel=0.0)
    box('MicroDoor', microglow, (0.54, 0.03, 0.34), (1.20, -0.368, 1.24), bevel=0.0)
    cyl('MicroDial', dark, 0.05, 0.05, 0.04, (1.665, -0.365, 1.35), rot=(math.pi / 2, 0, 0), seg=16)
    box('MicroButton', dark, (0.09, 0.03, 0.05), (1.665, -0.365, 1.16), bevel=0.0)
    # mug + small plant on the counter
    cyl('Mug', mugm, 0.055, 0.048, 0.11, (-1.55, -0.12, 1.035), seg=16)
    torus('MugHandle', mugm, 0.035, 0.011, (-1.495, -0.12, 1.035), rot=(0, math.pi / 2, 0), seg=16, rseg=6, arc=math.pi)
    cyl('PlantPot', clay, 0.075, 0.058, 0.12, (0.35, 0.12, 1.04), seg=16)
    sphere('Leaf1', leaf, 0.095, (0.35, 0.12, 1.19), seg=12)
    sphere('Leaf2', leaf, 0.07, (0.27, 0.10, 1.14), seg=12)
    sphere('Leaf3', leaf, 0.07, (0.43, 0.14, 1.15), seg=12)
    save('hero_kitchen')


# ---------------------------------------------------------------------------------------------
# 2. HOME BLOCK — cutaway apartment block 5 wide x 1 deep x 7 tall. Facade frame with a
#    3 x 4 grid of window openings; 4 windows carry a simple kitchen hint, all windows glow warm.
#    Built to be instanced/scaled by the scene for the S20 pull-back: clean, low-poly.
# ---------------------------------------------------------------------------------------------
def home_block():
    clear()
    wall = mat('BlockWall', (0.55, 0.42, 0.33), 0.0, 0.8)            # muted warm brick
    trim = mat('BlockTrim', (0.68, 0.58, 0.46), 0.0, 0.7)
    inner = mat('BlockInner', (0.16, 0.11, 0.08), 0.0, 0.9)          # dark interior shell
    glow = mat('HomeGlow', (1.0, 0.72, 0.38), 0.0, 0.3, emit=2.0)    # warm lit window
    glowsoft = mat('HomeGlowSoft', (1.0, 0.66, 0.34), 0.0, 0.3, emit=1.1)
    hint = mat('HintCab', (0.60, 0.45, 0.30), 0.0, 0.7)
    microglow = mat('MicroGlow', (1.0, 0.62, 0.22), 0.0, 0.3, emit=1.6)
    roof = mat('RoofDark', (0.22, 0.18, 0.16), 0.0, 0.8)
    # facade frame: 4 full-height verticals + 5 full-width horizontal bands (openings 1.2 x 1.3125)
    for k, x in enumerate([-2.325, -0.775, 0.775, 2.325]):
        box(f'Pier{k}', wall, (0.35, 1.0, 7.0), (x, 0, 3.5), bevel=0.0)
    for k, z in enumerate([0.175, 1.8375, 3.5, 5.1625, 6.825]):
        box(f'Band{k}', wall, (5.0, 1.0, 0.35), (0, 0, z), bevel=0.0)
    box('Sill', trim, (5.3, 1.15, 0.18), (0, 0, 0.09), bevel=0.02)
    # dark interior shell behind the openings
    box('InnerShell', inner, (4.9, 0.08, 6.9), (0, 0.46, 3.5), bevel=0.0)
    # roof slab + a small tank box for silhouette
    box('Roof', roof, (5.5, 1.3, 0.22), (0, 0, 7.11), bevel=0.02)
    box('RoofTank', roof, (0.9, 0.8, 0.7), (1.6, 0, 7.57), bevel=0.03)
    # windows: warm glow plane in every opening; kitchen hint in 4 of them (spread diagonally)
    cols = [-1.55, 0.0, 1.55]
    rows = [1.00625, 2.66875, 4.33125, 5.99375]
    hints = {(0, 0), (2, 1), (1, 2), (0, 3)}
    for r, wz in enumerate(rows):
        for c, wx in enumerate(cols):
            gm = glow if (c + r) % 3 else glowsoft
            box(f'Glow{c}_{r}', gm, (1.2, 0.04, 1.3125), (wx, 0.34, wz), bevel=0.0)
            if (c, r) in hints:
                # simple kitchen hint: counter slab + tiny microwave with a MicroGlow dot + cabinet
                box(f'HintCounter{c}_{r}', hint, (1.05, 0.30, 0.07), (wx, -0.05, wz - 0.42), bevel=0.0)
                box(f'HintCab{c}_{r}', hint, (0.5, 0.22, 0.30), (wx - 0.25, 0.0, wz + 0.38), bevel=0.0)
                box(f'HintMicro{c}_{r}', inner, (0.42, 0.26, 0.26), (wx + 0.18, -0.05, wz - 0.225), bevel=0.01)
                box(f'HintDot{c}_{r}', microglow, (0.20, 0.015, 0.12), (wx + 0.13, -0.19, wz - 0.225), bevel=0.0)
    save('home_block')


# ---------------------------------------------------------------------------------------------
# 3. MOLECULE ENV — background population for the molecule world: 3 satellite water molecules
#    (~40% hero scale: O red sphere + 2 H white spheres + bond cylinders), 6 droplets, and a
#    big soft dark backdrop disc standing on z = 0 behind them (front = -Y, disc at +Y).
# ---------------------------------------------------------------------------------------------
def _bond(name, m, a, b, r):
    dx, dy, dz = b[0] - a[0], b[1] - a[1], b[2] - a[2]
    L = math.sqrt(dx * dx + dy * dy + dz * dz)
    mid = ((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2)
    cyl(name, m, r, r, L, mid, rot=(0, math.atan2(dx, dz), 0), seg=10)


def _molecule(tag, center, s, red, white, bond, variant=0):
    cx, cy, cz = center
    o = (cx, cy, cz)
    offs = [(0.75, 0, 0.55), (-0.75, 0, 0.55)]
    if variant == 1:      # mirrored
        offs = [(-ox, oy, oz) for (ox, oy, oz) in offs]
    elif variant == 2:    # turned side-on (offsets rotated in the XZ plane)
        offs = [(oz, oy, -ox) for (ox, oy, oz) in offs]
    sphere(f'Oxy{tag}', red, 0.55 * s, o, seg=20)
    for k, (ox, oy, oz) in enumerate(offs):
        h = (cx + ox * s, cy + oy * s, cz + oz * s)
        _bond(f'Bond{tag}_{k}', bond, o, h, 0.13 * s)
        sphere(f'Hyd{tag}_{k}', white, 0.34 * s, h, seg=16)


def molecule_env():
    clear()
    red = mat('MolRed', (0.85, 0.16, 0.12), 0.1, 0.35)
    white = mat('MolWhite', (0.95, 0.96, 0.98), 0.0, 0.3)
    bond = mat('MolBond', (0.75, 0.78, 0.82), 0.2, 0.4)
    drop = mat('DropPale', (0.65, 0.80, 0.95), 0.0, 0.25, emit=0.35)
    back = mat('BackDark', (0.015, 0.025, 0.07), 0.0, 1.0)
    # backdrop disc: radius 6, standing on z = 0, well behind the population (+Y)
    cyl('Backdrop', back, 6.0, 6.0, 0.1, (0, 4.2, 6.0), rot=(math.pi / 2, 0, 0), seg=48, smooth=False)
    # 3 satellite molecules floating in front of the disc
    _molecule('A', (-2.7, 1.4, 3.6), 1.0, red, white, bond, variant=0)
    _molecule('B', (2.9, 1.9, 4.4), 1.15, red, white, bond, variant=1)
    _molecule('C', (0.4, -2.3, 5.3), 0.85, red, white, bond, variant=2)
    # 6 tiny droplets scattered between them
    drops = [(-1.4, -0.9, 2.2, 0.12), (1.8, -1.5, 3.0, 0.09), (-3.5, 0.5, 4.8, 0.15),
             (3.6, 0.1, 2.6, 0.10), (0.9, 2.7, 3.8, 0.13), (-0.9, 2.9, 5.6, 0.08)]
    for k, (x, y, z, r) in enumerate(drops):
        sphere(f'Drop{k}', drop, r, (x, y, z), seg=12)
    save('molecule_env')


for fn in (hero_kitchen, home_block, molecule_env):
    fn()
print('ALL WORLD PROPS DONE')
