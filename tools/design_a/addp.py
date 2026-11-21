# 既存の機種データに P（「起きた」「そのうち当たった」）項目を足す。dict(...) 形式と {'k': ...} 形式の両方に対応
import re
def addP(key, pstr, pnote, phint, pratenote, memo, date):
    p = f'tools/design_a/{key}.py'; s = open(p, encoding='utf-8').read()
    lit = "\n 'inhint':" in s or s.lstrip().startswith("m = {")
    if lit:
        if "'P':" in s: raise SystemExit('P already in ' + key)
        anchor = "\n 'inhint':"
        s = s.replace(anchor, f"\n 'P': [{pstr}],\n 'pnote': {pnote!r},\n 'phint': {phint!r},\n 'pratenote': {pratenote!r}," + anchor, 1)
        s = re.sub(r"\n 'memo': \([^\n]*\),", lambda _: f"\n 'memo': ({date!r}, {memo!r}),", s, count=1)
    else:
        if "\n  P=[" in s: raise SystemExit('P already in ' + key)
        anchor = "\n  datanote=" if "\n  datanote=" in s else "\n  inhint="
        s = s.replace(anchor, f"\n  P=[{pstr}],\n  pnote={pnote!r},\n  phint={phint!r},\n  pratenote={pratenote!r}," + anchor, 1)
        s = re.sub(r"\n  memo=\([^\n]*\),", lambda _: f"\n  memo=({date!r}, {memo!r}),", s, count=1)
    open(p, 'w', encoding='utf-8').write(s)
    print('ok', key)


def addList(key, name, items, memo, date, extra=None):
    """X や P のリストに項目を足す（なければ作る）。items は dict(...) の文字列。extra は {'pnote': '...'} など、無いときだけ足すキー"""
    p = f'tools/design_a/{key}.py'; s = open(p, encoding='utf-8').read()
    lit = "\n 'inhint':" in s
    pat = re.compile(r"\n( ?'" + name + r"': \[|  " + name + r"=\[)")
    mm = pat.search(s)
    if mm:
        at = mm.end()
        s = s[:at] + items + ",\n     " + s[at:]
    else:
        if lit:
            s = s.replace("\n 'inhint':", f"\n '{name}': [{items}]," + "\n 'inhint':", 1)
        else:
            anchor = "\n  datanote=" if "\n  datanote=" in s else "\n  inhint="
            s = s.replace(anchor, f"\n  {name}=[{items}]," + anchor, 1)
    for k2, v in (extra or {}).items():
        if (f"\n '{k2}':" in s) or (f"\n  {k2}=" in s):
            continue
        if lit:
            s = s.replace("\n 'inhint':", f"\n '{k2}': {v!r}," + "\n 'inhint':", 1)
        else:
            anchor = "\n  datanote=" if "\n  datanote=" in s else "\n  inhint="
            s = s.replace(anchor, f"\n  {k2}={v!r}," + anchor, 1)
    if lit:
        s = re.sub(r"\n 'memo': \([^\n]*\),", lambda _: f"\n 'memo': ({date!r}, {memo!r}),", s, count=1)
    else:
        s = re.sub(r"\n  memo=\([^\n]*\),", lambda _: f"\n  memo=({date!r}, {memo!r}),", s, count=1)
    open(p, 'w', encoding='utf-8').write(s)
    print('ok', key, name)
