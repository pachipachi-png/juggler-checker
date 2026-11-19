# 画面系（終了画面・アイキャッチなど）の早見表。genA（判別ページ）と genS（画面ページ）の共通部品。
# m['screens'] = dict(
#   groups=[dict(h='終了画面', short='終了画面', src=(url, label), note='', inline=True,
#                items=[(img, name, mean, kind, check)])],
#   copyimg=url, page=True, lead='', pnote='')
# kind: k=設定濃厚（こちらのボタンと一致。黄色・タップ連動） s=設定示唆（期待度アップ） m=モード・状態の示唆
#       n=否定・推察 u=調査中 d=デフォルト
# 旧形式（title/src/items を直接持つ）も読める。
KLAB = {'k': '設定濃厚', 's': '設定示唆', 'm': 'モード・状態', 'n': '推察', 'u': '調査中', 'd': 'デフォルト'}


def groups(S):
    if 'groups' in S:
        return S['groups']
    return [dict(h=S.get('title', '終了画面の早見表').replace('の早見表', ''), short='終了画面', src=S['src'],
                 note=S.get('note', ''), inline=True, items=S['items'])]


def names(S):
    out = []
    for g in groups(S):
        if g.get('short', g['h']) not in out:
            out.append(g.get('short', g['h']))
    return '・'.join(out)


def cards(g, short, link=True):
    h = ''
    for img, nm, mean, kind, ck in g['items']:
        dc = f' data-check="{ck}" role="button" tabindex="0"' if (ck and link) else ''
        h += (f'        <figure class="scr k-{kind}"{dc}><img src="{img}" alt="{short} {g["h"]} {nm}（{mean}）" '
              f'loading="lazy" width="280" height="224"><figcaption><span class="sn">{nm}</span>'
              f'<span class="sm">{mean}</span></figcaption></figure>\n')
    return h


def block(S, short, page_link='', only_inline=False, link=True, hid='screens'):
    """早見表のHTML。only_inline=True なら inline のグループだけ（判別ページ用）。"""
    gs = groups(S)
    shown = [g for g in gs if g.get('inline', g is gs[0])] if only_inline else gs
    hidden = [g for g in gs if g not in shown]
    out = ''
    for i, g in enumerate(shown):
        idattr = f' id="{hid}"' if i == 0 else ''
        sub = '黄色＝タップで絞り込み' if (link and any(it[3] == 'k' and it[4] for it in g['items'])) else '画像で確認'
        out += f'''    <div class="sh"{idattr}><h2>{g['h']}の早見表</h2><small>{sub}</small></div>
    <div class="scrgrid">
{cards(g, short, link)}    </div>
    <p class="scrnote">{g.get('note', '')}画像の出典：<a href="{g['src'][0]}" target="_blank" rel="noopener">{g['src'][1]}</a></p>
'''
    if page_link:
        more = '・'.join(g.get('short', g['h']) for g in hidden)
        txt = f'{more}も見る（画像つきの一覧ページ）→' if more else f'{names(S)}だけのページ →'
        out += f'    <a class="scrmore" href="{page_link}">{txt}</a>\n'
    if S.get('copytext'):
        out += f'''    <p class="scrcopyt">{S['copytext']}</p>\n'''
    if S.get('copyimg'):
        out += f'''    <img class="scrcopy" src="{S['copyimg']}" alt="コピーライト表記" loading="lazy">\n'''
    return out


CSS = '''  .scrgrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:4px 0 6px;}
  .scr{margin:0;background:#1b1a17;border:1px solid #3a3a3e;border-radius:4px;overflow:hidden;}
  .scr[data-check]{cursor:pointer;}
  .scr img{display:block;width:100%;height:auto;aspect-ratio:5/4;object-fit:cover;background:#111;font-size:11px;color:var(--muted);}
  .scr figcaption{padding:5px 6px 6px;display:flex;flex-direction:column;gap:1px;}
  .scr .sn{font-size:12.5px;font-weight:700;line-height:1.3;}
  .scr .sm{font-size:12px;color:var(--muted);line-height:1.3;}
  .scr.k-k .sm{color:var(--amber);font-weight:700;}
  .scr.k-m .sm{color:#8fb7d9;}
  .scr.on{border-color:var(--amber);box-shadow:0 0 0 2px var(--amber) inset;}
  .scr.on .sn::after{content:"  ✓ 絞り込み中";color:var(--amber);font-size:11px;}
  .scrnote{font-size:11.5px;color:var(--muted);margin:2px 0 10px;}
  .scrnote a{color:var(--muted);}
  .scrmore{display:block;margin:4px 0 10px;padding:9px 10px;border:1px solid #3a3a3e;border-radius:4px;color:var(--fg,#eee);font-size:13px;font-weight:700;text-decoration:none;text-align:center;}
  .scrcopyt{font-size:10.5px;color:var(--muted);margin:0 0 14px;}
  .scrcopy{display:block;max-width:100%;height:auto;background:#fff;border-radius:3px;margin:0 0 14px;}
'''
