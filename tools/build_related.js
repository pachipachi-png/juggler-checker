// 各機種ページの下に「ほかの機種の設定判別」リンク（内部リンク）を書き込む（SEO用・JS無しでも見える静的HTML）。
// 使い方：リポジトリのルートで  node tools/build_related.js   （tools/build_lists.js の最後でも自動で実行される）
// 選び方：同じメーカーの機種 → 話題順（hot の小さい順）で、自分を除いて最大 MAX 件。最後に全機種一覧へのリンク。
// 置き場所：<!--RELATED-->…<!--/RELATED--> があれば中身を入れ替え、無ければ最初の <div class="ad-slot"> の直前に足す。
const fs = require('fs'), vm = require('vm'), path = require('path');
const R = path.join(__dirname, '..');
const MAX = 8;
const ctx = {}; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(R, 'machines.js'), 'utf8') + '\n;this.MACHINES=MACHINES;', ctx);
const all = ctx.MACHINES.filter(m => m.status === 'ready' && m.path && /^[a-z0-9-]+\/$/.test(m.path));
const byHot = [...all].sort((a, b) => (a.hot ?? 99) - (b.hot ?? 99));
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function block(self) {
  const picked = [];
  const push = m => { if (m.path !== self.path && !picked.includes(m) && picked.length < MAX) picked.push(m); };
  byHot.filter(m => self.maker && m.maker === self.maker).forEach(push);
  byHot.forEach(push);
  const items = picked.map(m => `<li><a href="../${m.path}">${esc(m.name)}</a></li>`).join('');
  return `<!--RELATED-->
  <nav class="card rel" aria-label="ほかの機種の設定判別">
    <style>.rel h2{font-size:15px;margin:0 0 10px;}.rel ul{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:6px 12px;}.rel li a{display:block;padding:8px 10px;border:1px solid var(--line);border-radius:8px;color:var(--text);text-decoration:none;font-size:13px;line-height:1.4;}.rel .rel-all{display:block;margin-top:12px;text-align:center;font-size:13.5px;font-weight:700;color:var(--teal);text-decoration:none;}@media (max-width:360px){.rel ul{grid-template-columns:1fr;}}</style>
    <h2>ほかの機種の設定判別</h2>
    <ul>${items}</ul>
    <a class="rel-all" href="../list/">全機種一覧（${all.length}機種）を見る →</a>
  </nav>
  <!--/RELATED-->`;
}

let done = 0, skipped = [];
for (const m of all) {
  const f = path.join(R, m.path, 'index.html');
  if (!fs.existsSync(f)) { skipped.push(m.path + '（ファイルなし）'); continue; }
  let s = fs.readFileSync(f, 'utf8');
  const html = block(m);
  const re = /<!--RELATED-->[\s\S]*?<!--\/RELATED-->/;
  if (re.test(s)) s = s.replace(re, () => html);
  else if (s.includes('<div class="ad-slot">')) s = s.replace('<div class="ad-slot">', () => html + '\n\n  <div class="ad-slot">');
  else { skipped.push(m.path + '（ad-slot なし）'); continue; }
  fs.writeFileSync(f, s);
  done++;
}
console.log('内部リンク', done, 'ページ', skipped.length ? '／スキップ: ' + skipped.join(', ') : '');
