# Story 6 — the melted chocolate bar, modelled in Blender (owner's directive 2026-11-21:
# everything professional, Blender is a full production stage).
# A small bar (0.36 x 0.16) with 2x4 raised segments, one end melted: a sagging drip
# plus a glossy puddle. Stands on z=0, centred x=y=0 (same convention as build_props.py).
# Run: ~/workspace/tools/blender-4.2.23/blender --background --python projects/story6-microwave/blender/build_chocolate.py
import os, bpy, bmesh
from mathutils import Euler

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.normpath(os.path.join(HERE, '..', 'assets', 'blender'))
os.makedirs(OUT, exist_ok=True)


def mat(name, rgb, rough=0.35, emit=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes.get('Principled BSDF')
    b.inputs['Base Color'].default_value = (*rgb, 1)
    b.inputs['Metallic'].default_value = 0.0
    b.inputs['Roughness'].default_value = rough
    if emit > 0:
        b.inputs['Emission Color'].default_value = (*rgb, 1)
        b.inputs['Emission Strength'].default_value = emit
    return m


def finish(name, bm, m, smooth=False):
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


def box(name, m, size, loc, rot=(0, 0, 0), bevel=0.008):
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    bmesh.ops.scale(bm, vec=size, verts=bm.verts)
    if bevel > 0:
        bmesh.ops.bevel(bm, geom=bm.edges[:], offset=bevel, segments=2, affect='EDGES')
    xf(bm, loc, rot)
    return finish(name, bm, m)


def blob(name, m, scale, loc):
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=20, v_segments=14, radius=1.0)
    bmesh.ops.scale(bm, vec=scale, verts=bm.verts)
    xf(bm, loc)
    return finish(name, bm, m, smooth=True)


bpy.ops.wm.read_factory_settings(use_empty=True)
CHOC = mat('ChocDark', (0.16, 0.05, 0.015), rough=0.38)   # ~#4a2410
MELT = mat('ChocMelt', (0.20, 0.07, 0.02), rough=0.12)    # ~#5a2c12, glossy

# base slab
box('BarBase', CHOC, (0.36, 0.16, 0.030), (0, 0, 0.015), bevel=0.010)
# 2 x 4 raised segments with real gaps
for ix in range(4):
    for iy in range(2):
        x = -0.135 + ix * 0.090
        y = -0.042 + iy * 0.084
        # the last column sags (melted): lower + tilted
        if ix == 3:
            box('BarSeg', MELT, (0.074, 0.068, 0.020), (x, y, 0.036), rot=(0, -0.16, 0), bevel=0.009)
        else:
            box('BarSeg', CHOC, (0.074, 0.068, 0.022), (x, y, 0.040), bevel=0.009)
# melted drip hanging off the +x end
blob('ChocDrip', MELT, (0.055, 0.045, 0.075), (0.185, 0.0, -0.028))
# glossy puddle beneath the drip end
blob('ChocPuddle', MELT, (0.115, 0.085, 0.010), (0.155, 0.0, 0.004))

bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT, 'chocolate.blend'))
bpy.ops.export_scene.gltf(filepath=os.path.join(OUT, 'chocolate.glb'),
                          export_format='GLB', export_yup=True)
print('CHOCOLATE DONE', os.listdir(OUT))
