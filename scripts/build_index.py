#!/usr/bin/env python3
"""Generate posts/index.json from posts/*.md front matter. Files starting with _ and draft: true are skipped."""
import json, re, pathlib
P = pathlib.Path(__file__).resolve().parent.parent / "posts"
out = []
for f in sorted(P.glob("*.md")):
    if f.name.startswith("_"):
        continue
    t = f.read_text(encoding="utf-8-sig")
    m = re.match(r"---\r?\n(.*?)\r?\n---\r?\n", t, re.S)
    meta = {}
    if m:
        for l in m.group(1).splitlines():
            if ":" in l:
                k, v = l.split(":", 1)
                meta[k.strip()] = v.split(" #")[0].strip().strip("\"'")
    if meta.get("draft", "").lower() == "true":
        continue
    out.append({"slug": f.stem, "title": meta.get("title", f.stem), "date": meta.get("date", ""),
                "summary": meta.get("summary", ""),
                "tags": [x.strip() for x in meta.get("tags", "").split(",") if x.strip()]})
out.sort(key=lambda p: p["date"], reverse=True)
(P / "index.json").write_text(json.dumps(out, indent=2), encoding="utf-8")
print("indexed", len(out), "posts")
