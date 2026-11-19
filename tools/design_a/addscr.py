# 使い方: addscr.py <key> で、このファイル内 DATA[key] を <key>.py の screens に書き込む（既存の screens は置き換え）
import sys, pprint, re
I = 'https://images.1geki.jp/machines/slot/'
def G(h, slug, page, items, note='', inline=None, short=None, label=None):
    it = [(f'{I}{slug}/{f}.png?f=webp', nm, mean, k, ck) for f, nm, mean, k, ck in items]
    d = dict(h=h, short=short or h, src=(f'https://1geki.jp/slot/{slug}/{page}/', label or f'1geki（{h}）'), note=note, items=it)
    if inline is not None: d['inline'] = inline
    return d
DATA = {}
exec(open(sys.argv[2], encoding='utf-8').read()) if len(sys.argv) > 2 else None
key = sys.argv[1]
S = DATA[key]
p = f'tools/design_a/{key}.py'
s = open(p, encoding='utf-8').read()
blk = "  screens=" + pprint.pformat(S, width=220, sort_dicts=False) + ",\n"
if re.search(r"^\s*'?screens'?\s*[=:]", s, re.M):
    raise SystemExit('screens already exists in ' + p)
# dict(...) 形式と {'k':...} 形式の両方に対応して hintlink の直前に入れる
if "\n  hintlink=" in s:
    s = s.replace("\n  hintlink=", "\n" + blk.rstrip('\n') + "\n  hintlink=", 1)
elif "\n 'hintlink':" in s:
    s = s.replace("\n 'hintlink':", "\n 'screens': " + pprint.pformat(S, width=220, sort_dicts=False) + ",\n 'hintlink':", 1)
else:
    raise SystemExit('no hintlink anchor in ' + p)
open(p, 'w', encoding='utf-8').write(s)
print('ok', key, sum(len(g['items']) for g in S['groups']))
