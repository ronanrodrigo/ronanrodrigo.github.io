#!/usr/bin/env python3
"""Verifica os sinais de prontidão agêntica do site pessoal (arquivos-fonte).

Uso: python3 tests/check_agentic_readiness.py [--site-dir .]

Checa nos arquivos do repositório (sem rede):
1. 404.html existe com corpo markdown de recuperação (llms/sitemap/index).
2. index.html: H1 único e primeiro heading; canonical, og:image, og:type, lang.
3. index.html: JSON-LD Person com name+description+sameAs e Organization com contactPoint+address.
4. llms.txt e agent-guide.md: seção quando-usar com modo de chamada.
5. about.html / contact.html / privacy.html com 500+ caracteres de texto cada.
6. sitemap.xml e sitemap.md incluem about/contact/privacy.
7. index.json válido com contato.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import xml.dom.minidom
from pathlib import Path

FAILURES: list[str] = []


def check(label: str, cond: bool, detail: str = "") -> None:
    status = "ok" if cond else "FAIL"
    print(f"[{status}] {label}" + (f" — {detail}" if detail and not cond else ""))
    if not cond:
        FAILURES.append(label)


def text_of(html: str) -> str:
    no_js = re.sub(r"<script.*?</script>", "", html, flags=re.S)
    no_css = re.sub(r"<style.*?</style>", "", no_js, flags=re.S)
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", no_css)).strip()


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--site-dir", type=Path, default=Path("."))
    args = parser.parse_args()
    root = args.site_dir

    # 1. 404 agent-friendly
    p404 = root / "404.html"
    body404 = p404.read_text(encoding="utf-8") if p404.exists() else ""
    check("404.html existe", p404.exists())
    for needle in ("llms.txt", "sitemap", "index.json", "Todas as notas"):
        check(f"404.html menciona {needle}", needle in body404)

    # 2. Headings + metadados da homepage
    home = (root / "index.html").read_text(encoding="utf-8")
    head = home[: home.lower().find("</head>")]
    headings = re.findall(r"<h([1-6])\b", home)
    check("homepage: primeiro heading é H1", bool(headings) and headings[0] == "1",
          f"ordem: {headings[:4]}")
    check("homepage: H1 único", headings.count("1") == 1, f"H1s: {headings.count('1')}")
    check("homepage: canonical", 'rel="canonical"' in head)
    check("homepage: og:image", "og:image" in head)
    check("homepage: og:type", "og:type" in head)
    check("homepage: lang", 'lang="en"' in home or "lang='en'" in home)

    # 3. JSON-LD: Person com name+description, Organization com contactPoint+address
    m = re.search(r'<script type="application/ld\+json">(.*?)</script>', home, re.S)
    graph: list[dict] = []
    if m:
        try:
            graph = json.loads(m.group(1)).get("@graph", [])
        except json.JSONDecodeError as e:
            check("JSON-LD válido", False, str(e))
    by_type = {n.get("@type"): n for n in graph}
    person = by_type.get("Person", {})
    org = by_type.get("Organization", {})
    check("JSON-LD: Person com name", bool(person.get("name")))
    check("JSON-LD: Person com description", bool(person.get("description")),
          f"keys: {sorted(person.keys())}")
    check("JSON-LD: Person com sameAs", bool(person.get("sameAs")))
    check("JSON-LD: Organization com contactPoint", "contactPoint" in org)
    check("JSON-LD: Organization com address", "address" in org)

    # 4. quando-usar
    llms = (root / "llms.txt").read_text(encoding="utf-8")
    guide = (root / "agent-guide.md").read_text(encoding="utf-8")
    check("llms.txt: quando-usar", "Quando usar este site" in llms)
    check("llms.txt: modo de chamada", "HTTPS GET" in llms)
    check("agent-guide.md: quando-usar", "Quando consultar" in guide)

    # 5. trust anchors 500+ chars
    for name in ("about.html", "contact.html", "privacy.html"):
        p = root / name
        n = len(text_of(p.read_text(encoding="utf-8"))) if p.exists() else 0
        check(f"{name} existe com 500+ chars", n >= 500, f"len={n}")

    # 6. sitemaps incluem trust anchors
    sitemap_xml = (root / "sitemap.xml").read_text(encoding="utf-8")
    sitemap_md = (root / "sitemap.md").read_text(encoding="utf-8")
    for needle in ("/about", "/contact", "/privacy"):
        check(f"sitemap.xml inclui {needle}", needle in sitemap_xml)
        check(f"sitemap.md inclui {needle}", needle in sitemap_md)
    try:
        xml.dom.minidom.parseString(sitemap_xml)
        check("sitemap.xml válido", True)
    except Exception as e:
        check("sitemap.xml válido", False, str(e)[:100])

    # 7. index.json válido com contato
    try:
        idx = json.loads((root / "index.json").read_text(encoding="utf-8"))
        res = idx.get("machine_readable_resources", {})
        check("index.json válido com contato", bool(res.get("contact") and res.get("email")),
              f"keys: {sorted(res.keys())}")
    except Exception as e:
        check("index.json válido com contato", False, str(e)[:100])

    print(f"\n{len(FAILURES)} falha(s)." if FAILURES else "\nTudo certo.")
    return 1 if FAILURES else 0


if __name__ == "__main__":
    sys.exit(main())
