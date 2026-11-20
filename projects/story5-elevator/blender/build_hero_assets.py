# projects/story5-elevator/blender/build_hero_assets.py
# Headless Blender generator for Story 5 «المصعد المفتوح» sculpted hero GLBs:
#   1. assets/set/elevator_crest.glb   — 1930s Art-Deco Sunburst Brass Arch & Stepped Finials
#   2. assets/set/lobby_chandelier.glb — Multi-Tiered Art-Deco Brass & Crystal Grand Hotel Chandelier
#   3. assets/set/noir_sedan.glb       — Sculpted 1940s Curved-Fender Noir Sedan with Chrome Grille & Whitewalls
# Run: blender --background --python projects/story5-elevator/blender/build_hero_assets.py

import os
import math
import bpy
import bmesh
from mathutils import Vector, Euler

OUT_DIR = '/workspaces/grayline-utils/projects/story5-elevator/assets/set'
os.makedirs(OUT_DIR, exist_ok=True)


def clear_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)


def make_mat(name, color, metallic=0.2, roughness=0.45, emit=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    bsdf = m.node_tree.nodes.get('Principled BSDF')
    bsdf.inputs['Base Color'].default_value = (*color, 1.0)
    bsdf.inputs['Metallic'].default_value = metallic
    bsdf.inputs['Roughness'].default_value = roughness
    if emit > 0.0:
        if 'Emission Color' in bsdf.inputs:
            bsdf.inputs['Emission Color'].default_value = (*color, 1.0)
            bsdf.inputs['Emission Strength'].default_value = emit
        elif 'Emission' in bsdf.inputs:
            bsdf.inputs['Emission'].default_value = (*color, 1.0)
    return m


def add_mesh(name, bm, mat, smooth=True):
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    if smooth:
        for p in me.polygons:
            p.use_smooth = True
    obj = bpy.data.objects.new(name, me)
    obj.data.materials.append(mat)
    bpy.context.collection.objects.link(obj)
    return obj


def export_glb(filename):
    path = os.path.join(OUT_DIR, filename)
    bpy.ops.export_scene.gltf(
        filepath=path,
        export_format='GLB',
        export_yup=True,
        export_materials='EXPORT',
    )
    print(f'EXPORTED GLB: {path} ({os.path.getsize(path)} bytes)')


# =========================================================================
# 1. ART-DECO BRASS ELEVATOR SUNBURST CREST & FINIALS (elevator_crest.glb)
# =========================================================================
def build_elevator_crest():
    clear_scene()
    brass_main = make_mat('BrassMain', (0.62, 0.44, 0.14), metallic=0.72, roughness=0.34)
    brass_dark = make_mat('BrassDark', (0.30, 0.20, 0.06), metallic=0.65, roughness=0.42)
    gold_trim  = make_mat('GoldTrim',  (0.82, 0.62, 0.22), metallic=0.80, roughness=0.25)

    # Stepped Art-Deco winged base cornice
    for i, (w, h, d, y) in enumerate([
        (4.55, 0.22, 0.56, 0.0),
        (3.60, 0.20, 0.48, 0.20),
        (2.55, 0.18, 0.40, 0.38),
    ]):
        bm = bmesh.new()
        bmesh.ops.create_cube(bm, size=1.0)
        bmesh.ops.scale(bm, vec=(w, d, h), verts=bm.verts)
        bmesh.ops.bevel(bm, geom=bm.edges[:], offset=0.035, segments=2, affect='EDGES')
        bmesh.ops.translate(bm, vec=(0, 0, y), verts=bm.verts)
        add_mesh(f'Cornice_{i}', bm, brass_dark if i % 2 == 0 else brass_main)

    # 13 Sculpted Radial Art-Deco Sunburst Fluted Rays fanning out above the semicircular dial!
    for k in range(-6, 7):
        ang = math.radians(k * 13.0)
        ray_len = 1.65 - abs(k) * 0.11
        bm = bmesh.new()
        bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=6, radius1=0.075, radius2=0.018, depth=ray_len)
        bmesh.ops.translate(bm, vec=(0, 0, ray_len * 0.5 + 0.62), verts=bm.verts)
        bmesh.ops.rotate(bm, cent=(0, 0, 0.10), matrix=Euler((0, ang, 0), 'XYZ').to_matrix(), verts=bm.verts)
        add_mesh(f'SunRay_{k}', bm, gold_trim if k % 2 == 0 else brass_main)

    # Twin Sculpted Fluted Side Urn Finials crowning the left & right portal jambs!
    for sx in (-1.92, 1.92):
        for seg_i, (r1, r2, h, z) in enumerate([
            (0.24, 0.18, 0.24, 0.22),
            (0.14, 0.28, 0.34, 0.50),
            (0.28, 0.08, 0.38, 0.84),
            (0.09, 0.02, 0.26, 1.14),
        ]):
            bm = bmesh.new()
            bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=14, radius1=r1, radius2=r2, depth=h)
            bmesh.ops.translate(bm, vec=(sx, 0, z), verts=bm.verts)
            add_mesh(f'Finial_{sx}_{seg_i}', bm, gold_trim if seg_i in (1, 3) else brass_dark)

    export_glb('elevator_crest.glb')


# =========================================================================
# 2. MULTI-TIERED 1930s ART-DECO GRAND HOTEL CHANDELIER (lobby_chandelier.glb)
# =========================================================================
def build_lobby_chandelier():
    clear_scene()
    brass = make_mat('ChandBrass', (0.64, 0.45, 0.14), metallic=0.78, roughness=0.30)
    dark  = make_mat('ChandDark',  (0.28, 0.18, 0.06), metallic=0.70, roughness=0.40)
    glow  = make_mat('ChandGlow',  (1.00, 0.84, 0.42), metallic=0.05, roughness=0.22, emit=1.6)
    cryst = make_mat('ChandCryst', (0.94, 0.90, 0.74), metallic=0.10, roughness=0.12, emit=0.55)

    # Central fluted suspension column + sculpted canopy & bottom spire
    for i, (r1, r2, h, z) in enumerate([
        (0.55, 0.18, 0.42, 2.55),
        (0.10, 0.10, 2.40, 1.25),
        (0.45, 0.65, 0.32, 0.10),
        (0.62, 0.24, 0.55, -0.34),
        (0.22, 0.03, 0.68, -0.92),
    ]):
        bm = bmesh.new()
        bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=16, radius1=r1, radius2=r2, depth=h)
        bmesh.ops.translate(bm, vec=(0, 0, z), verts=bm.verts)
        add_mesh(f'Stem_{i}', bm, brass if i % 2 == 0 else dark)

    # Two tiered ornate brass rings with 8 outer + 6 inner frosted crystal lantern globes & dangling crystal prisms!
    tiers = [(1.75, 0.05, 8, 0.24), (1.05, 0.75, 6, 0.20)]
    for t_idx, (rad, z_tier, count, globe_r) in enumerate(tiers):
        # Sculpted octagonal/circular ring hoop
        bm_ring = bmesh.new()
        segs = 32
        tube_r = 0.075
        ring_verts = []
        for s in range(segs):
            a = (s / segs) * math.tau
            cx, cy = math.cos(a) * rad, math.sin(a) * rad
            loop = []
            for j in range(8):
                b = (j / 8) * math.tau
                rr = rad + math.cos(b) * tube_r
                zz = z_tier + math.sin(b) * tube_r
                loop.append(bm_ring.verts.new((math.cos(a) * rr, math.sin(a) * rr, zz)))
            ring_verts.append(loop)
        for s in range(segs):
            l0, l1 = ring_verts[s], ring_verts[(s + 1) % segs]
            for j in range(8):
                bm_ring.faces.new((l0[j], l0[(j + 1) % 8], l1[(j + 1) % 8], l1[j]))
        add_mesh(f'Ring_{t_idx}', bm_ring, brass)

        # Spokes, frosted amber lantern globes, and faceted crystal drop prisms
        for k in range(count):
            a = (k / count) * math.tau
            gx, gy = math.cos(a) * rad, math.sin(a) * rad
            # Radial brass arm from hub to ring
            bm_arm = bmesh.new()
            bmesh.ops.create_cube(bm_arm, size=1.0)
            bmesh.ops.scale(bm_arm, vec=(rad, 0.06, 0.08), verts=bm_arm.verts)
            bmesh.ops.translate(bm_arm, vec=(rad * 0.5, 0, z_tier), verts=bm_arm.verts)
            bmesh.ops.rotate(bm_arm, cent=(0, 0, z_tier), matrix=Euler((0, 0, a), 'XYZ').to_matrix(), verts=bm_arm.verts)
            add_mesh(f'Arm_{t_idx}_{k}', bm_arm, dark)

            # Frosted Art-Deco fluted crystal globe lamp
            bm_g = bmesh.new()
            bmesh.ops.create_uvsphere(bm_g, u_segments=12, v_segments=8, radius=globe_r)
            bmesh.ops.scale(bm_g, vec=(1.0, 1.0, 1.32), verts=bm_g.verts)
            bmesh.ops.translate(bm_g, vec=(gx, gy, z_tier + globe_r * 1.15), verts=bm_g.verts)
            add_mesh(f'Globe_{t_idx}_{k}', bm_g, glow)

            # Dangling faceted crystal teardrop prism below each arm
            bm_p = bmesh.new()
            bmesh.ops.create_cone(bm_p, cap_ends=True, cap_tris=False, segments=6, radius1=0.075, radius2=0.012, depth=0.46)
            bmesh.ops.translate(bm_p, vec=(gx, gy, z_tier - 0.30), verts=bm_p.verts)
            add_mesh(f'Prism_{t_idx}_{k}', bm_p, cryst, smooth=False)

    export_glb('lobby_chandelier.glb')


# =========================================================================
# 3. SCULPTED 1940s CURVED-FENDER NOIR SEDAN (noir_sedan.glb)
# Oriented along +Z forward (matching rain_street car1 direction!)
# =========================================================================
def build_noir_sedan():
    clear_scene()
    body_mat   = make_mat('NoirBody',   (0.10, 0.16, 0.28), metallic=0.48, roughness=0.24)
    chrome_mat = make_mat('ChromeTrim', (0.76, 0.80, 0.86), metallic=0.90, roughness=0.16)
    glass_mat  = make_mat('CarGlass',   (0.16, 0.34, 0.52), metallic=0.20, roughness=0.12, emit=0.22)
    tire_mat   = make_mat('TireBlack',  (0.06, 0.07, 0.09), metallic=0.05, roughness=0.80)
    white_mat  = make_mat('Whitewall',  (0.84, 0.82, 0.76), metallic=0.05, roughness=0.55)

    # Note: Blender Z is UP, Y is -Z (Three.js +Z = Blender -Y when export_yup=True).
    # Keep car symmetrical front/back along Blender Y (length 4.5, width 1.96, height ~1.95).

    # Sculpted rounded lower body tub
    bm_tub = bmesh.new()
    bmesh.ops.create_cube(bm_tub, size=1.0)
    bmesh.ops.scale(bm_tub, vec=(1.68, 4.30, 0.74), verts=bm_tub.verts)
    bmesh.ops.bevel(bm_tub, geom=bm_tub.edges[:], offset=0.18, segments=3, affect='EDGES')
    bmesh.ops.translate(bm_tub, vec=(0, 0, 0.78), verts=bm_tub.verts)
    add_mesh('BodyTub', bm_tub, body_mat)

    # Sculpted domed 1940s fastback roof cabin
    bm_cab = bmesh.new()
    bmesh.ops.create_cube(bm_cab, size=1.0)
    bmesh.ops.scale(bm_cab, vec=(1.46, 2.15, 0.76), verts=bm_cab.verts)
    # Taper top vertices inward for classic streamlined 1940s sedan silhouette
    for v in bm_cab.verts:
        if v.co.z > 0:
            v.co.x *= 0.82
            v.co.y *= 0.76
    bmesh.ops.bevel(bm_cab, geom=bm_cab.edges[:], offset=0.16, segments=3, affect='EDGES')
    bmesh.ops.translate(bm_cab, vec=(0, 0.24, 1.44), verts=bm_cab.verts)
    add_mesh('CabinRoof', bm_cab, body_mat)

    # Recessed windshield & side window glass volume
    bm_gl = bmesh.new()
    bmesh.ops.create_cube(bm_gl, size=1.0)
    bmesh.ops.scale(bm_gl, vec=(1.42, 1.88, 0.48), verts=bm_gl.verts)
    for v in bm_gl.verts:
        if v.co.z > 0:
            v.co.x *= 0.85
            v.co.y *= 0.80
    bmesh.ops.translate(bm_gl, vec=(0, 0.22, 1.42), verts=bm_gl.verts)
    add_mesh('Windows', bm_gl, glass_mat)

    # 4 Sculpted Teardrop Curved Fenders + Running Boards (signature 1940s Noir silhouette!)
    for sx in (-0.86, 0.86):
        for sy in (-1.38, 1.38):
            bm_f = bmesh.new()
            bmesh.ops.create_uvsphere(bm_f, u_segments=14, v_segments=10, radius=0.48)
            bmesh.ops.scale(bm_f, vec=(0.56, 1.38, 0.92), verts=bm_f.verts)
            bmesh.ops.translate(bm_f, vec=(sx, sy, 0.68), verts=bm_f.verts)
            add_mesh(f'Fender_{sx}_{sy}', bm_f, body_mat)
        # Running board connecting front & rear fenders
        bm_rb = bmesh.new()
        bmesh.ops.create_cube(bm_rb, size=1.0)
        bmesh.ops.scale(bm_rb, vec=(0.30, 1.85, 0.14), verts=bm_rb.verts)
        bmesh.ops.bevel(bm_rb, geom=bm_rb.edges[:], offset=0.04, segments=2, affect='EDGES')
        bmesh.ops.translate(bm_rb, vec=(sx * 1.02, 0, 0.34), verts=bm_rb.verts)
        add_mesh(f'RunBoard_{sx}', bm_rb, chrome_mat)

    # Vertical Art-Deco Chrome Radiator Grille + Curved Front & Rear Chrome Bumpers
    for gx in (-0.36, -0.22, -0.08, 0.08, 0.22, 0.36):
        bm_g = bmesh.new()
        bmesh.ops.create_cube(bm_g, size=1.0)
        bmesh.ops.scale(bm_g, vec=(0.045, 0.10, 0.56), verts=bm_g.verts)
        bmesh.ops.translate(bm_g, vec=(gx, -2.18, 0.76), verts=bm_g.verts)
        add_mesh(f'Grille_{gx}', bm_g, chrome_mat)
    for by in (-2.26, 2.26):
        bm_b = bmesh.new()
        bmesh.ops.create_cube(bm_b, size=1.0)
        bmesh.ops.scale(bm_b, vec=(1.96, 0.16, 0.20), verts=bm_b.verts)
        bmesh.ops.bevel(bm_b, geom=bm_b.edges[:], offset=0.05, segments=2, affect='EDGES')
        bmesh.ops.translate(bm_b, vec=(0, by, 0.44), verts=bm_b.verts)
        add_mesh(f'Bumper_{by}', bm_b, chrome_mat)

    # 4 Whitewall Tires with Chrome Hubcaps
    for sx in (-0.96, 0.96):
        for sy in (-1.38, 1.38):
            bm_t = bmesh.new()
            bmesh.ops.create_cone(bm_t, cap_ends=True, cap_tris=False, segments=18, radius1=0.42, radius2=0.42, depth=0.26)
            bmesh.ops.rotate(bm_t, cent=(0, 0, 0), matrix=Euler((0, math.pi / 2, 0), 'XYZ').to_matrix(), verts=bm_t.verts)
            bmesh.ops.translate(bm_t, vec=(sx, sy, 0.42), verts=bm_t.verts)
            add_mesh(f'Tire_{sx}_{sy}', bm_t, tire_mat)
            bm_w = bmesh.new()
            bmesh.ops.create_cone(bm_w, cap_ends=True, cap_tris=False, segments=18, radius1=0.28, radius2=0.28, depth=0.28)
            bmesh.ops.rotate(bm_w, cent=(0, 0, 0), matrix=Euler((0, math.pi / 2, 0), 'XYZ').to_matrix(), verts=bm_w.verts)
            bmesh.ops.translate(bm_w, vec=(sx, sy, 0.42), verts=bm_w.verts)
            add_mesh(f'Whitewall_{sx}_{sy}', bm_w, white_mat)
            bm_h = bmesh.new()
            bmesh.ops.create_uvsphere(bm_h, u_segments=12, v_segments=8, radius=0.14)
            bmesh.ops.scale(bm_h, vec=(0.45, 1.0, 1.0), verts=bm_h.verts)
            bmesh.ops.translate(bm_h, vec=(sx + (0.14 if sx > 0 else -0.14), sy, 0.42), verts=bm_h.verts)
            add_mesh(f'Hub_{sx}_{sy}', bm_h, chrome_mat)

    export_glb('noir_sedan.glb')


if __name__ == '__main__':
    build_elevator_crest()
    build_lobby_chandelier()
    build_noir_sedan()
    print('ALL STORY 5 HERO BLENDER GLBs BUILT SUCCESSFULLY.')
