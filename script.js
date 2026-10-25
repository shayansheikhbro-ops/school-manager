
        const K = 'school_manager_v1', MN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let db; try {db = JSON.parse(localStorage.getItem(K))} catch (e) { }
        db = db || {school: '', setup: false, classes: ['Play Group', 'Nursery', 'Prep', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'], students: [], teachers: [], sAtt: {}, tAtt: {}, fees: []};
        const save = () => {try {localStorage.setItem(K, JSON.stringify(db))} catch (e) {toast('Could not save')} };
        const $ = s => document.querySelector(s), val = id => $('#' + id).value.trim();
        const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
        const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
        const today = () => {const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')};
        const money = n => 'Rs ' + Number(n || 0).toLocaleString('en-US');
        const opts = (a, s) => a.map(x => `<option value="${esc(x.v ?? x)}" ${(x.v ?? x) == s ? 'selected' : ''}>${esc(x.t ?? x)}</option>`).join('');
        const name = () => db.school || 'Your School Name';
        const col = s => `hsl(${[...s].reduce((a, c) => a + c.charCodeAt(0) * 7, 0) % 360} 60% 50%)`;
        const av = n => `<div class="av" style="--c:${col(n)}">${esc((n || '?').trim()[0]?.toUpperCase())}</div>`;
        function toast(m) {const t = $('#t'); t.textContent = m; t.classList.add('on'); clearTimeout(toast.i); toast.i = setTimeout(() => t.classList.remove('on'), 2200)}
        function modal(h) {$('#m').innerHTML = `<div class="ov" onclick="if(event.target==this)closeM()"><div class="md">${h}</div></div>`}
        const closeM = () => $('#m').innerHTML = '';
        const pages = [['dash', '🏠', 'Home'], ['stu', '🎒', 'Students'], ['tea', '👩‍🏫', 'Teachers'], ['att', '✅', 'Attendance'], ['fee', '💰', 'Fees'], ['set', '⚙️', 'Settings']];
        let page = 'dash', selCls = '', attDate = today(), attTab = 's', filt = '';
        function go(p) {
            page = p; $('#nav').innerHTML = pages.map(([k, i, t]) => `<button class="${k == p ? 'on' : ''}" onclick="go('${k}')"><span>${i}</span>${t}</button>`).join('');
            $('#sn').innerHTML = esc(name()) + '<small>School Manager</small>'; $('#cr').textContent = (db.school || 'S')[0].toUpperCase(); document.title = name();
            const v = $('#v'); v.style.animation = 'none'; v.offsetHeight; v.style.animation = ''; v.innerHTML = R[p](); count(); scrollTo(0, 0)
        }
        function count() {document.querySelectorAll('[data-n]').forEach(e => {const to = +e.dataset.n, pre = e.dataset.p || '', t0 = performance.now(); (function f(t) {const k = Math.min(1, (t - t0) / 1000), x = 1 - Math.pow(1 - k, 3); e.textContent = pre + Math.round(to * x).toLocaleString('en-US'); if (k < 1) requestAnimationFrame(f)})(t0)})}
        const stat = (i, l, n, b, p) => `<div class="stat"><div class="ico" style="--b:${b}">${i}</div><div><small>${l}</small><div class="n" data-n="${n}" data-p="${p || ''}">0</div></div></div>`;
        const sOf = id => db.students.find(s => s.id == id);
        const pct = (att, id) => {let t = 0, p = 0; for (const d in att) {const x = att[d][id]; if (x) {t++; if (x == 'P') p++} } return t ? Math.round(p / t * 100) : null};
        const ym = d => d.slice(0, 7);
        function mkeys(a, b) {const o = []; let [y, m] = a.split('-').map(Number); while ((y + '-' + String(m).padStart(2, '0')) <= b && o.length < 120) {o.push(y + '-' + String(m).padStart(2, '0')); if (++m > 12) {m = 1; y++} } return o}
        function dueOf(s) {const paid = new Set(db.fees.filter(f => f.sid == s.id).map(f => f.month)); const ks = mkeys(ym(s.date), ym(today())).filter(k => !paid.has(k)); return {n: ks.length, amt: ks.length * s.fee}}
        const empty = (i, t) => `<div class="empty"><big>${i}</big>${t}</div>`;

        const R = {
            dash() {
                const td = today(), m = ym(td), sa = db.sAtt[td] || {}, vals0 = Object.values(sa), pr = vals0.filter(x => x == 'P').length, rate = vals0.length ? Math.round(pr / vals0.length * 100) : 0;
                const ta = Object.values(db.tAtt[td] || {}).filter(x => x == 'P').length;
                const total = db.fees.reduce((a, f) => a + +f.amt, 0), mon = db.fees.filter(f => f.date.startsWith(m)).reduce((a, f) => a + +f.amt, 0);
                const due = db.students.map(s => ({s, ...dueOf(s)})).filter(x => x.n), dueAmt = due.reduce((a, x) => a + x.amt, 0);
                const ms = mkeys(ym(new Date(new Date().getFullYear(), new Date().getMonth() - 5, 1).toISOString()), m);
                const vals = ms.map(k => db.fees.filter(f => f.date.startsWith(k)).reduce((a, f) => a + +f.amt, 0)), mx = Math.max(...vals, 1);
                const rec = [...db.fees].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
                const h = new Date().getHours();
                return `<div class="hero"><div><p>${h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'} 👋</p><h1>${esc(name())}</h1><p>${new Date().toLocaleDateString('en-GB', {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'})}</p></div>
 <div class="ring"><svg width="100%" height="100%" viewBox="0 0 100 100"><circle class="bg" cx="50" cy="50" r="42"/><circle class="fg" cx="50" cy="50" r="42" style="--o:${264 - 264 * rate / 100}"/></svg><b>${rate}%</b><small>present today</small></div></div>
 <div class="grid">${stat('🎒', 'Students', db.students.length, '#ecebff')}${stat('👩‍🏫', 'Teachers', db.teachers.length, '#dcf7ef')}${stat('💵', 'This month', mon, '#fff1d6', 'Rs ')}${stat('🏦', 'Total income', total, '#e3f0ff', 'Rs ')}${stat('⏳', 'Fee due', dueAmt, '#ffe9e6', 'Rs ')}${stat('🧑‍🏫', 'Teachers in today', ta, '#dcf7ef')}</div>
 <div class="card"><h3>Income, last 6 months</h3><div class="bars">${vals.map((v, i) => `<div class="bar">${v ? Math.round(v / 1000 * 10) / 10 + 'k' : ''}<i style="--h:${Math.max(v / mx * 85, 2)}%;animation-delay:${i * .1}s"></i>${MN[+ms[i].slice(5) - 1]}</div>`).join('')}</div></div>
 <div class="card"><h3>Recent payments</h3>${rec.length ? rec.map(f => `<div class="item" onclick="prof('${f.sid}')">${av(sOf(f.sid)?.name)}<div class="t"><b>${esc(sOf(f.sid)?.name || '(deleted)')}</b><small>${f.month} · ${f.date}</small></div><span class="tag m">${money(f.amt)}</span></div>`).join('') : empty('💸', 'No payments yet')}</div>
 <div class="card"><h3>Fee due</h3>${due.length ? due.slice(0, 8).map(x => `<div class="item" onclick="prof('${x.s.id}')">${av(x.s.name)}<div class="t"><b>${esc(x.s.name)}</b><small>${esc(x.s.cls)} · ${x.n} month(s)</small></div><span class="tag r">${money(x.amt)}</span></div>`).join('') : empty('🎉', 'No dues')}</div>`
            },

            stu() {
                const q = (window.sq || '').toLowerCase(), L = db.students.filter(s => (s.name + s.father + s.cls + s.phone).toLowerCase().includes(q));
                return `<h2>Students & Admissions</h2><div class="card"><h3>New admission</h3><div class="row">
 <label>Student name<input id="a1"></label><label>Father's name<input id="a2"></label><label>Class<select id="a3">${opts(db.classes)}</select></label>
 <label>Phone<input id="a4" type="tel"></label><label>Monthly fee (Rs)<input id="a5" type="number"></label><label>Admission date<input id="a6" type="date" value="${today()}"></label>
 <button class="btn" onclick="addS()">Save admission</button></div></div>
 <div class="card"><div class="row" style="margin-bottom:8px"><h3 style="margin:0;flex:1">All students (${L.length})</h3><label style="flex:1 1 200px"><input id="sq" placeholder="🔍 Search" value="${esc(window.sq || '')}" oninput="window.sq=this.value;const p=this.selectionStart;go('stu');const i=$('#sq');i.focus();i.setSelectionRange(p,p)"></label></div>
 ${L.length ? L.map((s, i) => {const d = dueOf(s); return `<div class="item" style="animation-delay:${Math.min(i, 10) * .04}s" onclick="prof('${s.id}')">${av(s.name)}<div class="t"><b>${esc(s.name)}</b><small>${esc(s.father)} · ${esc(s.phone)}</small></div><span class="tag">${esc(s.cls)}</span><span class="tag ${d.n ? 'r' : 'm'}">${d.n ? 'Due ' + money(d.amt) : 'Paid up'}</span></div>`}).join('') : empty('🎒', 'No students yet. Add the first admission above.')}</div>`
            },

            tea() {
                return `<h2>Teachers & Timings</h2><div class="card"><h3>New teacher</h3><div class="row">
 <label>Name<input id="t1"></label><label>Subject<input id="t2"></label><label>Class<select id="t3">${opts(db.classes)}</select></label>
 <label>Start time<input id="t4" type="time" value="08:00"></label><label>End time<input id="t5" type="time" value="13:00"></label>
 <label>Phone<input id="t6" type="tel"></label><label>Monthly salary (Rs)<input id="t7" type="number"></label>
 <button class="btn" onclick="addT()">Save teacher</button></div></div>
 <div class="card"><h3>All teachers (${db.teachers.length})</h3>${db.teachers.length ? db.teachers.map(t => {const p = pct(db.tAtt, t.id); return `<div class="item">${av(t.name)}<div class="t"><b>${esc(t.name)}</b><small>${esc(t.subject)} · ${t.from} to ${t.to} · ${esc(t.phone)}</small></div><span class="tag">${esc(t.cls)}</span><span class="tag m">${money(t.salary)}</span><span class="tag">${p == null ? 'No attendance' : p + '% present'}</span><button class="btn d" onclick="delT('${t.id}')">Delete</button></div>`}).join('') : empty('👩‍🏫', 'No teachers yet.')}</div>`
            },

            att() {
                selCls = selCls || db.classes[0]; const S = attTab == 's', L = S ? db.students.filter(s => s.cls == selCls) : db.teachers, A = (S ? db.sAtt : db.tAtt)[attDate] || {};
                const c = k => L.filter(x => A[x.id] == k).length;
                return `<h2>Attendance</h2><div class="tabs"><button class="${S ? 'on' : ''}" onclick="attTab='s';go('att')">Students</button><button class="${S ? '' : 'on'}" onclick="attTab='t';go('att')">Teachers</button></div>
 <div class="card"><div class="row"><label>Date<input type="date" value="${attDate}" onchange="attDate=this.value;go('att')"></label>
 ${S ? `<label>Class<select onchange="selCls=this.value;go('att')">${opts(db.classes, selCls)}</select></label>` : ''}
 <button class="btn g" onclick="markAll('P')">Mark all present</button></div>
 <div style="margin:12px 0"><span class="tag m">Present ${c('P')}</span> <span class="tag r">Absent ${c('A')}</span> <span class="tag">Leave ${c('L')}</span></div>
 ${L.length ? L.map(x => `<div class="item" style="cursor:default">${av(x.name)}<div class="t"><b>${esc(x.name)}</b><small>${esc(S ? x.father : x.subject)}</small></div><span class="seg">${[['P', 'Present'], ['A', 'Absent'], ['L', 'Leave']].map(([k, t]) => `<button class="${k} ${A[x.id] == k ? 'on' : ''}" onclick="mark('${x.id}','${k}')">${t}</button>`).join('')}</span></div>`).join('') : empty('📋', S ? 'No students in this class.' : 'Add teachers first.')}</div>`
            },

            fee() {
                const y = new Date().getFullYear() + '', total = db.fees.reduce((a, f) => a + +f.amt, 0), yr = db.fees.filter(f => f.date.startsWith(y)).reduce((a, f) => a + +f.amt, 0);
                let fs = [...db.fees].sort((a, b) => b.date.localeCompare(a.date)); if (filt) fs = fs.filter(f => f.month == filt);
                const mset = [...new Set(db.fees.map(f => f.month))].sort().reverse();
                return `<h2>Fees & Income</h2><div class="grid">${stat('🏦', 'Total income', total, '#e3f0ff', 'Rs ')}${stat('📅', 'This year', yr, '#fff1d6', 'Rs ')}${stat('🧾', 'Receipts', db.fees.length, '#ecebff')}</div>
 <div class="card"><h3>Collect fee</h3><div class="row"><label>Student<select id="f1" onchange="fillFee()">${opts(db.students.map(s => ({v: s.id, t: s.name + ' (' + s.cls + ')'})))}</select></label>
 <label>For month<input id="f2" type="month" value="${ym(today())}"></label><label>Amount (Rs)<input id="f3" type="number" value="${db.students[0]?.fee || ''}"></label>
 <button class="btn" onclick="addF()">Collect fee</button></div></div>
 <div class="card"><div class="row" style="margin-bottom:8px"><h3 style="margin:0;flex:1">Receipts</h3><label style="flex:1 1 160px"><select onchange="filt=this.value;go('fee')"><option value="">All months</option>${opts(mset, filt)}</select></label></div>
 ${fs.length ? fs.map(f => `<div class="item" style="cursor:default">${av(sOf(f.sid)?.name)}<div class="t"><b>${esc(sOf(f.sid)?.name || '(deleted)')}</b><small>Month ${f.month} · paid on ${f.date}</small></div><span class="tag m">${money(f.amt)}</span><button class="btn d" onclick="delF('${f.id}')">Delete</button></div>`).join('') : empty('🧾', 'No fee receipts yet.')}</div>`
            },

            set() {
                return `<h2>Settings & Backup</h2><div class="card"><h3>School name</h3><div class="row"><label><input id="s1" value="${esc(db.school)}" placeholder="Enter school name"></label><button class="btn" onclick="db.school=val('s1');db.setup=true;save();go('set');toast('Saved ✓')">Save</button></div></div>
 <div class="card"><h3>Classes</h3><div class="row"><label><input id="s2" placeholder="New class name"></label><button class="btn" onclick="const c=val('s2');if(c&&!db.classes.includes(c)){db.classes.push(c);save();go('set')}">Add class</button></div><p>${db.classes.map(c => `<span class="tag">${esc(c)}</span>`).join(' ')}</p></div>
 <div class="card"><h3>Backup</h3><p style="color:var(--mut);margin-top:0">All data is stored only on this device, never online. Download a backup regularly because clearing browser data can erase it.</p>
 <div class="row"><button class="btn" onclick="backup()">Download backup</button><label>Restore backup<input type="file" accept=".json" onchange="restore(this.files[0])"></label></div></div>`}
        };

        function prof(id) {
            const s = sOf(id); if (!s) return; const Y = new Date().getFullYear(), cur = ym(today()), am = ym(s.date), paid = new Set(db.fees.filter(f => f.sid == id).map(f => f.month)), d = dueOf(s), p = pct(db.sAtt, id);
            const tot = db.fees.filter(f => f.sid == id).reduce((a, f) => a + +f.amt, 0), hist = db.fees.filter(f => f.sid == id).sort((a, b) => b.date.localeCompare(a.date));
            modal(`<div class="item" style="cursor:default;padding:0">${av(s.name)}<div class="t"><b style="font-size:18px">${esc(s.name)}</b><small>${esc(s.father)} · ${esc(s.cls)} · ${esc(s.phone)}</small></div><button class="btn g" onclick="closeM()">✕</button></div>
 <div class="mini"><div><b>${money(tot)}</b><small>Total paid</small></div><div><b>${money(d.amt)}</b><small>Due</small></div><div><b>${p == null ? '–' : p + '%'}</b><small>Attendance</small></div></div>
 <small style="color:var(--mut)">Fee status ${Y} · ${money(s.fee)} per month</small>
 <div class="months">${MN.map((n, i) => {const k = Y + '-' + String(i + 1).padStart(2, '0'); return `<div class="mo ${paid.has(k) ? 'p' : (k >= am && k <= cur ? 'u' : '')}">${n}<br>${paid.has(k) ? '✓' : (k >= am && k <= cur ? 'due' : '')}</div>`}).join('')}</div>
 <div class="row"><label>Month<input id="pm" type="month" value="${cur}"></label><label>Amount<input id="pa" type="number" value="${s.fee}"></label><button class="btn" onclick="addF2('${id}')">Collect</button></div>
 <p style="margin:14px 0 4px"><b>Payment history</b></p>${hist.length ? hist.map(f => `<div class="item" style="cursor:default;padding:6px 8px"><div class="t"><b>${f.month}</b><small>${f.date}</small></div><span class="tag m">${money(f.amt)}</span></div>`).join('') : '<small style="color:var(--mut)">No payments yet.</small>'}
 <p style="text-align:right"><button class="btn d" onclick="delS('${id}')">Delete student</button></p>`)
        }
        function fillFee() {const s = sOf($('#f1').value); if (s) $('#f3').value = s.fee}
        function mark(id, k) {const o = attTab == 's' ? db.sAtt : db.tAtt; (o[attDate] = o[attDate] || {})[id] = k; save(); const y = scrollY; go('att'); scrollTo(0, y)}
        function markAll(k) {const S = attTab == 's', o = S ? db.sAtt : db.tAtt, L = S ? db.students.filter(s => s.cls == selCls) : db.teachers; o[attDate] = o[attDate] || {}; L.forEach(x => o[attDate][x.id] = k); save(); go('att'); toast('Marked ✓')}
        function addS() {const n = val('a1'); if (!n) return toast('Enter student name'); db.students.push({id: uid(), name: n, father: val('a2'), cls: val('a3'), phone: val('a4'), fee: +val('a5') || 0, date: val('a6') || today()}); save(); go('stu'); toast('Admission saved ✓'); confetti()}
        function delS(id) {if (confirm('Delete this student and keep past receipts?')) {db.students = db.students.filter(s => s.id != id); save(); closeM(); go(page)} }
        function addT() {const n = val('t1'); if (!n) return toast('Enter teacher name'); db.teachers.push({id: uid(), name: n, subject: val('t2'), cls: val('t3'), from: val('t4'), to: val('t5'), phone: val('t6'), salary: +val('t7') || 0}); save(); go('tea'); toast('Teacher saved ✓')}
        function delT(id) {if (confirm('Delete this teacher?')) {db.teachers = db.teachers.filter(t => t.id != id); save(); go('tea')} }
        function pay(s, m, a) {if (!s || !a || !m) return toast('Choose student, month and amount'), false; if (db.fees.some(f => f.sid == s && f.month == m) && !confirm('This month is already paid. Collect again?')) return false; db.fees.push({id: uid(), sid: s, month: m, amt: a, date: today()}); save(); toast('Fee collected ✓'); confetti(); return true}
        function addF() {if (pay(val('f1'), val('f2'), +val('f3'))) go('fee')}
        function addF2(id) {if (pay(id, val('pm'), +val('pa'))) {prof(id); go(page)} }
        function delF(id) {if (confirm('Delete this receipt?')) {db.fees = db.fees.filter(f => f.id != id); save(); go('fee')} }
        function backup() {const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(db)], {type: 'application/json'})); a.download = 'school-backup-' + today() + '.json'; a.click()}
        function restore(f) {if (!f) return; const r = new FileReader(); r.onload = () => {try {const d = JSON.parse(r.result); if (!d.students) throw 0; db = d; save(); go('dash'); toast('Backup restored ✓')} catch (e) {toast('Invalid backup file')} }; r.readAsText(f)}
        function welcome() {modal(`<div class="welcome"><div class="crest">🏫</div><h2>Welcome!</h2><p style="color:var(--mut)">Let's set up your school. You can change this any time in Settings.</p><label style="text-align:left">School name<input id="w1" placeholder="e.g. Your School Name"></label><p><button class="btn" onclick="db.school=val('w1');db.setup=true;save();closeM();go('dash')">Get started</button> <button class="btn g" onclick="db.setup=true;save();closeM()">Skip for now</button></p></div>`)}

        function confetti() {const c = ['#5b4bdb', '#ff6b5b', '#17b890', '#ffb938', '#8a5cf0']; for (let i = 0; i < 50; i++) {const e = document.createElement('i'); e.className = 'cf'; e.style.cssText = `left:${Math.random() * 100}vw;background:${c[i % 5]};animation-duration:${1.6 + Math.random() * 1.4}s;animation-delay:${Math.random() * .4}s;border-radius:${i % 2 ? '50%' : '2px'}`; document.body.appendChild(e); setTimeout(() => e.remove(), 3700)} }
        document.addEventListener('pointerdown', e => {const b = e.target.closest('.btn,nav button,.seg button,.tabs button'); if (!b) return; const r = b.getBoundingClientRect(), z = Math.max(r.width, r.height) * 2, x = document.createElement('span'); x.className = 'rp'; x.style.cssText = `width:${z}px;height:${z}px;left:${e.clientX - r.left - z / 2}px;top:${e.clientY - r.top - z / 2}px`; b.appendChild(x); setTimeout(() => x.remove(), 650)});
        document.addEventListener('pointermove', e => {if (e.pointerType != 'mouse') return; const c = e.target.closest?.('.stat'); if (!c) return; const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; c.style.transform = `perspective(600px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) translateY(-4px)`});
        document.addEventListener('pointerout', e => {const c = e.target.closest?.('.stat'); if (c) c.style.transform = ''});
        const og = go; go = function (p) {og(p); document.querySelectorAll('.grid>*').forEach((e, i) => e.style.animationDelay = (.2 + i * .08) + 's')};
        document.body.insertAdjacentHTML('afterbegin', '<div class="blobs"><i></i><i></i><i></i></div>');
        const nm = db.school || 'School Manager';
        document.body.insertAdjacentHTML('beforeend', `<div id="sp"><div><div class="lg">🏫</div><h1>${[...nm].map((c, i) => `<span style="animation-delay:${.4 + i * .05}s">${esc(c)}</span>`).join('')}</h1><p>Smart school management</p><div class="pb"><i></i></div></div></div>`);
        setTimeout(() => $('#sp').classList.add('out'), 2300); setTimeout(() => $('#sp').remove(), 3100);
        go('dash'); if (!db.setup) setTimeout(welcome, 2300);

  