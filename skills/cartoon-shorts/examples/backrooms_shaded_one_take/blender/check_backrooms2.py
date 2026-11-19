# check_backrooms2.py: checks the exported files, not the .blend. Reads set.glb, kit.glb and scatter.json as the renderer would (three.js axes).
#   blender --background --factory-startup --python blender/check_backrooms2.py                  numbers only: keep-clear, doorways, y 4.3, axes, counts
#   ... -- --render                                                                               also renders plain check images to blender/check/
# The images are a look at the geometry only: gray clay under simple area lights, never the final look.
import bpy, json, math, struct, sys
from pathlib import Path
import numpy as np
from mathutils import Matrix, Quaternion, Vector

HERE = Path(__file__).resolve().parent
A = HERE.parent / 'world' / 'assets' / 'backrooms2'
ARGS = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
HALLD = [-10 - 6 * i for i in range(10)]

def read_glb(path):
    raw = open(path, 'rb').read()
    n = struct.unpack('<I', raw[12:16])[0]
    j = json.loads(raw[20:20 + n])
    bin_ = raw[20 + n + 8:]
    def acc(i):
        a = j['accessors'][i]; v = j['bufferViews'][a['bufferView']]
        comp = {5126: np.float32, 5125: np.uint32, 5123: np.uint16, 5121: np.uint8}[a['componentType']]
        k = {'SCALAR': 1, 'VEC2': 2, 'VEC3': 3, 'VEC4': 4}[a['type']]
        off = v.get('byteOffset', 0) + a.get('byteOffset', 0)
        return np.frombuffer(bin_, comp, a['count'] * k, off).reshape(-1, k) if k > 1 else np.frombuffer(bin_, comp, a['count'], off)
    out = {}
    for node in j['nodes']:
        if 'mesh' not in node: continue
        for prim in j['meshes'][node['mesh']]['primitives']:
            pos = np.array(acc(prim['attributes']['POSITION']))
            t = node.get('translation')
            if t: pos = pos + np.array(t)
            assert not node.get('rotation') and not node.get('scale'), node['name']
            d = dict(pos=pos, idx=np.array(acc(prim['indices'])), mat=j['materials'][prim['material']]['name'],
                     uv=np.array(acc(prim['attributes']['TEXCOORD_0'])), attrs=list(prim['attributes']))
            out[node['name']] = d
    return out, j

SET, jset = read_glb(A / 'set.glb')
KIT, jkit = read_glb(A / 'kit.glb')
SC = json.load(open(A / 'scatter.json'))
fails = []
def check(ok, msg):
    print(('OK   ' if ok else 'FAIL ') + msg)
    if not ok: fails.append(msg)

print('SET meshes', {k: (v['mat'], len(v['idx']) // 3) for k, v in SET.items()}, 'tris', sum(len(v['idx']) // 3 for v in SET.values()), 'size MB', round((A / 'set.glb').stat().st_size / 1e6, 2))
print('KIT meshes', {k: len(v['idx']) // 3 for k, v in KIT.items()}, 'size MB', round((A / 'kit.glb').stat().st_size / 1e6, 3))
print('INSTANCES', {k: len(v) for k, v in SC['instances'].items()}, 'total', sum(len(v) for v in SC['instances'].values()))
dc = {}
for d in SC['decals']: dc[d['surface']] = dc.get(d['surface'], 0) + 1
print('DECALS', dc, 'total', len(SC['decals']))
for name in ('wall', 'carpet', 'ceiling_tile', 'tbar', 'trim', 'panel', 'panel_frame', 'lintel'):
    check(name in SET and SET[name]['mat'] == name, f'set.glb has mesh + material {name}')
for name in ('vent', 'outlet', 'conduit_run', 'cable_coil', 'paper_scrap', 'tile_loose', 'tile_missing_frame', 'can', 'debris_a', 'debris_b'):
    check(name in KIT, f'kit.glb has {name}')

# ---- triangle boxes of everything in the set, three axes
def tri_boxes(d):
    t = d['pos'][d['idx'].reshape(-1, 3)]
    return t.min(axis=1), t.max(axis=1)
BOX = {k: tri_boxes(v) for k, v in SET.items()}
def inside(box_min, box_max, zone):
    """Triangles whose box overlaps a zone (x0, x1, y0, y1, z0, z1)."""
    x0, x1, y0, y1, z0, z1 = zone
    return (box_max[:, 0] > x0) & (box_min[:, 0] < x1) & (box_max[:, 1] > y0) & (box_min[:, 1] < y1) & (box_max[:, 2] > z0) & (box_min[:, 2] < z1)

# the keep-clear zones: nothing above 0.25 D in them under the 4.3 limit
ZONES = dict(hallway=(-1.6, 1.6, .25, 4.3, -71.8, -4.15), room=(-5.2, 5.2, .25, 4.3, -2.6, 10))
for zn, z in ZONES.items():
    for k, (a, b) in BOX.items():
        c = int(inside(a, b, z).sum())
        check(c == 0, f'keep clear {zn}: {k} has {c} triangles in it')
# the doorways (clear passage: the same as the old set's jamb width and more height)
doors = []
for x in (-2, 2):
    for dz in HALLD: doors.append(('hall door x%g z%g' % (x, dz), (x - .3, x + .3, .02, 3.6, dz - .92, dz + .92)))
for x in (-4.8, 4.8): doors.append(('back door x%g' % x, (x - .92, x + .92, .02, 3.6, -4.3, -3.7)))
doors.append(('hall mouth', (-1.8, 1.8, .02, 4.29, -4.3, -3.7)))
worst = 0
for name, z in doors:
    for k, (a, b) in BOX.items():
        c = int(inside(a, b, z).sum())
        worst += c
        if c: print('   in', name, k, c)
check(worst == 0, f'all {len(doors)} doorways clear of the set: {worst} triangles')
# nothing hangs below y 4.3 from above
for k in ('ceiling_tile', 'tbar', 'panel', 'panel_frame', 'void'):
    check(float(SET[k]['pos'][:, 1].min()) >= 4.3, f'{k} lowest y {SET[k]["pos"][:, 1].min():.3f} >= 4.3')
check(abs(float(SET['lintel']['pos'][:, 1][np.abs(SET['lintel']['pos'][:, 0]) < 1.8].min()) - 4.36) < .01, 'mouth lintel underside at y 4.36, its liner at 4.3')
tr = SET['trim']['pos']
m = (np.abs(tr[:, 0]) < 1.87) & (np.abs(tr[:, 2] + 4) < .3) & (tr[:, 1] > 1)
check(abs(float(tr[m, 1].min()) - 4.3) < .002, f'mouth liner bottom y {tr[m, 1].min():.3f} is 4.3')

# ---- axes: known places in world/backrooms.js, in three.js axes
near = (np.abs(tr[:, 0] - 2) < .4) & (np.abs(tr[:, 2] + 46) < 1.3)
x0, x1, y1, z0, z1 = tr[near, 0].min(), tr[near, 0].max(), tr[near, 1].max(), tr[near, 2].min(), tr[near, 2].max()
print(f'   door frame at x 2, z -46: x {x0:.3f}..{x1:.3f} top y {y1:.3f} z {z0:.3f}..{z1:.3f}')
check(1.8 < x0 < 1.9 and 2.1 < x1 < 2.2 and abs(y1 - 3.86) < .01 and abs(z0 + 47.17) < .02 and abs(z1 + 44.83) < .02, 'door frame at x 2, z -46 lands where backrooms.js has it')
# panels: every slot of backrooms.js
lens = SET['panel']['pos']
slots = []
z = 13
while z > -72:
    for x in ([-3.6, 3.6] if z > -4 else [-4.5, 0, 4.5]): slots.append((x, z))
    z -= 6
miss = []
for x, z in slots:
    zz = -5.3 if z == -5 else (-70.7 if z == -71 else z)
    m = (np.abs(lens[:, 0] - x) < .6) & (np.abs(lens[:, 2] - zz) < 1.2)
    if m.sum() < 4 or abs(lens[m, 0].mean() - x) > .001 or abs(lens[m, 2].mean() - zz) > .001: miss.append((x, z))
check(not miss and len(slots) == len(SC['meta']['panels']), f'{len(slots)} panels at the backrooms.js slots (z -5 and z -71 slide 0.3 D to fit between walls): missing {miss}')
check(abs(float(SET['panel']['pos'][:, 1].mean()) - 5.045) < .012, f'panel lens recessed at y {SET["panel"]["pos"][:, 1].mean():.3f}')
# walls: faces where they should be
w = SET['wall']['pos']
for name, axis, val, a, b in (('hall right inner', 0, 1.9, -30, -28.1), ('outer right', 0, 6.9, 0, 5), ('outer left', 0, -6.9, 0, 5), ('far', 2, -71.9, None, None), ('front', 2, 17.9, None, None), ('back room face', 2, -3.9, None, None)):
    m = np.abs(w[:, axis] - val) < .016
    if axis == 0: m &= (w[:, 2] > a) & (w[:, 2] < b)
    check(m.sum() > 4, f'wall face {name} at {val}: {int(m.sum())} vertices (unevenness +-{np.abs(w[m, axis] - val).max():.3f})')
# UVs: 1 UV = 1 D, and the direction promised
cp, cu = SET['carpet']['pos'], SET['carpet']['uv']
check(np.allclose(cu[:, 0], cp[:, 0], atol=1e-3) and np.allclose(cu[:, 1], cp[:, 2], atol=1e-3), 'carpet UV = (x, z)')
m = (np.abs(w[:, 0] - 6.9) < .016) & (w[:, 2] > 0) & (w[:, 2] < 17)
check(np.allclose(SET['wall']['uv'][m, 1], w[m, 1], atol=1e-3) and np.allclose(SET['wall']['uv'][m, 0], w[m, 2], atol=1e-3), 'x wall UV = (z, y)')
lu = SET['panel']['uv']
check(lu[:, 0].max() < 1.2 and lu[:, 1].max() < 2.4 and lu.min() > 0, f'panel UV inside 1.2 x 2.4: {lu[:, 0].min():.2f}..{lu[:, 0].max():.2f}, {lu[:, 1].min():.2f}..{lu[:, 1].max():.2f}')
check('COLOR_0' in SET['ceiling_tile']['attrs'], 'ceiling_tile carries COLOR_0')

# ---- scatter.json: world boxes of each instance
def inst_world(name, e):
    p = np.array(e[:3]); q = e[3:7]; s = np.array(e[7:10])
    R_ = np.array(Quaternion((q[3], q[0], q[1], q[2])).to_matrix())
    return (KIT[name]['pos'] * s) @ R_.T + p
bad_keep = bad_door = bad_low = bad_out = 0
for name, arr in SC['instances'].items():
    for e in arr:
        v = inst_world(name, e)
        lo, hi = v.min(axis=0), v.max(axis=0)
        one = lambda z: hi[0] > z[0] and lo[0] < z[1] and hi[1] > z[2] and lo[1] < z[3] and hi[2] > z[4] and lo[2] < z[5]
        for z in ZONES.values():
            if one(z):
                bad_keep += 1; print('   keep-clear hit', name, [round(x, 2) for x in e[:3]], 'y', round(lo[1], 3), round(hi[1], 3))
        for dn, z in doors:
            if one(z):
                bad_door += 1; print('   door hit', dn, name, [round(x, 2) for x in e[:3]])
        if name == 'tile_missing_frame' and lo[1] < 4.3: bad_low += 1
        if hi[0] > 7 or lo[0] < -7 or lo[2] < -72 or hi[2] > 18 or hi[1] > 5.6 or lo[1] < -.01:
            bad_out += 1; print('   out of the set', name, [round(x, 2) for x in e[:3]], np.round(lo, 2), np.round(hi, 2))
check(bad_keep == 0, f'instances in keep-clear zones: {bad_keep}')
check(bad_door == 0, f'instances in doorways: {bad_door}')
check(bad_low == 0, f'torn frames below y 4.3: {bad_low}')
check(bad_out == 0, f'instances outside the set: {bad_out}')
# decals
rng = dict(floor=(0, 17), wall=(18, 29), ceiling=(30, 35))
bad = 0
for d in SC['decals']:
    lo, hi = rng[d['surface']]
    if not lo <= d['cell'] <= hi: bad += 1
    if d['surface'] == 'floor' and not (.003 <= d['pos'][1] <= .012 and d['normal'] == [0, 1, 0]): bad += 1
    if d['surface'] == 'ceiling' and not (4.95 <= d['pos'][1] <= 4.99 and d['normal'] == [0, -1, 0]): bad += 1
check(bad == 0, f'decal cells, heights and normals follow the contract: {bad} wrong')
# no wall decal may hang into a doorway's opening; no ceiling decal over a hole, a hanging tile or a panel
bad_w = bad_c = 0
openings = [('x', x, z, DH_) for x in (-2, 2) for z in HALLD for DH_ in [3.7]] + [('z', -4, x, 3.7) for x in (-4.8, 4.8)]
for d in SC['decals']:
    if d['surface'] == 'wall':
        n = d['normal']; ax = 'x' if n[0] else 'z'
        c, s = abs(math.cos(d['spin'])), abs(math.sin(d['spin']))
        eu, ev = (d['size'][0] * c + d['size'][1] * s) / 2, (d['size'][0] * s + d['size'][1] * c) / 2
        u = d['pos'][2] if ax == 'x' else d['pos'][0]
        pl = d['pos'][0] if ax == 'x' else d['pos'][2]
        for a, cen, uc, dh in openings:
            if a == ax and abs(pl - cen) < .15 and abs(u - uc) < 1 + eu - .002 and d['pos'][1] - ev < dh - .002:
                bad_w += 1
    if d['surface'] == 'ceiling':
        c, s = abs(math.cos(d['spin'])), abs(math.sin(d['spin']))
        eu, ev = (d['size'][0] * c + d['size'][1] * s) / 2, (d['size'][0] * s + d['size'][1] * c) / 2
        for hx, hz in SC['meta']['holes'] + SC['meta']['hanging']:
            if abs(d['pos'][0] - hx) < eu + .58 and abs(d['pos'][2] - hz) < ev + .58: bad_c += 1
        for p in SC['meta']['panels']:
            if abs(d['pos'][0] - p['x']) < eu + .6 and abs(d['pos'][2] - p['z']) < ev + 1.2: bad_c += 1
check(bad_w == 0, f'wall decals hanging into a doorway: {bad_w}')
check(bad_c == 0, f'ceiling decals over a hole, hanging tile or panel: {bad_c}')
hist = {}
for d in SC['decals']:
    hist[d['cell']] = hist.get(d['cell'], 0) + 1
print('   decal cells used', sorted(hist), 'of 36')
print('RESULT', 'ALL OK' if not fails else f'{len(fails)} FAILED')
for f in fails: print('  FAILED', f)

# ---- check images
if '--render' in ARGS:
    bpy.ops.wm.read_factory_settings(use_empty=True)
    OUTD = HERE / 'check'
    OUTD.mkdir(exist_ok=True)
    bpy.ops.import_scene.gltf(filepath=str(A / 'set.glb'))
    bpy.ops.import_scene.gltf(filepath=str(A / 'kit.glb'))
    scene = bpy.context.scene
    kit_objs = {n: bpy.data.objects[n] for n in KIT}
    R3 = Matrix(((1, 0, 0), (0, 0, -1), (0, 1, 0)))     # three -> blender
    R3T = R3.transposed()
    def to_b(p): return Vector((p[0], -p[2], p[1]))
    # instances: linked duplicates at the positions scatter.json says
    for name, arr in SC['instances'].items():
        src = kit_objs[name]
        for e in arr:
            ob = bpy.data.objects.new(name + '_i', src.data)
            q = Quaternion((e[6], e[3], e[4], e[5]))
            rb = R3 @ q.to_matrix() @ R3T
            sb = Matrix.Diagonal((e[7], e[9], e[8]))
            # imported kit objects hold a node rotation of +90 about X: the mesh data is already in blender axes
            ob.matrix_world = Matrix.Translation(to_b(e[:3])) @ (rb @ sb).to_4x4()
            scene.collection.objects.link(ob)
    for ob in kit_objs.values(): ob.hide_render = True; ob.hide_viewport = True
    # decals: flat dark quads in one mesh with vertex alpha through a plain material, so their spread can be seen
    verts, faces, cols = [], [], []
    for d in SC['decals']:
        n = Vector(d['normal']); up = Vector((0, 1, 0))
        if d['surface'] == 'floor': u = Vector((1, 0, 0))
        elif d['surface'] == 'ceiling': u = Vector((1, 0, 0))
        else: u = up.cross(n).normalized()
        v = n.cross(u)
        c, s = math.cos(d['spin']), math.sin(d['spin'])
        uu, vv = u * c + v * s, v * c - u * s
        P = Vector(d['pos'])
        b = len(verts)
        for a, e in ((-.5, -.5), (.5, -.5), (.5, .5), (-.5, .5)):
            pt = P + uu * (a * d['size'][0]) + vv * (e * d['size'][1])
            verts.append(to_b(pt))
        faces.append((b, b + 1, b + 2, b + 3))
    me = bpy.data.meshes.new('decals'); me.from_pydata([tuple(v) for v in verts], [], faces); me.update()
    ob = bpy.data.objects.new('decals', me); scene.collection.objects.link(ob)
    mat = bpy.data.materials.new('decal'); mat.use_nodes = True
    bs = next(n for n in mat.node_tree.nodes if n.type == 'BSDF_PRINCIPLED')
    bs.inputs['Base Color'].default_value = (.08, .06, .02, 1); bs.inputs['Alpha'].default_value = .42
    mat.surface_render_method = 'BLENDED'
    me.materials.append(mat)
    # a stand-in character, 3.2 D tall, for scale
    bpy.ops.mesh.primitive_cylinder_add(radius=.35, depth=3.2, location=(0, -1, 1.6))
    # lights: one soft area under each panel, a dim world
    for x, z in [(p['x'], p['z']) for p in SC['meta']['panels']]:
        l = bpy.data.lights.new('p', 'AREA'); l.shape = 'RECTANGLE'; l.size = 1.2; l.size_y = 2.4; l.energy = 26; l.color = (1, .98, .78)
        lo = bpy.data.objects.new('p', l); lo.location = (x, -z, 4.92); scene.collection.objects.link(lo)
    w = bpy.data.worlds.new('w'); scene.world = w; w.use_nodes = True
    w.node_tree.nodes['Background'].inputs[0].default_value = (.20, .19, .10, 1); w.node_tree.nodes['Background'].inputs[1].default_value = .55
    scene.render.engine = 'BLENDER_EEVEE'
    scene.eevee.taa_render_samples = 12
    scene.render.resolution_x, scene.render.resolution_y = 576, 1024
    scene.render.image_settings.file_format = 'PNG'
    cam = bpy.data.objects.new('cam', bpy.data.cameras.new('cam')); scene.collection.objects.link(cam); scene.camera = cam
    cam.data.lens = 24; cam.data.sensor_width = 24; cam.data.clip_start = .05; cam.data.clip_end = 300
    def shoot(name, frm, to, lens=24, res=None):
        f, t = Vector((frm[0], -frm[2], frm[1])), Vector((to[0], -to[2], to[1]))
        cam.location = f
        cam.rotation_euler = (t - f).to_track_quat('-Z', 'Y').to_euler()
        cam.data.lens = lens
        scene.render.resolution_x, scene.render.resolution_y = res or (576, 1024)
        scene.render.filepath = str(OUTD / (name + '.png'))
        bpy.ops.render.render(write_still=True)
    shoot('room_to_hall', (0, 1.8, 9), (0, 2.4, -6))
    shoot('hall_down', (0, 1.6, -7), (0, 2.1, -40))
    shoot('ceiling_room', (-2, 1.2, 8), (-2.5, 5, -1), 20)
    shoot('ceiling_hall_up', (0, 2.2, -18), (0, 5, -28), 20)
    shoot('door_close', (1.0, 1.4, -43), (2.0, 1.8, -46), 22)
    shoot('seam_low', (-1.2, .35, -14), (-2, .1, -22), 20)
    # close on a hole with a hanging tile beside it, from below at a low angle
    hang = SC['meta']['hanging'][1]
    shoot('hole_close', (hang[0] - .3, 2.6, hang[1] + 3.2), (hang[0], 5, hang[1]), 20)
    # the kit on a table beyond the far wall, a strong side light
    from mathutils import Euler
    for ob in list(scene.objects):
        if ob.type == 'LIGHT': ob.hide_render = True
    SP = 1.25
    for i, (n, ob) in enumerate(sorted(kit_objs.items())):
        ob.hide_render = False; ob.hide_viewport = False
        big = {'conduit_run': .33, 'tile_loose': .6, 'tile_missing_frame': .6}.get(n, 1)
        ob.matrix_world = Matrix.Translation((i % 5 * SP, 90 + (1 - i // 5) * SP, 0)) @ Matrix.Diagonal((big, big, big, 1))
    sun = bpy.data.objects.new('sun', bpy.data.lights.new('sun', 'SUN')); sun.data.energy = 4; sun.rotation_euler = (.75, .15, .7)
    scene.collection.objects.link(sun)
    bpy.ops.mesh.primitive_plane_add(size=80, location=(2 * SP, 90, -.06))
    cam.data.lens = 30
    f = Vector((2 * SP, 90 + .5 * SP - 2.2, 7)); t = Vector((2 * SP, 90 + .5 * SP, 0))
    cam.location = f; cam.rotation_euler = (t - f).to_track_quat('-Z', 'Y').to_euler()
    scene.render.resolution_x, scene.render.resolution_y = 1400, 800
    scene.render.filepath = str(OUTD / 'kit_row.png')
    bpy.ops.render.render(write_still=True)
    print('RENDERED', OUTD)
