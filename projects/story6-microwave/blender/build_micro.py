# projects/story6-microwave/blender/build_micro.py
# Story 6 «الشوكولاتة اللي ساحت» — phase-2 micro-builds. Same conventions as
# build_dressing.py: 1 Blender unit = 1 D; Z up in Blender -> Y up in the
# engine (glTF export_yup); engine front (+Z) = Blender -Y.
#   food_cutaway    — a halved potato showing layered interior + steam wisps,
#                     ~0.5u, stands on z=0 centred on x=y=0 (normal prop).
#   magnetron_feed  — copper waveguide + cable run, AUTHORED IN LAB
#                     COORDINATES (like molecule_env): engine point
#                     (ex, ey, ez) is written as Blender (ex, -ez, ey), so the
#                     GLB mounts at a lab-origin anchor with no transform.
# Run: ~/workspace/tools/blender-4.2.23/blender --background --python projects/story6-microwave/blender/build_micro.py
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
# FOOD CUTAWAY — halved potato, cut face up: skin rim, pale flesh face, deep
# flesh ring + core, a few flesh chunks, three steam wisps. Diameter 0.48,
# body height 0.165, steam to ~0.40.
# ---------------------------------------------------------------------------------------------
def food_cutaway():
    clear()
    skin = mat('PotatoSkin', (0.42, 0.30, 0.15), 0.0, 0.8)
    pale = mat('FleshPale', (0.97, 0.88, 0.62), 0.0, 0.6)
    deep = mat('FleshDeep', (0.99, 0.79, 0.40), 0.0, 0.55)
    steam = mat('SteamPale', (0.93, 0.96, 1.0), 0.0, 0.4, emit=0.7)
    # skin shell: three stacked tapered rings give a rounded potato silhouette
    cyl('SkinBase', skin, 0.16, 0.20, 0.05, (0, 0, 0.025), seg=28)
    cyl('SkinMid', skin, 0.20, 0.235, 0.05, (0, 0, 0.075), seg=28)
    cyl('SkinTop', skin, 0.235, 0.24, 0.04, (0, 0, 0.12), seg=28)
    # cut face: pale flesh disc nested inside the skin rim (rim 0.24 > face 0.225)
    cyl('CutFace', pale, 0.225, 0.225, 0.016, (0, 0, 0.148), seg=28)
    torus('FleshRing', deep, 0.15, 0.013, (0, 0, 0.157))
    cyl('FleshCore', deep, 0.08, 0.08, 0.010, (0, 0, 0.158), seg=20)
    ico('Chunk1', pale, 0.030, (0.10, 0.06, 0.160), scale=(1, 0.9, 0.7))
    ico('Chunk2', pale, 0.026, (-0.07, -0.09, 0.159), scale=(0.9, 1, 0.7))
    ico('Chunk3', deep, 0.022, (-0.11, 0.05, 0.159), scale=(1, 0.85, 0.7))
    # steam wisps: stacked shrinking spheres, slight drift
    for i, (x, y, z, r) in enumerate([
        (0.07, 0.03, 0.24, 0.042), (0.09, 0.035, 0.32, 0.032), (0.115, 0.04, 0.39, 0.022),
        (-0.08, -0.04, 0.23, 0.036), (-0.095, -0.045, 0.30, 0.026),
        (0.0, -0.09, 0.22, 0.030), (0.01, -0.10, 0.285, 0.020),
    ]):
        sphere(f'Steam{i}', steam, r, (x, y, z), scale=(1, 1, 1.25), seg=14)
    save('food_cutaway')


# ---------------------------------------------------------------------------------------------
# MAGNETRON FEED — authored in ENGINE lab coordinates (Blender loc =
# (ex, -ez, ey), Blender box size = (sx, sz, sy)). Route: junction box on the
# radar cabinet's east face at engine y 3.05 (above the S17 engineer's head,
# top 2.92), horizontal copper waveguide east along z -4.85 to x 4.9, elbow +
# drop + flange ending just above the wave-box top (box top y ~1.96, flange
# at 2.08). Parallel dark cable with a gentle sag. Two struts ground the run
# on the kettle bench (x -2.2) and the wave bench (x 3.0).
# ---------------------------------------------------------------------------------------------
def E(ex, ey, ez):
    return (ex, -ez, ey)


def magnetron_feed():
    clear()
    copper = mat('FeedCopper', (0.72, 0.42, 0.20), 0.85, 0.35)
    brass = mat('FeedBrass', (0.62, 0.44, 0.16), 0.8, 0.3)
    dark = mat('FeedDark', (0.16, 0.15, 0.14), 0.5, 0.55)
    rubber = mat('CableDark', (0.05, 0.05, 0.06), 0.0, 0.8)
    # junction box on the cabinet east face (cabinet face at engine x -3.75)
    box('JunctionBox', dark, (0.18, 0.70, 0.50), E(-3.68, 3.05, -4.60), bevel=0.02)
    box('JunctionPlate', brass, (0.04, 0.44, 0.30), E(-3.58, 3.05, -4.60), bevel=0.01)
    # main horizontal waveguide: engine x -3.6..4.8 at y 3.05, z -4.85
    box('WaveguideRun', copper, (8.40, 0.17, 0.11), E(0.60, 3.05, -4.85), bevel=0.015)
    # brass collars along the run
    for i, x in enumerate([-3.3, -0.9, 1.5, 3.9]):
        box(f'Collar{i}', brass, (0.09, 0.23, 0.17), E(x, 3.05, -4.85), bevel=0.01)
    # support struts down to the benches (bench tops y 1.3)
    cyl('StrutWest', dark, 0.03, 0.035, 1.75, E(-2.2, 2.175, -4.85), seg=12)
    cyl('StrutEast', dark, 0.03, 0.035, 1.75, E(3.0, 2.175, -4.85), seg=12)
    cyl('StrutFootW', dark, 0.11, 0.09, 0.04, E(-2.2, 1.32, -4.85), seg=12)
    cyl('StrutFootE', dark, 0.11, 0.09, 0.04, E(3.0, 1.32, -4.85), seg=12)
    # elbow + drop + end flange above the wave box (box centre engine (5, -5),
    # top y ~1.96; drop at (4.9, -4.85) lands inside the top footprint)
    box('Elbow', copper, (0.24, 0.24, 0.24), E(4.90, 3.05, -4.85), bevel=0.02)
    box('DropPipe', copper, (0.17, 0.11, 0.94), E(4.90, 2.58, -4.85), bevel=0.015)
    box('EndFlange', brass, (0.28, 0.28, 0.05), E(4.90, 2.08, -4.85), bevel=0.01)
    # parallel cable (r 0.032) at z -4.58, gentle sag, drop beside the pipe
    cyl('CableA', rubber, 0.032, 0.032, 2.83, E(-2.18, 2.87, -4.58), rot=(0, math.pi / 2, 0), seg=10)
    cyl('CableB', rubber, 0.032, 0.032, 2.83, E(0.65, 2.82, -4.58), rot=(0, math.pi / 2, 0), seg=10)
    cyl('CableC', rubber, 0.032, 0.032, 2.83, E(3.48, 2.87, -4.58), rot=(0, math.pi / 2, 0), seg=10)
    cyl('CableDrop', rubber, 0.032, 0.032, 0.85, E(4.90, 2.445, -4.58), seg=10)
    save('magnetron_feed')


food_cutaway()
magnetron_feed()
print('MICRO BUILDS DONE')
