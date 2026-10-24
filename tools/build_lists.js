// トップ（index.html）と全機種一覧（list/index.html）の機種リストを静的HTMLとして書き込む（検索エンジン・JS無し向け）。
// 使い方：リポジトリのルートで  node tools/build_lists.js [YYYY-MM-DD]
// machines.js を変えたら必ず実行する。日付を省くと今日（日本時間）で「新台」を判定する。
const fs = require('fs'), vm = require('vm'), path = require('path');
const R = path.join(__dirname, '..');
const ctx = { console }; ctx.globalThis = ctx; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(R, 'machines.js'), 'utf8') + '\n;this.MACHINES=MACHINES;this.SERIES=SERIES;this.MAKER_GROUP=MAKER_GROUP;', ctx);
vm.runInContext(fs.readFileSync(path.join(R, 'lists.js'), 'utf8'), ctx);
const day = process.argv[2] || new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10);
const today = new Date(day + 'T12:00:00+09:00');
const put = (s, tag, html) => {
  const re = new RegExp('<!--' + tag + '-->[\\s\\S]*?<!--/' + tag + '-->');
  if (!re.test(s)) throw new Error('marker not found: ' + tag);
  return s.replace(re, () => '<!--' + tag + '-->' + html + '<!--/' + tag + '-->');
};
const t = ctx.SSList.renderTop(today), l = ctx.SSList.renderList();
let top = fs.readFileSync(path.join(R, 'index.html'), 'utf8');
top = put(top, 'NEW', '\n' + t.newHtml + '\n');
top = put(top, 'HOT', '\n' + t.hotHtml + '\n');
top = put(top, 'ALL', `全機種一覧を見る（${t.total}機種・メーカー別）`);
fs.writeFileSync(path.join(R, 'index.html'), top);
let ls = fs.readFileSync(path.join(R, 'list/index.html'), 'utf8');
ls = put(ls, 'COUNT', `設定判別できる${l.total}機種`);
ls = put(ls, 'JUMP', l.jump);
ls = put(ls, 'LIST', '\n' + l.body + '\n');
fs.writeFileSync(path.join(R, 'list/index.html'), ls);
console.log('基準日', day, '新台', t.newCount, '全', t.total);
// 各機種ページ下の「ほかの機種の設定判別」リンクも作り直す
require('./build_related.js');
