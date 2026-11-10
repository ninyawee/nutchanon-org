"""Add Noto Sans Thai Looped's Thai glyphs to JetBrains Mono (Nerd Font) as "JetBrains Mono Thai".

1. Subset Noto Sans Thai Looped to Thai, keeping its shaping (ccmp, locl, mark, mkmk).
2. Fit every spacing glyph into one 600-unit cell: centre it, and narrow (horizontally only)
   the ones that are wider than the cell, such as ญ ฌ ณ. Marks keep zero advance.
   Base and ligature anchors move with their glyph, so vowels and tone marks still land on it.
3. Merge into JetBrains Mono and rename the family.
"""
import sys
from fontTools.ttLib import TTFont
from fontTools import subset
from fontTools.merge import Merger
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.recordingPen import DecomposingRecordingPen

FAMILY = "JetBrains Mono Thai"
CELL = 600
SCALE = 0.95      # overall size of Thai relative to Noto's design
MAX_W = 600       # widest a glyph may be before it is narrowed
FEATURES = ["ccmp", "locl", "mark", "mkmk"]  # no rlig: it joins ฤๅ into one cell


def thai_subset(path, out):
    opts = subset.Options()
    opts.layout_features = FEATURES
    opts.layout_scripts = ["thai", "DFLT"]
    opts.name_IDs = []
    opts.notdef_outline = False
    opts.glyph_names = True
    opts.hinting = False
    opts.drop_tables += ["kern", "GPOS_dist"]
    f = TTFont(path)
    s = subset.Subsetter(opts)
    s.populate(unicodes=list(range(0x0E01, 0x0E5C)) + [0x25CC])
    s.subset(f)
    return f


def fit(f):
    gs = f.getGlyphSet()
    glyf, hmtx = f["glyf"], f["hmtx"]
    xf = {}
    for n in f.getGlyphOrder():
        adv = hmtx[n][0]
        if n == ".notdef":
            continue
        if adv == 0:
            h, dx, new_adv = 1.0, 0.0, 0
        else:
            w = adv * SCALE
            h = min(1.0, MAX_W / w)
            dx = (CELL - w * h) / 2
            new_adv = CELL
        xf[n] = (h, dx)
        rec = DecomposingRecordingPen(gs)
        gs[n].draw(rec)
        pen = TTGlyphPen(None)
        rec.replay(TransformPen(pen, (SCALE * h, 0, 0, SCALE, dx, 0)))
        g = pen.glyph()
        g.recalcBounds(None)
        glyf[n] = g
        hmtx[n] = (new_adv, g.xMin if g.numberOfContours else 0)

    def move(anchor, glyph=None):
        if anchor is None:
            return
        h, dx = xf.get(glyph, (1.0, 0.0)) if glyph else (1.0, 0.0)
        anchor.XCoordinate = round(anchor.XCoordinate * SCALE * h + dx)
        anchor.YCoordinate = round(anchor.YCoordinate * SCALE)
        anchor.Format = 1

    for lookup in f["GPOS"].table.LookupList.Lookup:
        for st in lookup.SubTable:
            if lookup.LookupType == 9:
                st = st.ExtSubTable
            t = st.LookupType if hasattr(st, "LookupType") else lookup.LookupType
            if t == 4:
                for rec in st.MarkArray.MarkRecord:
                    move(rec.MarkAnchor)
                for g, rec in zip(st.BaseCoverage.glyphs, st.BaseArray.BaseRecord):
                    for a in rec.BaseAnchor:
                        move(a, g)
            elif t == 5:
                for rec in st.MarkArray.MarkRecord:
                    move(rec.MarkAnchor)
                for g, lig in zip(st.LigatureCoverage.glyphs, st.LigatureArray.LigatureAttach):
                    for comp in lig.ComponentRecord:
                        for a in comp.LigatureAnchor:
                            move(a, g)
            elif t == 6:
                for rec in st.Mark1Array.MarkRecord:
                    move(rec.MarkAnchor)
                for rec in st.Mark2Array.Mark2Record:
                    for a in rec.Mark2Anchor:
                        move(a)
            elif t in (1, 2):
                raise SystemExit(f"unexpected positioning lookup type {t}")


def rename(f, style):
    full = FAMILY if style == "Regular" else f"{FAMILY} {style}"
    ps = f"{FAMILY.replace(' ', '')}-{style.replace(' ', '')}"
    legacy = style if style in ("Regular", "Bold", "Italic", "Bold Italic") else "Regular"
    name = f["name"]
    for rec in list(name.names):
        if rec.nameID in (1, 2, 3, 4, 6, 16, 17, 21, 22):
            name.removeNames(nameID=rec.nameID)
    for nid, val in ((1, FAMILY), (2, legacy), (3, f"{ps};noto-thai-looped"),
                     (4, full), (6, ps), (16, FAMILY), (17, style)):
        name.setName(val, nid, 3, 1, 0x409)
        name.setName(val, nid, 1, 0, 0)


def main(base_path, thai_path, out_path, style, tmp_dir):
    thai = thai_subset(thai_path, None)
    fit(thai)
    thai_tmp = f"{tmp_dir}/thai-{style.replace(' ', '')}.ttf"
    thai.save(thai_tmp)

    base = TTFont(base_path)
    for tag in ("hdmx", "LTSH", "VDMX", "DSIG"):
        if tag in base:
            del base[tag]
    base_tmp = f"{tmp_dir}/base-{style.replace(' ', '')}.ttf"
    base.save(base_tmp)

    merged = Merger().merge([base_tmp, thai_tmp])
    # Keep JetBrains Mono's line height: the merger takes the taller Noto metrics.
    for tag, attrs in (("hhea", ("ascent", "descent", "lineGap")),
                       ("OS/2", ("sTypoAscender", "sTypoDescender", "sTypoLineGap",
                                 "usWinAscent", "usWinDescent"))):
        for a in attrs:
            setattr(merged[tag], a, getattr(base[tag], a))
    rename(merged, style)
    merged.save(out_path)
    print(out_path, "ok")


if __name__ == "__main__":
    main(*sys.argv[1:6])
