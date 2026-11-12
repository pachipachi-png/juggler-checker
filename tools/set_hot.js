// 「よく見られている台」の並び（machines.js の hot）を、アクセスの多い順に付け直す。
// 使い方：リポジトリのルートで  node tools/set_hot.js milliongod/ karakuri2/ mahoako/ ...
//   引数＝直近7日のページ別表示回数（GA4「ページとスクリーン」）の多い順に並べた機種のパス。
//   書いた順に hot=1,2,3… を付け、書かなかった機種は今の並びのまま後ろに回す。最後に node tools/build_lists.js を実行すること。
// 週1回（月曜の X週次ふりかえり）で実行する（2026-11-01 オーナー決定）。
// 並べる順：ジャグラー（先頭固定）→ スロベース「よく見られている機種TOP10」のうちページがある機種（機種リストDocの人気順位）→ 残りはGA4の表示回数順（2026-11-13 オーナー決定）。
const fs = require('fs'), path = require('path');
const F = path.join(__dirname, '..', 'machines.js');
let s = fs.readFileSync(F, 'utf8');
const order = process.argv.slice(2).map(p => p.replace(/^\/+/, '').replace(/([^/])$/, '$1/'));
const re = /path: '([^']+)',([\s\S]*?)hot: (\d+)/g;
const cur = [];
let m;
while ((m = re.exec(s))) cur.push({ path: m[1], hot: +m[3] });
const unknown = order.filter(p => !cur.some(c => c.path === p));
if (unknown.length) { console.error('machines.js にない:', unknown.join(' ')); process.exit(1); }
const rest = cur.filter(c => !order.includes(c.path)).sort((a, b) => a.hot - b.hot);
const next = {};
order.forEach((p, i) => { next[p] = i + 1; });
rest.forEach((c, i) => { next[c.path] = order.length + 1 + i; });
s = s.replace(re, (all, p, mid) => `path: '${p}',${mid}hot: ${next[p]}`);
fs.writeFileSync(F, s);
console.log('hot を付け直した：', order.map((p, i) => `${i + 1}.${p}`).join(' '));
