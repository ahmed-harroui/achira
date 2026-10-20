/* ACHIRA — maquette multi-pages : site public + dashboard.
   Les données partent de data.js ; les modifications faites dans la dashboard sont gardées dans ce navigateur. */
(function () {
  'use strict';

  var APP = document.getElementById('app');
  var PAGE = APP.dataset.page;
  var ROOT = APP.dataset.root || '';
  var KEY = 'achira-maquette-v1';
  var MARKETS_V = 'marches-95-v1';

  var LOGO = '<svg aria-hidden="true" focusable="false" viewBox="0 0 376.2 404.1" fill="currentColor"><path d="M0.1,253.8 L0.1,325.5 L22.4,309.0 L22.4,272.0 L56.4,272.0 L56.4,236.5 L110.6,277.2 L110.6,282.0 L93.4,293.5 L93.4,321.5 L68.9,321.5 L65.9,324.2 L65.9,383.8 L85.1,404.1 L88.5,404.1 L88.5,342.2 L113.1,339.5 L113.1,303.5 L127.1,291.2 L160.5,315.5 L160.5,356.0 L182.4,373.8 L182.4,308.8 L55.4,210.0 L35.9,223.8 L35.9,253.8 Z M181.9,42.5 L160.4,61.0 L160.4,92.5 L128.1,116.5 L112.9,103.0 L112.9,63.5 L87.4,60.8 L87.4,0.0 L65.9,22.2 L65.9,80.8 L93.2,80.8 L93.2,111.5 L112.1,126.2 L112.1,129.8 L56.2,173.8 L56.2,133.0 L22.4,133.0 L22.4,100.2 L0.0,83.2 L0.0,152.5 L35.6,152.5 L35.6,185.8 L55.6,199.5 L181.9,97.8 Z M376.1,253.8 L376.1,325.5 L353.9,309.0 L353.9,272.0 L319.9,272.0 L319.9,236.5 L265.6,277.2 L265.6,282.0 L282.9,293.5 L282.9,321.5 L307.4,321.5 L310.4,324.2 L310.4,383.8 L291.1,404.1 L287.8,404.1 L287.8,342.2 L263.1,339.5 L263.1,303.5 L249.1,291.2 L215.8,315.5 L215.8,356.0 L193.9,373.8 L193.9,308.8 L320.9,210.0 L340.4,223.8 L340.4,253.8 Z M194.4,42.5 L215.9,61.0 L215.9,92.5 L248.1,116.5 L263.4,103.0 L263.4,63.5 L288.9,60.8 L288.9,0.0 L310.4,22.2 L310.4,80.8 L283.0,80.8 L283.0,111.5 L264.1,126.2 L264.1,129.8 L320.0,173.8 L320.0,133.0 L353.9,133.0 L353.9,100.2 L376.2,83.2 L376.2,152.5 L340.6,152.5 L340.6,185.8 L320.6,199.5 L194.4,97.8 Z"/></svg>';

  /* ---------- Données ---------- */
  /* L'arbre des métiers et domaines (arbre.js) est la source du modèle des sides */
  var TREE_V = 'arbre-ma-1.0';
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function treeDomains() {
    var T = window.ACHIRA_ARBRE, lab = {};
    T.skills.concat(T.jobs).forEach(function (x) { lab[x.id] = x; });
    return T.domains.map(function (d, i) {
      var rel = T.relations.filter(function (r) { return r.from === d.id; });
      return { id: 'd' + (i + 1), ref: d.id, sector: d.parent_id, n: i + 1, t: d.label, tasks: d.tasks.map(function (t) { return t.label; }),
        comp: rel.filter(function (r) { return r.type === 'REQUIRES_SKILL'; }).map(function (r) { return lab[r.to].label; }),
        metiers: rel.filter(function (r) { return r.type === 'PERFORMED_BY'; }).map(function (r) { return lab[r.to].label; }) };
    });
  }
  function treePoles(domains) {
    return window.ACHIRA_ARBRE.sectors.map(function (s) {
      return { id: s.id === 'sector-finance' ? 'gestion' : 'creation', ref: s.id, t: s.label, d: domains.filter(function (d) { return d.sector === s.id; }).map(function (d) { return d.id; }) };
    });
  }
  function applyTree(db) {
    db.domains = treeDomains(); db.poles = treePoles(db.domains);
    db.pros = window.ACHIRA_ARBRE.jobs[0].engagement_modes.map(cap);
    window.ACHIRA_DATA.members.forEach(function (m) { if (!db.members.some(function (x) { return x.id === m.id; })) db.members.push(JSON.parse(JSON.stringify(m))); });
    db.treeVersion = TREE_V;
    return db;
  }

  /* Un marché du plan d'action devient un projet en brouillon ; ses sides viennent du moteur de suggestions */
  function marketProject(m, i, db) {
    return { slug: m.id.toLowerCase(), title: m.micro, sub: m.nano, disc: m.sector, place: m.city, year: 2026, phase: 'Idée', status: 'draft', featured: false,
      img: ['u-cercle-1', 'u-cercle-2', 'u-cercle-3', 'poster-achira', 'end-achira'][i % 5], story: m.probleme + '. Hypothèse : ' + m.hypothesis.toLowerCase() + '.',
      achira: false, specialite: '', market: JSON.parse(JSON.stringify(m)), sides: suggestedSides(analyzeMarket(m, db), db) };
  }
  function addMarkets(db) {
    (window.ACHIRA_MARCHES || []).forEach(function (m, i) { if (!db.projects.some(function (p) { return p.slug === m.id.toLowerCase(); })) db.projects.push(marketProject(m, i, db)); });
    db.projects.forEach(function (p) { if (p.achira === undefined) p.achira = !p.market; if (p.specialite === undefined) p.specialite = ''; });
    if (!db.settings.discord) db.settings.discord = window.ACHIRA_DATA.settings.discord;
    db.marketsVersion = MARKETS_V;
    return db;
  }
  function fresh() { return addMarkets(applyTree(JSON.parse(JSON.stringify(window.ACHIRA_DATA)))); }
  function load() {
    try {
      var s = localStorage.getItem(KEY);
      if (s) {
        var db = JSON.parse(s);
        if (db.treeVersion !== TREE_V) {
          applyTree(db);
          // les marchés encore en brouillon reprennent les sides calculés avec le nouvel arbre
          db.projects.forEach(function (p) { if (p.market && p.status === 'draft') p.sides = suggestedSides(analyzeMarket(p.market, db), db); });
        }
        return db.marketsVersion === MARKETS_V ? db : addMarkets(db);
      }
    } catch (e) {}
    return fresh();
  }

  /* ================= MOTEUR : projet → sides touchés → métiers → membres ================= */
  var QUESTIONS = [
    { k: 'stade', t: 'Où en est ton projet ?', o: [
      ['idee', 'C’est une idée', { d12: [3, 'Business plan et prévisionnel'], d7: [2, 'Choix de la structure juridique'], d4: [2, 'Plan de financement initial'] }],
      ['lancement', 'Je lance l’activité', { d7: [3, 'Création de l’entreprise'], d1: [2, 'Tenue des comptes dès le départ'], d3: [2, 'TVA et premières déclarations'], d5: [2, 'Premiers devis et factures'] }],
      ['activite', 'L’activité tourne déjà', { d2: [3, 'Marges et coûts de revient'], d4: [2, 'Plan de trésorerie'], d8: [2, 'Contrôle interne'], d11: [1, 'Risques financiers'] }]] },
    { k: 'offre', multi: true, t: 'Qu’est-ce que tu proposes ?', o: [
      ['produit', 'Des produits fabriqués ou vendus', { d14: [3, 'Fabrication, stocks et livraison'], d10: [2, 'Achats et fournisseurs'], d13: [2, 'Design produit et packaging'] }],
      ['service', 'Des services', { d5: [2, 'Devis et facturation des prestations'], d15: [1, 'Faire connaître l’offre'] }],
      ['lieu', 'Un lieu qui accueille du public', { d16: [2, 'Réservations en ligne'], d15: [2, 'Visibilité locale'], d6: [1, 'Équipe sur place'] }],
      ['digital', 'Un outil numérique ou un logiciel', { d16: [3, 'Développement et hébergement'], d9: [2, 'Outils et automatisation'] }]] },
    { k: 'clients', multi: true, t: 'Qui sont tes clients ?', o: [
      ['b2c', 'Des particuliers', { d15: [3, 'Marque et réseaux sociaux'], d16: [2, 'Paiement en ligne'] }],
      ['b2b', 'Des entreprises', { d5: [3, 'Devis, conditions de paiement, relances'], d7: [2, 'Contrats clients'] }],
      ['intl', 'Des clients à l’étranger ou des touristes', { d3: [2, 'Fiscalité internationale'], d11: [2, 'Risque de change'], d15: [1, 'Communication multilingue'] }]] },
    { k: 'equipe', t: 'Comment travailles-tu ?', o: [
      ['seul', 'Seul pour l’instant', {}],
      ['freelances', 'Avec des indépendants', { d7: [2, 'Contrats de prestation'] }],
      ['salaries', 'Avec des salariés', { d6: [3, 'Paie et charges sociales'], d7: [1, 'Contrats de travail'] }]] },
    { k: 'argent', multi: true, t: 'Côté argent, de quoi as-tu besoin ?', o: [
      ['financer', 'Trouver un financement', { d4: [3, 'Financement bancaire'], d12: [3, 'Subventions et plan de financement'] }],
      ['encaisser', 'Facturer et encaisser', { d5: [3, 'Émission des factures'], d16: [1, 'Paiement en ligne'] }],
      ['acheter', 'Acheter du matériel ou des stocks', { d10: [3, 'Commandes et contrôle des factures'], d4: [1, 'Besoin en fonds de roulement'] }],
      ['regle', 'Rester en règle', { d3: [3, 'Déclarations fiscales'], d1: [2, 'Comptes justifiés'], d8: [2, 'Conformité réglementaire'] }]] },
    { k: 'image', multi: true, t: 'Et pour te faire connaître ?', o: [
      ['marque', 'Une identité, une marque', { d13: [3, 'Identité visuelle'] }],
      ['site', 'Un site ou une appli', { d16: [3, 'Site web et e-commerce'] }],
      ['visibilite', 'Des clients via les réseaux, la pub, le référencement', { d15: [3, 'Réseaux sociaux et contenus'] }],
      ['contenus', 'Des photos et des vidéos', { d15: [2, 'Contenus photo et vidéo'], d13: [1, 'Photographie produit'] }]] }
  ];
  var SECTOR_EXTRA = { 'Santé privée': { d8: [3, 'Données de santé : conformité CNDP'] }, 'Formation privée': { d8: [1, 'Agréments et conformité'] }, 'Immobilier': { d7: [2, 'Mandats et contrats'] }, 'BTP & habitat': { d11: [1, 'Assurances de l’activité'], d7: [1, 'Contrats de chantier'] } };
  function norm(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function memberDomainsIn(db, m) {
    var ids = (m.domains || []).slice(), mt = norm(m.metier);
    db.domains.forEach(function (d) { if (ids.indexOf(d.id) < 0 && d.metiers.some(function (j) { return norm(j) === mt; })) ids.push(d.id); });
    return ids;
  }
  function analyze(ans, extra, db) {
    db = db || DB;
    var sc = {};
    function add(map) { Object.keys(map || {}).forEach(function (k) { var w = map[k]; sc[k] = sc[k] || { score: 0, reasons: [] }; sc[k].score += w[0]; if (sc[k].reasons.indexOf(w[1]) < 0) sc[k].reasons.push(w[1]); }); }
    QUESTIONS.forEach(function (q) { (ans[q.k] || []).forEach(function (v) { var o = q.o.find(function (x) { return x[0] === v; }); if (o) add(o[2]); }); });
    add(extra);
    var list = Object.keys(sc).map(function (k) { return { d: db.domains.find(function (d) { return d.id === k; }), score: sc[k].score, reasons: sc[k].reasons }; })
      .filter(function (x) { return x.d; }).sort(function (a, b) { return b.score - a.score || a.d.n - b.d.n; });
    list.forEach(function (x) { x.level = x.score >= 4 ? 'Prioritaire' : x.score >= 2 ? 'Important' : 'Utile'; });
    var ids = list.map(function (x) { return x.d.id; });
    var members = db.members.map(function (m) {
      var md = memberDomainsIn(db, m).filter(function (id) { return ids.indexOf(id) > -1; });
      return { m: m, ds: md, score: md.reduce(function (a, id) { return a + list.find(function (x) { return x.d.id === id; }).score; }, 0) };
    }).filter(function (x) { return x.score > 0; }).sort(function (a, b) { return b.score - a.score; });
    var have = db.members.map(function (m) { return norm(m.metier); });
    var missing = [];
    list.filter(function (x) { return x.score >= 3; }).forEach(function (x) { x.d.metiers.forEach(function (j) { if (have.indexOf(norm(j)) < 0 && !missing.some(function (y) { return y.job === j; })) missing.push({ job: j, d: x.d }); }); });
    return { list: list, members: members, missing: missing };
  }
  function analyzeMarket(m, db) {
    var txt = [m.solution, m.produit, m.modules, m.micro, m.nano, m.hypothesis, m.probleme].join(' ');
    var a = { stade: ['idee'], offre: ['digital'], clients: [], equipe: [], argent: [], image: [] };
    var PROD = ['Artisanat & export', 'Agroalimentaire', 'Industrie B2B', 'Commerce spécialisé'], LIEU = ['Tourisme', 'Santé privée', 'Beauté & bien-être', 'Restauration', 'Sport & loisirs', 'Formation privée'];
    a.offre.push(PROD.indexOf(m.sector) > -1 ? 'produit' : LIEU.indexOf(m.sector) > -1 ? 'lieu' : 'service');
    if (/B2B|entreprise|grossist|architect|h[oô]tel|industri|commerces|PME|RFQ|distribut|wholesale|tertiaire|promoteur|syndic|chantier/i.test(txt) || ['BTP & habitat', 'Industrie B2B', 'Logistique', 'Services professionnels', 'Énergie & eau'].indexOf(m.sector) > -1) a.clients.push('b2b');
    if (LIEU.indexOf(m.sector) > -1 || ['Automobile', 'Immobilier', 'Commerce spécialisé'].indexOf(m.sector) > -1) a.clients.push('b2c');
    if (/export|international|multilingue|\bEN\b|\bUE\b|expatri|touris|bilingue/i.test(txt) || m.sector === 'Tourisme') a.clients.push('intl');
    if (/paiement|devis|commande|factur|acompte|billetterie|abonnement|pr[ée]pay|booking|r[ée]servation/i.test(txt)) a.argent.push('encaisser');
    if (PROD.indexOf(m.sector) > -1) a.argent.push('acheter');
    if (/brand|identit|packaging|naming|marque/i.test(m.solution)) a.image.push('marque');
    if (/site|landing|funnel|catalogue|e-commerce|page/i.test(m.solution)) a.image.push('site');
    if (/SEO|Ads|campagne|social|instagram|contenu|LinkedIn|acquisition|publicit|annonce/i.test(m.solution)) a.image.push('visibilite');
    if (/vid[ée]o|photo|portfolio|avant\/apr[eè]s|cas/i.test(m.solution)) a.image.push('contenus');
    return analyze(a, SECTOR_EXTRA[m.sector], db);
  }
  function suggestedSides(r, db) {
    var sides = {};
    r.list.forEach(function (x) {
      if (x.score < 3) return;
      var miss = r.missing.filter(function (y) { return y.d.id === x.d.id; }).map(function (y) { return y.job; });
      sides[x.d.id] = { s: 'open', open: (miss.length ? miss : x.d.metiers).slice(0, 2), suggest: r.members.filter(function (mm) { return mm.ds.indexOf(x.d.id) > -1; }).slice(0, 3).map(function (mm) { return mm.m.id; }) };
    });
    return sides;
  }
  var DB = load();
  function save() {
    if (ONLINE) { if (PAGE.indexOf('admin-') === 0) scheduleSync(); return; }
    try { localStorage.setItem(KEY, JSON.stringify(DB)); } catch (e) {}
  }

  /* ================= BASE SUPABASE ================= */
  var CFG = window.ACHIRA_CONFIG, SB = null;
  try { if (CFG && window.supabase) SB = window.supabase.createClient(CFG.url, CFG.anonKey); } catch (e) {}
  var ONLINE = !!SB, SNAP = {}, syncTimer = null;
  function rowToProject(r) {
    return { slug: r.slug, title: r.title, sub: r.sub || '', disc: r.disc || '', place: r.place || '', year: r.year || '', phase: r.phase || 'Idée', status: r.status || 'pub', featured: !!r.featured, img: r.img || 'u-cercle-2', story: r.story || '',
      achira: !!r.achira, specialite: r.specialite || '', origin: r.origin === 'depot' ? 'depot' : undefined, sides: r.sides || {}, answers: r.answers || undefined, market: r.market || undefined,
      submitter: r.submitter ? Object.assign({ when: r.created_at ? new Date(r.created_at).toLocaleDateString('fr-FR') : '' }, r.submitter) : undefined };
  }
  function projectToRow(p) {
    return { slug: p.slug, title: p.title, sub: p.sub || '', disc: p.disc || '', place: p.place || '', year: parseInt(p.year, 10) || null, phase: p.phase, status: p.status, featured: !!p.featured, img: p.img, story: p.story || '',
      achira: !!p.achira, specialite: p.specialite || '', origin: p.market ? 'marche' : p.origin === 'depot' ? 'depot' : 'cercle', sides: p.sides || {}, answers: p.answers || null, market: p.market || null,
      submitter: p.submitter ? { name: p.submitter.name, email: p.submitter.email } : null };
  }
  function rowToMember(r) { return { id: r.id, slug: r.slug, name: r.name, metier: r.metier, type: r.type || '', city: r.city || '', bio: r.bio || '', domains: r.domains || [], img: r.img || '', email: r.email || '' }; }
  function memberToRow(m) {
    var j = window.ACHIRA_ARBRE.jobs.find(function (x) { return norm(x.label) === norm(m.metier); });
    return { id: m.id, slug: m.slug || slug(m.name), name: m.name, metier: m.metier, job_id: j ? j.id : null, type: DB.pros.indexOf(m.type) > -1 ? m.type : null, city: m.city || '', bio: m.bio || '', domains: m.domains || [], img: m.img || null };
  }
  function rowToSub(r) { return { id: r.id, name: r.name, email: r.email, metier: r.metier, type: r.type || '', project: r.project || '', domain: r.domain || '', link: r.link || '', msg: r.msg || '', status: r.status, notes: r.notes || '', when: new Date(r.created_at).toLocaleDateString('fr-FR') }; }
  function subToRow(s) { return { id: s.id, name: s.name, email: s.email, metier: s.metier, type: s.type || null, project: s.project || null, domain: s.domain || null, link: s.link || null, msg: s.msg || null, status: s.status, notes: s.notes || null }; }
  var COLL = { projects: ['projects', 'slug', projectToRow], members: ['members', 'id', memberToRow], subs: ['submissions', 'id', subToRow] };
  function snapshot() {
    SNAP = {};
    Object.keys(COLL).forEach(function (c) { var k = COLL[c][1]; SNAP[c] = {}; DB[c].forEach(function (x) { SNAP[c][x[k]] = JSON.stringify(COLL[c][2](x)); }); });
    SNAP.content = JSON.stringify(DB.content); SNAP.settings = JSON.stringify(DB.settings); SNAP.domains = JSON.stringify(DB.domains);
  }
  function scheduleSync() { clearTimeout(syncTimer); syncTimer = setTimeout(sync, 400); }
  async function sync() {
    var errors = [];
    for (var c of Object.keys(COLL)) {
      var t = COLL[c][0], k = COLL[c][1], f = COLL[c][2], seen = {}, up = [];
      DB[c].forEach(function (x) { var row = f(x), s = JSON.stringify(row); seen[x[k]] = 1; if (SNAP[c][x[k]] !== s) up.push(row); });
      var del = Object.keys(SNAP[c]).filter(function (id) { return !seen[id]; });
      if (up.length) { var r1 = await SB.from(t).upsert(up, { onConflict: k }); if (r1.error) errors.push(r1.error.message); }
      for (var id of del) { var r2 = await SB.from(t).delete().eq(k, id); if (r2.error) errors.push(r2.error.message); }
    }
    var kv = [];
    if (JSON.stringify(DB.content) !== SNAP.content) kv.push({ key: 'content', value: DB.content });
    if (JSON.stringify(DB.settings) !== SNAP.settings) kv.push({ key: 'settings', value: DB.settings });
    if (JSON.stringify(DB.domains) !== SNAP.domains) kv.push({ key: 'domains', value: DB.domains });
    if (kv.length) { var r3 = await SB.from('site_content').upsert(kv, { onConflict: 'key' }); if (r3.error) errors.push(r3.error.message); }
    if (errors.length) toast('Erreur d’enregistrement : ' + errors[0]); else snapshot();
  }
  function applyContent(rows) {
    (rows || []).forEach(function (r) {
      if (r.key === 'content') Object.assign(DB.content, r.value);
      if (r.key === 'settings') Object.assign(DB.settings, r.value);
      if (r.key === 'domains' && Array.isArray(r.value) && r.value.length) { DB.domains = r.value; DB.poles = treePoles(DB.domains); }
    });
  }
  async function loadPublic() {
    var res = await Promise.all([SB.rpc('public_projects'), SB.rpc('public_members'), SB.from('site_content').select('key,value')]);
    if (res[0].error || res[1].error) throw new Error((res[0].error || res[1].error).message);
    DB.projects = res[0].data.map(function (r) { var p = rowToProject(r); p.status = 'pub'; return p; });
    DB.members = res[1].data.map(rowToMember); DB.subs = [];
    applyContent(res[2].data);
  }
  async function loadAdmin() {
    var res = await Promise.all([SB.from('projects').select('*').order('created_at'), SB.from('members').select('*').order('id'), SB.from('submissions').select('*').order('created_at', { ascending: false }), SB.from('site_content').select('key,value')]);
    var err = res.find(function (r) { return r.error; });
    if (err) throw new Error(err.error.message);
    if (!res[0].data.length) throw new Error('Ce compte n’a pas les droits d’administration.');
    DB.projects = res[0].data.map(rowToProject).sort(function (a, b) { return (a.origin === 'depot' ? 0 : 1) - (b.origin === 'depot' ? 0 : 1); });
    DB.members = res[1].data.map(rowToMember); DB.subs = res[2].data.map(rowToSub);
    applyContent(res[3].data);
    snapshot();
  }
  function loginView(msg) {
    APP.innerHTML = '<div class="login"><form class="login__box" id="login" novalidate><div class="adm-logo" style="padding:0">' + LOGO + '<span><b>ACHIRA</b><small>Dashboard</small></span></div>' +
      '<h1 class="h3">Connexion</h1><p class="small">Réservée aux administrateurs du cercle.</p>' +
      '<div class="field"><label for="l-email">E-mail</label><input type="email" id="l-email" autocomplete="username" required></div>' +
      '<div class="field"><label for="l-pass">Mot de passe</label><input type="password" id="l-pass" autocomplete="current-password" required></div>' +
      '<p class="small" id="l-err" role="alert" style="color:#f3a3b1">' + esc(msg || '') + '</p><button class="btn btn--bord" type="submit">Se connecter</button><a class="link" href="../index.html">Retour au site <span>→</span></a></form></div>';
    $('#login').addEventListener('submit', async function (e) {
      e.preventDefault();
      var b = this.querySelector('button'); b.disabled = true; b.textContent = 'Connexion…';
      var r = await SB.auth.signInWithPassword({ email: $('#l-email').value.trim(), password: $('#l-pass').value });
      if (r.error) { b.disabled = false; b.textContent = 'Se connecter'; $('#l-err').textContent = 'E-mail ou mot de passe incorrect.'; return; }
      boot();
    });
  }

  var ST = { ok: 'Couvert', part: 'En partie', open: 'À pourvoir', na: 'Non requis' };
  var PUB = { pub: 'Publié', draft: 'Brouillon', arch: 'Archivé' };
  var SUB = { new: 'Nouvelle', ok: 'Acceptée', no: 'Refusée' };
  var PHASES = ['Idée', 'Lancement', 'Production', 'Terminé'];
  var IMGS = ['poster-achira', 'end-achira', 'u-cercle-1', 'u-cercle-2', 'u-cercle-3'];

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function slug(s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'projet'; }
  function pad(n) { return String(n).padStart(2, '0'); }
  function img(n) { return ROOT + 'assets/img/' + n + '.webp'; }
  function hash() { return decodeURIComponent(location.hash.slice(1)); }

  function dom(id) { return DB.domains.find(function (d) { return d.id === id; }); }
  function mem(id) { return DB.members.find(function (m) { return m.id === +id; }); }
  function proj(s) { return DB.projects.find(function (p) { return p.slug === s; }); }
  function poleOf(d) { return DB.poles.find(function (p) { return p.d.indexOf(d.id) > -1; }); }
  function sideOf(p, d) { return p.sides[d.id] || (p.sides[d.id] = { s: 'na' }); }
  function pubProjects() { return DB.projects.filter(function (p) { return p.status === 'pub'; }); }
  function rolesOf(p) {
    var r = [];
    DB.domains.forEach(function (d) { var s = p.sides[d.id]; if (s && s.s !== 'na' && s.open) s.open.forEach(function (m) { r.push({ metier: m, d: d, p: p }); }); });
    return r;
  }
  function allRoles() { var r = []; pubProjects().forEach(function (p) { r = r.concat(rolesOf(p)); }); return r; }
  function cov(p) {
    var c = { ok: 0, part: 0, open: 0, na: 0, req: 0 };
    DB.domains.forEach(function (d) { var s = (p.sides[d.id] || { s: 'na' }).s; c[s]++; if (s !== 'na') c.req++; });
    c.roles = rolesOf(p).length;
    return c;
  }
  function avatar(m, lg) {
    if (!m) return '<span class="av' + (lg ? ' av--lg' : '') + '" style="background:var(--iv14)">?</span>';
    return '<span class="av' + (lg ? ' av--lg' : '') + '">' + (m.img ? '<img src="' + img(m.img) + '" alt="">' : esc(m.name[0])) + '</span>';
  }
  function st(s) { return '<span class="st st--' + s + '">' + ST[s] + '</span>'; }
  function covBar(p) {
    var c = cov(p);
    var cells = DB.domains.filter(function (d) { return (p.sides[d.id] || {}).s && p.sides[d.id].s !== 'na'; })
      .map(function (d) { return '<i class="' + p.sides[d.id].s + '" title="' + esc(pad(d.n) + ' ' + d.t + ' : ' + ST[p.sides[d.id].s]) + '"></i>'; }).join('');
    return '<div class="cov"><div class="cov__bar" aria-hidden="true">' + cells + '</div><div class="cov__txt tab"><span>' + c.req + ' sides</span><span>' + c.ok + ' couverts</span>' + (c.part ? '<span>' + c.part + ' en partie</span>' : '') + (c.open ? '<span style="color:var(--s-open)">' + c.open + ' à pourvoir</span>' : '') + '</div></div>';
  }
  /* Lien Discord : un seul réglage, le même bouton partout */
  function discordUrl() { return DB.settings.discord || window.ACHIRA_DATA.settings.discord; }
  function dBtn(cls) { return '<a class="btn ' + (cls || 'btn--line') + ' btn--discord" href="' + esc(discordUrl()) + '" target="_blank" rel="noopener">Discord ACHIRA <span aria-hidden="true">↗</span></a>'; }
  /* Spécialité ACHIRA : le logo s'allume quand le projet est marqué */
  var RERENDER = function () {};
  function achBtn(p, lg) { return '<button type="button" class="ach' + (lg ? ' ach--lg' : '') + (p.achira ? ' on' : '') + '" data-act="ach" data-s="' + p.slug + '" aria-pressed="' + !!p.achira + '" aria-label="Spécialité ACHIRA" title="' + (p.achira ? 'Spécialité ACHIRA activée' : 'Activer la spécialité ACHIRA') + '">' + LOGO + '</button>'; }
  function prio(m) { return m ? '<span class="prio prio--' + m.priority + '">' + m.priority + '</span>' : ''; }
  function legend() { return '<div class="legend">' + ['ok', 'part', 'open', 'na'].map(st).join('') + '</div>'; }

  var tt;
  function toast(t) { var el = $('#toast'); if (!el) { el = document.createElement('div'); el.id = 'toast'; el.className = 'toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); } el.textContent = t; el.classList.add('on'); clearTimeout(tt); tt = setTimeout(function () { el.classList.remove('on'); }, 2400); }

  /* ---------- Actions déléguées ---------- */
  var ACT = {}, CH = {}, IN = {};
  ACT.ach = function (b) { var p = proj(b.dataset.s); p.achira = !p.achira; save(); toast(p.achira ? 'Spécialité ACHIRA activée' : 'Spécialité ACHIRA retirée'); RERENDER(); };
  document.addEventListener('click', function (e) { var el = e.target.closest('[data-act]'); if (el && ACT[el.dataset.act]) ACT[el.dataset.act](el, e); });
  document.addEventListener('change', function (e) { var el = e.target.closest('[data-ch]'); if (el && CH[el.dataset.ch]) CH[el.dataset.ch](el, e); });
  document.addEventListener('input', function (e) { var el = e.target.closest('[data-in]'); if (el && IN[el.dataset.in]) IN[el.dataset.in](el, e); });

  /* ---------- Carte mentale ---------- */
  function tnode(x) { return typeof x === 'string' ? { t: x } : { t: x.t, k: x.k, c: (x.c || []).map(tnode) }; }
  function domainNode(d, side) {
    var kids = d.tasks.map(tnode);
    kids.push({ t: 'Compétences requises', k: 'grp', c: d.comp.map(function (t) { return { t: t, k: 'comp' }; }) });
    kids.push({ t: 'Métiers recherchés', k: 'grp', c: d.metiers.map(function (t) {
      return { t: t, k: 'job', open: !!(side && side.open && side.open.indexOf(t) > -1), c: [{ t: 'Professionnels', k: 'grp', c: DB.pros.map(function (p) { return { t: p, k: 'pro' }; }) }] };
    }) });
    return { t: d.t, n: d.n, k: 'dom', state: side ? side.s : null, c: kids };
  }
  function mmLi(n, depth, openDepth) {
    var has = n.c && n.c.length;
    var cls = 'mm-node k-' + (n.k || 't') + (n.state ? ' st-' + n.state : '') + (n.open ? ' is-open' : '');
    var label = n.k === 'dom' ? '<span class="n">' + pad(n.n) + '</span>' + esc(n.t) + '<i class="dot"></i>' : esc(n.t) + (n.open ? ' · recherché' : '');
    var isOpen = depth < openDepth;
    return '<li' + (isOpen ? ' class="open"' : '') + '><button type="button" class="' + cls + '"' + (has ? ' data-act="mm" aria-expanded="' + isOpen + '"' : ' tabindex="-1"') + '>' + label + (has ? ' <span class="cnt">+' + n.c.length + '</span>' : '') + '</button>' +
      (has ? '<ul>' + n.c.map(function (c) { return mmLi(c, depth + 1, openDepth); }).join('') + '</ul>' : '') + '</li>';
  }
  function mindmap(rootLabel, domains, p) {
    var root = { t: rootLabel, k: 'root', c: domains.map(function (d) { return domainNode(d, p ? sideOf(p, d) : null); }) };
    return '<div class="mm-tools"><p class="small">Clique sur un nœud pour le déplier.</p><div class="row"><button class="btn btn--line btn--sm" data-act="mm-all" data-v="1">Tout déplier</button><button class="btn btn--line btn--sm" data-act="mm-all" data-v="0">Replier</button></div></div>' +
      '<div class="mm-wrap"><ul class="mm root">' + mmLi(root, 0, 1) + '</ul></div>';
  }
  ACT.mm = function (b) { var li = b.parentNode; var o = li.classList.toggle('open'); b.setAttribute('aria-expanded', o); };
  ACT['mm-all'] = function (b) {
    var wrap = b.closest('.mm-tools').nextElementSibling, on = b.dataset.v === '1';
    $$('li', wrap).forEach(function (li, i) { var btn = li.firstElementChild; if (!btn.hasAttribute('aria-expanded')) return; var o = on || i === 0; li.classList.toggle('open', o); btn.setAttribute('aria-expanded', o); });
  };

  /* ================= RECHERCHE (sides, missions, compétences, métiers, membres, projets) ================= */
  var IS_ADMIN = PAGE.indexOf('admin-') === 0;
  function jobMembers(job) { return DB.members.filter(function (m) { return norm(m.metier) === norm(job); }); }
  function searchIndex() {
    var it = [], skills = {}, jobs = {};
    DB.domains.forEach(function (d) {
      var href = IS_ADMIN ? 'modele.html#' + d.id : ROOT + 'sides.html#' + d.id, pl = poleOf(d);
      it.push({ g: 'Sides', l: pad(d.n) + ' · ' + d.t, s: pl ? pl.t : '', h: href });
      d.tasks.forEach(function (t) { it.push({ g: 'Missions', l: t, s: 'Side ' + pad(d.n) + ' · ' + d.t, h: href }); });
      d.comp.forEach(function (c) { (skills[c] = skills[c] || []).push(d); });
      d.metiers.forEach(function (j) { (jobs[j] = jobs[j] || []).push(d); });
    });
    Object.keys(skills).forEach(function (c) { var ds = skills[c]; it.push({ g: 'Compétences', l: c, s: 'Sides ' + ds.map(function (d) { return pad(d.n); }).join(', '), h: IS_ADMIN ? 'modele.html#' + ds[0].id : ROOT + 'sides.html#' + ds[0].id }); });
    Object.keys(jobs).forEach(function (j) { var ds = jobs[j], n = jobMembers(j).length; it.push({ g: 'Métiers', l: j, s: n + ' membre' + (n > 1 ? 's' : '') + ' · sides ' + ds.map(function (d) { return pad(d.n); }).join(', '), h: (IS_ADMIN ? '../' : ROOT) + 'membres.html#job-' + slug(j) }); });
    DB.members.forEach(function (m) { it.push({ g: 'Membres', l: m.name, s: m.metier + ' · ' + m.type + (m.city ? ' · ' + m.city : ''), h: IS_ADMIN ? 'membres.html' : ROOT + 'membres.html#' + m.slug }); });
    DB.projects.forEach(function (p) {
      if (!IS_ADMIN && p.status !== 'pub') return;
      it.push({ g: p.market ? 'Marchés' : 'Projets', l: p.title, s: (p.market ? p.market.id + ' · ' + p.market.sector + ' · ' : '') + p.sub + ' · ' + p.place, h: IS_ADMIN ? 'projet.html#' + p.slug : ROOT + 'projet.html#' + p.slug });
    });
    return it;
  }
  var GROUPS = ['Sides', 'Métiers', 'Membres', 'Projets', 'Marchés', 'Compétences', 'Missions'];
  function runSearch(q) {
    var words = norm(q).split(/\s+/).filter(Boolean), res = $('#searchres');
    if (!words.length) { res.innerHTML = '<p class="small search__hint">Tape un side, une mission, une compétence, un métier, un membre ou un projet. Exemples : « TVA », « comptable », « packaging », « Marrakech ».</p>'; return; }
    var hits = searchIndex().map(function (x) { var h = norm(x.l + ' ' + x.s), l = norm(x.l); return words.every(function (w) { return h.indexOf(w) > -1; }) ? { x: x, r: (l.indexOf(words[0]) === 0 ? 2 : 0) + (l.indexOf(words[0]) > -1 ? 1 : 0) } : null; }).filter(Boolean);
    if (!hits.length) { res.innerHTML = '<p class="small search__hint">Aucun résultat pour « ' + esc(q) + ' ».</p>'; return; }
    res.innerHTML = GROUPS.map(function (g) {
      var l = hits.filter(function (h) { return h.x.g === g; }).sort(function (a, b) { return b.r - a.r; });
      if (!l.length) return '';
      return '<div class="search__g"><p class="lbl">' + g + ' <span class="tab">' + l.length + '</span></p><ul>' + l.slice(0, 6).map(function (h) { return '<li><a href="' + h.x.h + '" data-act="searchgo"><b>' + esc(h.x.l) + '</b><span>' + esc(h.x.s) + '</span></a></li>'; }).join('') + '</ul></div>';
    }).join('');
  }
  function openSearch(q) {
    var o = $('#search');
    if (!o) {
      o = document.createElement('div'); o.id = 'search'; o.className = 'search'; o.setAttribute('role', 'dialog'); o.setAttribute('aria-modal', 'true'); o.setAttribute('aria-label', 'Recherche');
      o.innerHTML = '<div class="search__panel"><div class="search__box"><input type="search" id="searchq" data-in="searchq" placeholder="Rechercher un side, un métier, un membre, un projet…" aria-label="Rechercher" autocomplete="off"><button type="button" class="sheet__close" data-act="searchclose" aria-label="Fermer">×</button></div><div class="search__res" id="searchres"></div></div>';
      o.addEventListener('click', function (e) { if (e.target === o) closeSearch(); });
      document.body.appendChild(o);
    }
    o.hidden = false; document.body.style.overflow = 'hidden';
    var i = $('#searchq'); i.value = q || ''; runSearch(i.value); setTimeout(function () { i.focus(); }, 20);
  }
  function closeSearch() { var o = $('#search'); if (o) o.hidden = true; document.body.style.overflow = ''; }
  ACT.search = function () { openSearch(''); };
  ACT.searchclose = closeSearch;
  ACT.searchgo = function () { closeSearch(); };
  IN.searchq = function (el) { runSearch(el.value); };
  document.addEventListener('keydown', function (e) {
    var typing = /INPUT|TEXTAREA|SELECT/.test((e.target.tagName || ''));
    if ((e.key === '/' && !typing) || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) { e.preventDefault(); openSearch(''); }
    else if (e.key === 'Escape' && $('#search') && !$('#search').hidden) closeSearch();
    else if (e.key === 'Enter' && e.target.id === 'searchq') { var a = $('#searchres a'); if (a) { closeSearch(); location.href = a.getAttribute('href'); } }
  });
  var SEARCH_ICON = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>';

  /* ================= SITE PUBLIC ================= */
  var NAV = [['projets.html', 'Projets', 'projets'], ['sides.html', 'Sides', 'sides'], ['metiers.html', 'Métiers', 'metiers'], ['membres.html', 'Membres', 'membres'], ['cercle.html', 'Le cercle', 'cercle'], ['rejoindre.html', 'Rejoindre', 'rejoindre']];
  function shell(view) {
    var cur = PAGE === 'projet' ? 'projets' : PAGE;
    APP.innerHTML =
      '<header class="nav" id="nav"><div class="nav__pill">' +
      '<a class="nav__brand" href="' + ROOT + 'index.html" aria-label="ACHIRA, accueil">' + LOGO + '<b>ACHIRA</b></a>' +
      '<nav class="nav__links" aria-label="Navigation">' + NAV.map(function (n) { return '<a href="' + ROOT + n[0] + '"' + (cur === n[2] ? ' aria-current="page"' : '') + '>' + n[1] + '</a>'; }).join('') + '</nav>' +
      '<button type="button" class="nav__search" data-act="search" aria-label="Rechercher (touche /)">' + SEARCH_ICON + '</button>' +
      '<a class="btn btn--bord nav__cta" href="' + ROOT + 'deposer.html">Déposer un projet</a>' +
      '<button class="nav__menu" type="button" data-act="menu" aria-expanded="false">Menu</button></div></header>' +
      '<div class="drawer-nav" id="drawer" hidden>' + NAV.map(function (n) { return '<a href="' + ROOT + n[0] + '">' + n[1] + '</a>'; }).join('') + '<a href="' + ROOT + 'deposer.html" style="color:var(--champ)">Déposer un projet</a><a href="' + esc(discordUrl()) + '" target="_blank" rel="noopener">Discord ↗</a></div>' +
      '<main id="view">' + view + '</main>' +
      '<footer class="foot"><div class="in">' +
      '<div class="foot__brand">' + LOGO + '<p class="lead" style="font-size:22px">Un cercle qui avance ensemble.</p><p class="foot__motto">' + esc(DB.content.motto) + '</p></div>' +
      '<ul><li class="eyebrow">Explorer</li>' + NAV.map(function (n) { return '<li><a href="' + ROOT + n[0] + '">' + n[1] + '</a></li>'; }).join('') + '</ul>' +
      '<ul><li class="eyebrow">Contact</li><li>' + dBtn('btn--line btn--sm') + '</li><li><a href="' + ROOT + 'rejoindre.html">Rejoindre ou proposer un projet</a></li><li><span class="small">Instagram ACHIRA · ' + (DB.settings.instagram ? esc(DB.settings.instagram) : 'bientôt') + '</span></li><li><span class="small">Site AKARBI · ' + (DB.settings.akarbiUrl ? esc(DB.settings.akarbiUrl) : 'bientôt') + '</span></li><li><a href="' + ROOT + 'admin/index.html">Dashboard</a></li></ul>' +
      '</div><div class="foot__base"><span>© ' + new Date().getFullYear() + ' ACHIRA · cercle AKARBI</span><span>Maquette · contenus d’exemple</span></div></footer>';
    var nav = $('#nav');
    var onScroll = function () { nav.classList.toggle('is-solid', window.scrollY > 40); };
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }
  ACT.menu = function (b) { var d = $('#drawer'); var o = d.hidden; d.hidden = !o; b.setAttribute('aria-expanded', o); b.textContent = o ? 'Fermer' : 'Menu'; document.body.style.overflow = o ? 'hidden' : ''; };

  function pcard(p) {
    return '<a class="pcard" href="' + ROOT + 'projet.html#' + p.slug + '"><div class="pcard__img"><img src="' + img(p.img) + '" alt="" loading="lazy"><span class="pcard__tag">' + esc(p.phase) + '</span>' + (p.achira ? '<span class="pcard__ach">' + LOGO + (p.specialite ? esc(p.specialite) : 'Spécialité ACHIRA') + '</span>' : '') + '</div>' +
      '<div class="pcard__t"><span class="eyebrow">' + esc(p.disc) + ' · ' + esc(p.place) + ' · ' + p.year + '</span><h3 class="h3">' + esc(p.title) + '</h3><p>' + esc(p.sub) + '</p></div>' + covBar(p) + '</a>';
  }
  function roleRow(r) {
    return '<li class="role"><div class="role__t"><h3 class="h4">' + esc(r.metier) + '</h3><span>' + DB.pros.join(' · ') + '</span></div>' +
      '<div class="role__t"><span class="eyebrow">Side ' + pad(r.d.n) + '</span><span style="color:var(--iv80)">' + esc(r.d.t) + '</span></div>' +
      '<a class="role__t" href="' + ROOT + 'projet.html#' + r.p.slug + '"><span class="eyebrow">Projet</span><span style="color:var(--iv80)">' + esc(r.p.title) + '</span></a>' +
      '<a class="btn btn--line btn--sm" href="' + ROOT + 'rejoindre.html#' + r.p.slug + '.' + r.d.id + '.' + slug(r.metier) + '">Proposer mon aide</a></li>';
  }

  /* ----- Accueil : une entrée sobre et des portes vers chaque partie ----- */
  function pHome() {
    var C = DB.content;
    var pubs = pubProjects(), roles = allRoles(), feat = pubs.filter(function (p) { return p.featured; })[0] || pubs[0];
    function tile(cls, href, eb, title, txt, stat, im) {
      return '<a class="portal ' + cls + '" href="' + href + '">' + (im ? '<img src="' + img(im) + '" alt="" loading="lazy">' : '') +
        '<div class="portal__in"><div class="portal__top"><span class="eyebrow">' + eb + '</span>' + (stat ? '<span class="portal__stat tab">' + stat + '</span>' : '') + '</div>' +
        '<div class="portal__bot"><h2 class="portal__t">' + title + '</h2><p>' + txt + '</p><span class="portal__go" aria-hidden="true">→</span></div></div></a>';
    }
    shell(
      '<section class="hero hero--full"><img class="hero__bg" src="' + img('poster-achira') + '" alt=""><div class="hero__in">' +
      '<div class="hero__logo rv">' + LOGO + '</div><h1 class="display rv">' + esc(C.heroTitle) + '</h1><p class="lead lead--xl rv">' + esc(C.heroLead) + '</p><p class="eyebrow rv">' + esc(C.heroEyebrow) + '</p></div>' +
      '<a class="hero__down" href="#portes">Entrer <span aria-hidden="true">↓</span></a></section>' +

      '<section class="band dark" id="portes"><div class="in"><div class="head"><p class="eyebrow">Par où commencer</p><h2 class="h2">Choisis ta porte.</h2></div>' +
      '<div class="portals">' +
      tile('portal--xl', 'projets.html', 'Les projets', 'Projets', 'Chaque projet du cercle, présenté side par side.', pubs.length + ' projets', feat ? feat.img : 'poster-achira') +
      tile('portal--sides', 'sides.html', 'Le modèle', 'Les sides', 'Les ' + DB.domains.length + ' côtés d’un projet, de la comptabilité à l’image.', pad(DB.domains.length), '') +
      tile('portal--open', 'metiers.html', 'Le cercle cherche', 'Métiers', 'Les savoir-faire attendus sur les projets en cours.', roles.length + ' ouverts', '') +
      tile('', 'cercle.html', 'ACHIRA', 'Le cercle', 'Qui nous sommes, ce qui nous relie.', '', 'u-cercle-1') +
      tile('', 'membres.html', 'Les personnes', 'Membres', 'Celles et ceux qui portent les sides.', DB.members.length + ' membres', 'u-cercle-3') +
      tile('portal--join', 'deposer.html', 'Ton projet', 'Déposer un projet', 'Réponds à six questions : on te montre les sides touchés et les personnes du cercle qui peuvent t’aider.', '', '') +
      '</div></div></section>' +

      '<section class="band bord" id="contact"><div class="in"><div class="head"><p class="eyebrow">Contact</p><h2 class="h2">Parlons-en.</h2><p class="body">Une question, une idée de projet, un savoir-faire à proposer : choisis le moyen qui te va.</p></div>' +
      '<div class="contacts">' +
      '<a class="contact contact--main" href="' + esc(discordUrl()) + '" target="_blank" rel="noopener"><span class="eyebrow">Discuter</span><h3 class="h3">Discord ACHIRA</h3><p>Le lieu de rendez-vous du cercle : questions, idées, coulisses. Les membres y répondent.</p><span class="contact__go">Rejoindre le serveur <span aria-hidden="true">↗</span></span></a>' +
      '<a class="contact" href="rejoindre.html"><span class="eyebrow">Proposer</span><h3 class="h3">Rejoindre le cercle</h3><p>Propose ton savoir-faire sur un side ou un projet entier.</p><span class="contact__go">Ouvrir le formulaire <span aria-hidden="true">→</span></span></a>' +
      '<div class="contact"><span class="eyebrow">Suivre</span><h3 class="h3">Instagram ACHIRA</h3><p>Le compte AKARBI montre la marque. Le compte ACHIRA montre le chemin.</p><span class="contact__go" style="color:var(--iv60)">' + (DB.settings.instagram ? esc(DB.settings.instagram) : 'Bientôt') + '</span></div>' +
      '</div><p class="foot__motto" style="text-align:center">' + esc(C.motto) + '</p></div></section>'
    );
  }

  /* ----- Sides (le modèle) ----- */
  function pSides() {
    var C = DB.content, roles = allRoles(), feat = pubProjects()[0];
    shell(
      '<section class="phero"><div class="in"><p class="eyebrow rv">Les sides d’un projet</p><h1 class="h1 rv">Un projet a ' + DB.domains.length + ' côtés.</h1><p class="lead rv" style="max-width:40ch">' + esc(C.sidesIntro) + '</p>' +
      '<button type="button" class="searchbar rv" data-act="search">' + SEARCH_ICON + '<span>Rechercher un side, une mission, une compétence, un métier…</span><kbd>/</kbd></button></div></section>' +
      '<section class="band bord"><div class="in"><div class="head head--split"><div class="head"><p class="eyebrow">Par pôle</p><h2 class="h2">Tous les sides.</h2></div>' + (feat ? '<a class="link" href="projet.html#' + feat.slug + '">Voir un projet complet <span>→</span></a>' : '') + '</div>' +
      '<div class="poles">' + DB.poles.map(function (pl) {
        return '<div class="pole"><p class="eyebrow">' + esc(pl.t) + '</p><div class="sgrid">' + pl.d.map(dom).filter(Boolean).map(function (d) {
          var n = roles.filter(function (r) { return r.d.id === d.id; }).length;
          var nm = DB.members.filter(function (m) { return memberDomainsIn(DB, m).indexOf(d.id) > -1; }).length;
          return '<a class="side" id="' + d.id + '" href="metiers.html#' + d.id + '"><div class="side__top"><span class="num">' + pad(d.n) + '</span>' + (n ? '<span class="st st--open">' + n + ' recherché' + (n > 1 ? 's' : '') + '</span>' : '') + '</div><h3 class="h4">' + esc(d.t) + '</h3><p class="small">' + d.tasks.length + ' missions · ' + d.metiers.length + ' métiers · ' + nm + ' membre' + (nm > 1 ? 's' : '') + '</p></a>';
        }).join('') + '</div></div>';
      }).join('') + '</div></div></section>' +

      '<section class="band dark"><div class="in"><div class="head"><p class="eyebrow">Le schéma</p><h2 class="h2">La carte complète.</h2><p class="body">Du projet aux sides, des sides aux missions, puis aux compétences, aux métiers et aux profils.</p></div>' + mindmap('PROJET', DB.domains, null) + '</div></section>' +

      '<section class="band petrol"><div class="in"><div class="head"><p class="eyebrow">Le parcours</p><h2 class="h2">Prendre un side.</h2></div><ol class="path">' +
      '<li><span class="big">01</span><h3 class="h3">Suivre</h3><p>Tu suis les projets, leurs sides et leurs coulisses à ton rythme.</p></li>' +
      '<li><span class="big">02</span><h3 class="h3">Proposer ton savoir-faire</h3><p>Un side t’appelle ? Tu proposes ton aide sur le projet qui te parle, comme salarié, indépendant ou cabinet.</p></li>' +
      '<li><span class="big">03</span><h3 class="h3">Construire avec nous</h3><p>Ta proposition est acceptée : tu prends en charge le side, ton nom apparaît sur le projet. TRUST YOUR WAY.</p></li></ol>' +
      '<div class="row"><a class="btn btn--solid" href="metiers.html">Voir les ' + roles.length + ' métiers recherchés</a>' + dBtn() + '<a class="btn btn--line" href="rejoindre.html">Rejoindre</a></div></div></section>'
    );
  }

  /* ----- Projets ----- */
  var F = { phase: 'Tous', q: '', pole: 'tous', d: '', p: '' };
  function pProjets() {
    shell('<section class="phero"><div class="in"><p class="eyebrow rv">Les projets</p><h1 class="h1 rv">Chaque projet, tous ses côtés.</h1><p class="lead rv" style="max-width:38ch">De l’idée à la pièce finie : la comptabilité, les contrats, l’atelier, l’image. Chaque projet montre ce qui est couvert et ce qui manque.</p></div></section>' +
      '<section class="band dark band--tight"><div class="in"><div class="toolbar"><div class="chips" role="group" aria-label="Phase">' + ['Tous'].concat(PHASES).map(function (ph) { return '<button class="chip" type="button" data-act="phase" data-v="' + ph + '" aria-pressed="' + (F.phase === ph) + '">' + ph + '</button>'; }).join('') + '</div>' +
      '<input type="search" id="pq" data-in="pq" placeholder="Rechercher un projet" aria-label="Rechercher un projet" style="max-width:280px;margin-left:auto"></div>' + legend() + '<div class="pgrid" id="results"></div></div></section>');
    renderProjets();
  }
  function renderProjets() {
    var l = pubProjects().filter(function (p) { return (F.phase === 'Tous' || p.phase === F.phase) && (!F.q || (p.title + ' ' + p.disc + ' ' + p.place).toLowerCase().indexOf(F.q.toLowerCase()) > -1); });
    $('#results').innerHTML = l.length ? l.map(pcard).join('') : '<p class="body">Aucun projet ne correspond à ces filtres.</p>';
  }
  ACT.phase = function (b) { F.phase = b.dataset.v; $$('[data-act=phase]').forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); renderProjets(); };
  IN.pq = function (el) { F.q = el.value; renderProjets(); };

  /* ----- Projet (détail) ----- */
  var showNA = false;
  function pProjet() {
    var p = proj(hash()) || pubProjects()[0];
    var c = cov(p), roles = rolesOf(p);
    var leads = []; DB.domains.forEach(function (d) { var s = p.sides[d.id]; if (s && s.lead && s.s !== 'na') { var m = mem(s.lead); var e = leads.find(function (x) { return x.m === m; }); if (e) e.d.push(d); else leads.push({ m: m, d: [d] }); } });
    var others = pubProjects().filter(function (x) { return x !== p; }).slice(0, 2);
    document.title = p.title + ' — ACHIRA';
    shell(
      (p.status !== 'pub' ? '<div style="position:fixed;bottom:16px;left:50%;transform:translateX(-50%);z-index:70" class="chip chip--open">Aperçu · ce projet n’est pas publié</div>' : '') +
      '<section class="phero phero--img"><img src="' + img(p.img) + '" alt=""><div class="in"><p class="eyebrow rv">' + esc(p.disc) + ' · ' + esc(p.place) + ' · ' + p.year + '</p><h1 class="h1 rv">' + esc(p.title) + '</h1><p class="lead rv" style="max-width:34ch">' + esc(p.sub) + '</p>' +
      '<div class="meta-row rv"><div><span class="eyebrow">Phase</span><b>' + esc(p.phase) + '</b></div><div><span class="eyebrow">Sides</span><b class="tab">' + c.req + '</b></div><div><span class="eyebrow">Couverts</span><b class="tab">' + c.ok + '</b></div><div><span class="eyebrow">Métiers recherchés</span><b class="tab" style="color:var(--s-open)">' + c.roles + '</b></div></div></div></section>' +

      '<section class="band dark"><div class="in"><div class="split"><div><p class="eyebrow">L’histoire</p><h2 class="h2">Pourquoi ce projet.</h2>' + (p.achira ? '<p class="pcard__ach" style="position:static;justify-self:start">' + LOGO + (p.specialite ? esc(p.specialite) : 'Spécialité ACHIRA') + '</p>' : '') + '</div><div><p class="body" style="font-size:18px">' + esc(p.story) + '</p>' + covBar(p) + legend() + '</div></div></div></section>' +
      (p.market ? '<section class="band petrol"><div class="in"><div class="head"><p class="eyebrow">Le marché</p><h2 class="h2">' + esc(p.market.micro) + '.</h2></div><dl class="kv">' +
        [['Secteur', p.market.sector + ' · ' + p.market.domain + ' · ' + p.market.subdomain], ['Cible', p.market.nano], ['Ville', p.market.city], ['Problème central', p.market.probleme], ['Hypothèse', p.market.hypothesis], ['Solution', p.market.solution], ['Produit', p.market.produit], ['Modules', p.market.modules]].map(function (r) { return '<div><dt>' + r[0] + '</dt><dd>' + esc(r[1]) + '</dd></div>'; }).join('') + '</dl></div></section>' : '') +

      '<section class="band bord" id="sides"><div class="in"><div class="head head--split"><div class="head"><p class="eyebrow">Tous les côtés du projet</p><h2 class="h2">Les sides.</h2><p class="body">Ouvre un side pour voir ses missions, les compétences demandées et les métiers recherchés.</p></div>' +
      '<div class="toggle"><span class="small">Afficher les sides non requis</span><button class="switch" role="switch" aria-checked="' + showNA + '" data-act="na" aria-label="Afficher les sides non requis"></button></div></div>' +
      '<div class="poles">' + DB.poles.map(function (pl) {
        var ds = pl.d.map(dom).filter(function (d) { return d && (showNA || sideOf(p, d).s !== 'na'); });
        if (!ds.length) return '';
        return '<div class="pole"><p class="eyebrow">' + esc(pl.t) + '</p><div class="sgrid">' + ds.map(function (d) {
          var s = sideOf(p, d), m = s.lead && mem(s.lead);
          return '<button type="button" class="side side--' + s.s + '" data-act="sheet" data-d="' + d.id + '"><div class="side__top"><span class="num">' + pad(d.n) + '</span>' + st(s.s) + '</div><h3 class="h4">' + esc(d.t) + '</h3>' +
            (m ? '<div class="side__who">' + avatar(m) + '<span>' + esc(m.name) + ' · ' + esc(m.metier) + '</span></div>' : '') +
            (s.open && s.open.length && s.s !== 'na' ? '<div class="chips">' + s.open.map(function (o) { return '<span class="chip chip--open">' + esc(o) + '</span>'; }).join('') + '</div>' : '') + '</button>';
        }).join('') + '</div></div>';
      }).join('') + '</div></div></section>' +

      '<section class="band dark"><div class="in"><div class="head"><p class="eyebrow">La carte du projet</p><h2 class="h2">Tout le projet, d’un regard.</h2><p class="body">Du projet aux sides, des sides aux missions, puis aux compétences, aux métiers et aux profils.</p></div>' +
      mindmap(p.title, DB.domains.filter(function (d) { return showNA || sideOf(p, d).s !== 'na'; }), p) + '</div></section>' +

      (roles.length ? '<section class="band petrol"><div class="in"><div class="head"><p class="eyebrow">Sur ce projet</p><h2 class="h2">Le projet cherche.</h2></div><ul class="roles">' + roles.map(roleRow).join('') + '</ul></div></section>' : '') +

      (leads.length ? '<section class="band dark"><div class="in"><div class="head"><p class="eyebrow">L’équipe</p><h2 class="h2">Qui porte quoi.</h2></div><div class="mgrid">' + leads.map(function (l) {
        return '<div class="mcard"><div class="mcard__ph">' + (l.m.img ? '<img src="' + img(l.m.img) + '" alt="' + esc(l.m.name) + '" loading="lazy">' : '<span>' + esc(l.m.name[0]) + '</span>') + '</div><div><h3 class="h4">' + esc(l.m.name) + '</h3><p class="small">' + esc(l.m.metier) + ' · ' + esc(l.m.type) + '</p></div><div class="chips">' + l.d.map(function (d) { return '<span class="chip">' + pad(d.n) + ' ' + esc(d.t) + '</span>'; }).join('') + '</div></div>';
      }).join('') + '</div></div></section>' : '') +

      (others.length ? '<section class="band bord"><div class="in"><div class="head"><p class="eyebrow">Continuer</p><h2 class="h2">D’autres projets.</h2></div><div class="pgrid">' + others.map(pcard).join('') + '</div></div></section>' : '') +
      '<div class="sheet-bg" id="sheetbg" data-act="close"></div><aside class="sheet" id="sheet" aria-hidden="true" role="dialog" aria-modal="true" aria-label="Détail du side"></aside>'
    );
    window.scrollTo(0, 0);
  }
  ACT.na = function () { showNA = !showNA; var y = $('#sides').offsetTop; pProjet(); window.scrollTo(0, y); };
  ACT.sheet = function (b) {
    var p = proj(hash()) || pubProjects()[0], d = dom(b.dataset.d), s = sideOf(p, d), m = s.lead && mem(s.lead);
    function tasks(list) { return '<ul class="ticks">' + list.map(function (x) { var n = tnode(x); return '<li>' + esc(n.t) + (n.c && n.c.length ? tasks(n.c) : '') + '</li>'; }).join('') + '</ul>'; }
    var sh = $('#sheet');
    sh.innerHTML = '<button class="sheet__close" data-act="close" aria-label="Fermer">×</button>' +
      '<div><p class="eyebrow">Side ' + pad(d.n) + ' · ' + esc(poleOf(d).t) + '</p><h3 class="h2" style="font-size:44px">' + esc(d.t) + '</h3><div class="row" style="margin-top:12px">' + st(s.s) + (m ? '<span class="side__who">' + avatar(m) + esc(m.name) + ' · ' + esc(m.metier) + '</span>' : '') + '</div></div>' +
      '<section><p class="lbl">Missions</p>' + tasks(d.tasks) + '</section>' +
      '<section><p class="lbl">Compétences requises</p><div class="chips">' + d.comp.map(function (c) { return '<span class="chip">' + esc(c) + '</span>'; }).join('') + '</div></section>' +
      '<section><p class="lbl">Métiers</p><div class="chips">' + d.metiers.map(function (x) { var o = s.open && s.open.indexOf(x) > -1 && s.s !== 'na'; return '<span class="chip' + (o ? ' chip--open' : '') + '">' + esc(x) + (o ? ' · recherché' : '') + '</span>'; }).join('') + '</div></section>' +
      '<section><p class="lbl">Profils acceptés</p><p class="body">' + DB.pros.join(' · ') + '</p></section>' +
      '<div class="row"><a class="btn btn--bord" href="rejoindre.html#' + p.slug + '.' + d.id + '">Proposer mon aide sur ce side</a>' + dBtn() + '</div>';
    sh.classList.add('on'); sh.setAttribute('aria-hidden', 'false'); $('#sheetbg').classList.add('on'); sh.querySelector('.sheet__close').focus();
  };
  ACT.close = function () { $('#sheet').classList.remove('on'); $('#sheet').setAttribute('aria-hidden', 'true'); $('#sheetbg').classList.remove('on'); };
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && $('#sheet.on')) ACT.close(); });

  /* ----- Métiers ----- */
  function pMetiers() {
    var h = hash(); if (dom(h)) F.d = h;
    shell('<section class="phero"><div class="in"><p class="eyebrow rv">Métiers</p><h1 class="h1 rv">Le cercle cherche.</h1><p class="lead rv" style="max-width:40ch">Chaque side ouvert d’un projet attend un savoir-faire. Salarié, indépendant ou cabinet, propose ton aide.</p></div></section>' +
      '<section class="band dark band--tight"><div class="in"><div class="toolbar">' +
      '<div class="chips" role="group" aria-label="Pôle">' + [['tous', 'Tous les pôles']].concat(DB.poles.map(function (p) { return [p.id, p.t]; })).map(function (x) { return '<button class="chip" type="button" data-act="pole" data-v="' + x[0] + '" aria-pressed="' + (F.pole === x[0]) + '">' + esc(x[1]) + '</button>'; }).join('') + '</div>' +
      '<select data-ch="fd" aria-label="Side" style="max-width:300px"><option value="">Tous les sides</option>' + DB.domains.map(function (d) { return '<option value="' + d.id + '"' + (F.d === d.id ? ' selected' : '') + '>' + pad(d.n) + ' · ' + esc(d.t) + '</option>'; }).join('') + '</select>' +
      '<select data-ch="fp" aria-label="Projet" style="max-width:240px"><option value="">Tous les projets</option>' + pubProjects().map(function (p) { return '<option value="' + p.slug + '"' + (F.p === p.slug ? ' selected' : '') + '>' + esc(p.title) + '</option>'; }).join('') + '</select></div>' +
      '<ul class="roles" id="results"></ul></div></section>' +
      '<section class="band bord"><div class="in"><div class="head"><p class="eyebrow">Le catalogue</p><h2 class="h2">Tous les métiers des sides.</h2><p class="body">Aucun poste ouvert pour toi ? Fais-toi connaître : le cercle te contactera quand un projet aura besoin de ton métier.</p></div>' +
      '<div class="sgrid">' + DB.domains.map(function (d) { return '<div class="side"><span class="num">' + pad(d.n) + '</span><h3 class="h4">' + esc(d.t) + '</h3><div class="chips">' + d.metiers.map(function (m) { var n = jobMembers(m).length; return '<a class="chip' + (n ? ' chip--on' : '') + '" href="membres.html#job-' + slug(m) + '" title="' + n + ' membre(s)">' + esc(m) + (n ? ' · ' + n : '') + '</a>'; }).join('') + '</div></div>'; }).join('') + '</div>' +
      '<p class="small">Le chiffre indique le nombre de membres du cercle qui exercent ce métier. Modes d’exercice possibles : ' + DB.pros.join(', ') + ' (catégories indicatives, pas des habilitations).</p>' +
      '<div class="row"><a class="btn btn--solid" href="rejoindre.html">Me faire connaître</a>' + dBtn() + '</div></div></section>');
    renderMetiers();
  }
  function renderMetiers() {
    var pole = DB.poles.find(function (p) { return p.id === F.pole; });
    var l = allRoles().filter(function (r) { return (!pole || pole.d.indexOf(r.d.id) > -1) && (!F.d || r.d.id === F.d) && (!F.p || r.p.slug === F.p); });
    $('#results').innerHTML = l.length ? l.map(roleRow).join('') : '<li class="role"><p class="body">Aucun métier recherché pour ces filtres en ce moment.</p></li>';
  }
  ACT.pole = function (b) { F.pole = b.dataset.v; $$('[data-act=pole]').forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); renderMetiers(); };
  CH.fd = function (el) { F.d = el.value; renderMetiers(); };
  CH.fp = function (el) { F.p = el.value; renderMetiers(); };

  /* ----- Le cercle ----- */
  function pCercle() {
    shell('<section class="hero" style="min-height:92vh"><div class="hero__in"><div class="hero__logo rv">' + LOGO + '</div><h1 class="display rv">ACHIRA</h1><p class="lead lead--xl rv">Un cercle qui avance ensemble.</p><p class="eyebrow rv">Des histoires singulières. Des valeurs partagées.</p></div></section>' +
      '<section class="band dark"><div class="in center"><p class="statement" style="max-width:28ch">' + esc(DB.content.manifesto) + '</p></div></section>' +
      '<section class="band bord"><div class="in"><div class="split"><div><p class="eyebrow">Un cercle d’artistes et de métiers</p><h2 class="h2">Contre la routine qui enferme.</h2><p class="body">ACHIRA rassemble des artistes et des créatifs, de l’art traditionnel à l’art moderne, et tous les métiers qui font tenir un projet debout : comptables, juristes, financiers, artisans, développeurs.</p><p class="body">Ce qui nous relie : le goût du travail bien fait, le respect des racines et l’envie d’avancer, même dans les périodes d’ombre.</p></div>' +
      '<div class="collage"><img src="' + img('u-cercle-1') + '" alt="Des membres réunis autour d’une table, photographies et esquisses" loading="lazy"><img src="' + img('u-cercle-2') + '" alt="Une discussion dans un atelier de musique" loading="lazy"><img src="' + img('u-cercle-3') + '" alt="Un échange autour d’une pièce de cuir" loading="lazy"></div></div></div></section>' +
      '<section class="band dark"><div class="in"><div class="head"><p class="eyebrow">Le parcours</p><h2 class="h2">Chacun sa manière d’avancer.</h2></div><ol class="path">' +
      '<li><span class="big">01</span><h3 class="h3">Suivre</h3><p>Tu découvres AKARBI et les projets du cercle, tu suis leurs chapitres et leurs coulisses à ton rythme, sans obligation d’achat.</p></li>' +
      '<li><span class="big">02</span><h3 class="h3">Devenir ACHIRA</h3><p>Avec ta première pièce AKARBI, ou en prenant en charge un side d’un projet. Et en faisant vivre nos principes : ne jamais abandonner, avancer avec discipline, aimer le processus.</p></li>' +
      '<li><span class="big">03</span><h3 class="h3">Construire avec nous</h3><div><p>Tu as un savoir-faire qui peut faire grandir la maison ? Tu peux devenir membre d’AKARBI et d’ACHIRA.</p><div class="chips" style="margin-top:14px">' + ['Tailleur', 'Designer', 'Photographe', 'Expert-comptable', 'Juriste', 'Développeur', 'Et d’autres savoir-faire'].map(function (c) { return '<span class="chip">' + c + '</span>'; }).join('') + '</div></div></li></ol></div></section>' +
      '<section class="band bord"><div class="in"><div class="head"><p class="eyebrow">La vie du cercle</p><h2 class="h2">Faire vivre le cercle.</h2></div><ol class="grid4">' +
      '<li><span class="num">01</span><h3 class="h4">Entretenir le lien</h3><p>Les coulisses ouvrent la conversation : un essai, une étape de fabrication, la parole donnée à un artisan.</p></li>' +
      '<li><span class="num">02</span><h3 class="h4">Se retrouver</h3><p>Essayages, rencontres, ateliers et projets créatifs, à Casablanca comme dans la diaspora.</p></li>' +
      '<li><span class="num">03</span><h3 class="h4">Contribuer aux choix</h3><p>Couleurs, lieux, contenus : le cercle peut proposer, et AKARBI explique ce qu’il en fait.</p></li>' +
      '<li><span class="num">04</span><h3 class="h4">Garder une direction</h3><p>L’identité, la qualité et la décision créative finale restent la responsabilité de la maison.</p></li></ol></div></section>' +
      '<section class="band dark"><div class="in center"><p class="quote">' + esc(DB.content.quote) + ' <em>' + esc(DB.content.quoteEm) + '</em></p><p class="lead">Le compte AKARBI montre la marque. Le compte ACHIRA montre le chemin.</p><div class="row" style="justify-content:center"><a class="btn btn--solid" href="projets.html">Voir les projets</a><a class="btn btn--line" href="rejoindre.html">Rejoindre</a>' + dBtn() + '</div></div></section>');
  }

  /* ----- Membres ----- */
  var MP = 'tous', MQ = '', MJ = '';
  function allJobs() { var l = []; DB.domains.forEach(function (d) { d.metiers.forEach(function (j) { if (l.indexOf(j) < 0) l.push(j); }); }); return l; }
  function pMembres() {
    var h = hash(); MJ = '';
    if (h.indexOf('job-') === 0) allJobs().forEach(function (j) { if ('job-' + slug(j) === h) MJ = j; });
    shell('<section class="phero"><div class="in"><p class="eyebrow rv">Membres</p><h1 class="h1 rv">Celles et ceux qui avancent.</h1><p class="lead rv" style="max-width:36ch">Chaque membre exerce un métier de l’arbre ; ce métier le relie aux sides qu’il peut porter.</p></div></section>' +
      '<section class="band dark band--tight"><div class="in"><div class="toolbar"><input type="search" data-in="mq" value="' + esc(MQ) + '" placeholder="Rechercher un nom, un métier, une ville, un side…" aria-label="Rechercher un membre" style="max-width:340px">' +
      '<select data-ch="mj" aria-label="Métier" style="max-width:260px"><option value="">Tous les métiers</option>' + allJobs().map(function (j) { var n = jobMembers(j).length; return '<option value="' + esc(j) + '"' + (MJ === j ? ' selected' : '') + '>' + esc(j) + ' (' + n + ')</option>'; }).join('') + '</select>' +
      '<div class="chips" role="group" aria-label="Pôle">' + [['tous', 'Tous']].concat(DB.poles.map(function (p) { return [p.id, p.t]; })).map(function (x) { return '<button class="chip" type="button" data-act="mp" data-v="' + x[0] + '" aria-pressed="' + (MP === x[0]) + '">' + esc(x[1]) + '</button>'; }).join('') + '</div></div>' +
      '<div id="jobinfo"></div><div class="mgrid" id="results"></div></div></section>');
    renderMembres();
  }
  function renderMembres() {
    var pole = DB.poles.find(function (p) { return p.id === MP; }), q = norm(MQ).split(/\s+/).filter(Boolean);
    var info = $('#jobinfo');
    if (MJ) {
      var ds = DB.domains.filter(function (d) { return d.metiers.indexOf(MJ) > -1; });
      info.innerHTML = '<div class="discord-band"><div><p class="eyebrow">Métier</p><h2 class="h3">' + esc(MJ) + '</h2><p class="small">Intervient sur : ' + ds.map(function (d) { return pad(d.n) + ' ' + esc(d.t); }).join(' · ') + ' · ' + DB.pros.join(', ') + '</p></div><button class="btn btn--line btn--sm" data-act="mjclear">Tous les métiers</button></div>';
    } else info.innerHTML = '';
    var l = DB.members.filter(function (m) {
      var md = memberDomainsIn(DB, m), txt = norm([m.name, m.metier, m.type, m.city, m.bio].concat(md.map(function (id) { return dom(id).t; })).join(' '));
      return (!pole || md.some(function (d) { return pole.d.indexOf(d) > -1; })) && (!MJ || norm(m.metier) === norm(MJ)) && q.every(function (w) { return txt.indexOf(w) > -1; });
    });
    $('#results').innerHTML = l.length ? l.map(function (m) {
      var n = DB.projects.filter(function (p) { return p.status === 'pub' && Object.keys(p.sides).some(function (k) { return p.sides[k].lead === m.id && p.sides[k].s !== 'na'; }); }).length;
      return '<div class="mcard" id="' + esc(m.slug) + '"><div class="mcard__ph">' + (m.img ? '<img src="' + img(m.img) + '" alt="' + esc(m.name) + '" loading="lazy">' : '<span>' + esc(m.name[0]) + '</span>') + '</div><div><h3 class="h3" style="font-size:28px">' + esc(m.name) + '</h3><p class="small"><a href="membres.html#job-' + slug(m.metier) + '" style="color:var(--champ)">' + esc(m.metier) + '</a> · ' + esc(m.type) + (m.city ? ' · ' + esc(m.city) : '') + '</p></div><p>' + esc(m.bio) + '</p>' +
        '<div class="chips">' + memberDomainsIn(DB, m).map(dom).filter(Boolean).map(function (d) { return '<a class="chip" href="sides.html#' + d.id + '">' + pad(d.n) + ' ' + esc(d.t) + '</a>'; }).join('') + '</div><p class="small tab">' + n + ' projet' + (n > 1 ? 's' : '') + ' en cours ou terminés</p></div>';
    }).join('') : '<p class="body">Aucun membre ne correspond. <a class="link" href="rejoindre.html">Tu exerces ce métier ? Rejoins le cercle <span>→</span></a></p>';
  }
  ACT.mp = function (b) { MP = b.dataset.v; $$('[data-act=mp]').forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); renderMembres(); };
  ACT.mjclear = function () { MJ = ''; history.replaceState(null, '', location.pathname); var s = $('[data-ch=mj]'); if (s) s.value = ''; renderMembres(); };
  CH.mj = function (el) { MJ = el.value; renderMembres(); };
  IN.mq = function (el) { MQ = el.value; renderMembres(); };

  /* ----- Déposer un projet : questions → sides → métiers → personnes ----- */
  var WA = { secteur: '', stade: [], offre: [], clients: [], equipe: [], argent: [], image: [] };
  var SECTEURS = ['Mode et cuir', 'Artisanat & export', 'Agroalimentaire', 'Tourisme', 'Restauration', 'Santé privée', 'Beauté & bien-être', 'Formation privée', 'Sport & loisirs', 'BTP & habitat', 'Immobilier', 'Industrie B2B', 'Logistique', 'Énergie & eau', 'Automobile', 'Commerce spécialisé', 'Services professionnels', 'Autre'];
  function pDeposer() {
    shell('<section class="phero"><div class="in"><p class="eyebrow rv">Déposer un projet</p><h1 class="h1 rv">Ton projet, tous ses côtés.</h1><p class="lead rv" style="max-width:42ch">Réponds aux questions : à chaque réponse, on te montre les sides que ton projet touche, les métiers dont il a besoin et les personnes du cercle qui peuvent t’aider.</p></div></section>' +
      '<section class="band dark band--tight"><div class="in"><div class="wiz"><div class="wiz__q" id="wizq"></div><aside class="wiz__r" id="wizr" aria-live="polite"></aside></div></div></section>');
    renderWizQ(); renderWizR();
  }
  function answered() { return QUESTIONS.filter(function (q) { return WA[q.k].length; }).length + (WA.secteur ? 1 : 0); }
  function renderWizQ() {
    var total = QUESTIONS.length + 1;
    $('#wizq').innerHTML = '<div class="wiz__prog"><span style="width:' + Math.round(answered() / total * 100) + '%"></span></div><p class="small tab">' + answered() + ' / ' + total + ' questions</p>' +
      '<fieldset class="wq"><legend><span class="num">01</span> Dans quel secteur ?</legend><select data-ch="wsec" aria-label="Secteur"><option value="">Choisir un secteur</option>' + SECTEURS.map(function (s) { return '<option' + (WA.secteur === s ? ' selected' : '') + '>' + esc(s) + '</option>'; }).join('') + '</select></fieldset>' +
      QUESTIONS.map(function (q, i) {
        return '<fieldset class="wq"><legend><span class="num">' + pad(i + 2) + '</span> ' + esc(q.t) + (q.multi ? ' <span class="small">plusieurs choix possibles</span>' : '') + '</legend><div class="chips">' +
          q.o.map(function (o) { return '<button type="button" class="chip" data-act="wopt" data-q="' + q.k + '" data-v="' + o[0] + '" aria-pressed="' + (WA[q.k].indexOf(o[0]) > -1) + '">' + esc(o[1]) + '</button>'; }).join('') + '</div></fieldset>';
      }).join('') +
      '<form class="wq form" id="wizf" novalidate><legend class="full"><span class="num">' + pad(QUESTIONS.length + 2) + '</span> Présente ton projet</legend>' +
      '<div class="field full"><label for="w-title">Nom du projet</label><input type="text" id="w-title" required></div>' +
      '<div class="field full"><label for="w-desc">En quelques lignes</label><textarea id="w-desc" placeholder="Ce que tu veux faire, pour qui, et où tu en es."></textarea></div>' +
      '<div class="field"><label for="w-city">Ville</label><input type="text" id="w-city"></div><div class="field"><label for="w-name">Ton nom</label><input type="text" id="w-name" required autocomplete="name"></div>' +
      '<div class="field full"><label for="w-email">E-mail</label><input type="email" id="w-email" required autocomplete="email"></div>' +
      '<p class="full small" id="w-err" role="alert"></p><div class="full row"><button class="btn btn--bord" type="submit">Envoyer mon projet au cercle</button>' + dBtn() + '</div></form>';
    $('#wizf').addEventListener('submit', submitWiz);
  }
  function wizResult() { return analyze(WA, SECTOR_EXTRA[WA.secteur]); }
  function renderWizR() {
    var r = wizResult(), top = r.list.slice(0, 8);
    if (!r.list.length) { $('#wizr').innerHTML = '<p class="eyebrow">Ton projet</p><h2 class="h3">Réponds à une question pour commencer.</h2><p class="small">Les sides touchés, les métiers et les personnes du cercle apparaîtront ici.</p>'; return; }
    $('#wizr').innerHTML = '<p class="eyebrow">Ton projet touche</p><h2 class="h2" style="font-size:48px"><span class="tab">' + r.list.length + '</span> sides</h2>' +
      '<ol class="wr-sides">' + top.map(function (x) { return '<li><span class="num">' + pad(x.d.n) + '</span><div><b>' + esc(x.d.t) + '</b><span>' + esc(x.reasons.join(' · ')) + '</span></div><span class="lvl lvl--' + slug(x.level) + '">' + x.level + '</span></li>'; }).join('') + '</ol>' +
      (r.list.length > top.length ? '<p class="small">+ ' + (r.list.length - top.length) + ' side(s) utile(s)</p>' : '') +
      '<p class="lbl" style="margin-top:8px">Les personnes du cercle</p>' +
      (r.members.length ? '<ul class="wr-people">' + r.members.slice(0, 5).map(function (x) { return '<li>' + avatar(x.m) + '<div><b>' + esc(x.m.name) + '</b><span>' + esc(x.m.metier) + ' · ' + esc(x.m.type) + '</span><span class="wr-ds">' + x.ds.map(function (id) { return pad(dom(id).n); }).join(' · ') + '</span></div></li>'; }).join('') + '</ul>' : '<p class="small">Personne dans le cercle pour ces sides pour l’instant.</p>') +
      (r.missing.length ? '<p class="lbl" style="margin-top:8px">Métiers à trouver</p><div class="chips">' + r.missing.slice(0, 8).map(function (y) { return '<span class="chip chip--open" title="Side ' + pad(y.d.n) + '">' + esc(y.job) + '</span>'; }).join('') + '</div>' : '');
  }
  ACT.wopt = function (b) {
    var q = QUESTIONS.find(function (x) { return x.k === b.dataset.q; }), v = b.dataset.v, cur = WA[q.k], i = cur.indexOf(v);
    if (q.multi) { if (i > -1) cur.splice(i, 1); else cur.push(v); } else WA[q.k] = i > -1 ? [] : [v];
    $$('[data-act=wopt][data-q="' + q.k + '"]').forEach(function (x) { x.setAttribute('aria-pressed', WA[q.k].indexOf(x.dataset.v) > -1); });
    updateProg(); renderWizR();
  };
  CH.wsec = function (el) { WA.secteur = el.value; updateProg(); renderWizR(); };
  function updateProg() { var t = QUESTIONS.length + 1; $('.wiz__prog span').style.width = Math.round(answered() / t * 100) + '%'; $('.wiz__prog + p').textContent = answered() + ' / ' + t + ' questions'; }
  function submitWiz(e) {
    e.preventDefault();
    var v = function (id) { return $('#' + id).value.trim(); };
    if (!v('w-title') || !v('w-name') || !v('w-email')) { $('#w-err').textContent = 'Indique le nom du projet, ton nom et ton e-mail.'; return; }
    if (!answered()) { $('#w-err').textContent = 'Réponds à au moins une question pour que le cercle sache quels sides ton projet touche.'; return; }
    var r = wizResult(), base = slug(v('w-title')), sl = base, n = 2;
    while (proj(sl)) sl = base + '-' + n++;
    if (ONLINE) sl = base + '-' + Math.random().toString(36).slice(2, 7);
    var p = { slug: sl, title: v('w-title'), sub: v('w-desc').slice(0, 120), disc: WA.secteur || 'À préciser', place: v('w-city'), year: new Date().getFullYear(), phase: { idee: 'Idée', lancement: 'Lancement', activite: 'Production' }[WA.stade[0]] || 'Idée',
      status: 'draft', featured: false, img: 'u-cercle-2', story: v('w-desc'), achira: false, specialite: '', origin: 'depot',
      submitter: { name: v('w-name'), email: v('w-email'), when: new Date().toLocaleDateString('fr-FR') }, answers: JSON.parse(JSON.stringify(WA)), sides: suggestedSides(r, DB) };
    var nSides = r.list.filter(function (x) { return x.score >= 3; }).length, nPpl = Math.min(r.members.length, 5);
    function done(extra) { $('#wizf').outerHTML = '<div class="notice wq"><h3 class="h3">Merci ' + esc(v('w-name')) + '.</h3><p style="margin-top:8px">Ton projet « ' + esc(v('w-title')) + ' » est bien arrivé au cercle, avec ' + nSides + ' sides à pourvoir et ' + nPpl + ' personnes suggérées. ' + extra + '</p></div>'; }
    if (ONLINE) {
      var btn = $('#wizf button[type=submit]'); btn.disabled = true; btn.textContent = 'Envoi…';
      SB.from('projects').insert(projectToRow(p)).then(function (res) {
        if (res.error) { btn.disabled = false; btn.textContent = 'Envoyer mon projet au cercle'; $('#w-err').textContent = 'L’envoi n’a pas abouti. Réessaie dans un instant ou écris-nous sur Discord.'; return; }
        done('Le cercle revient vers toi par e-mail.');
      });
      return;
    }
    DB.projects.unshift(p); save();
    done('<a class="link" href="admin/projet.html#' + sl + '">Le voir dans la dashboard <span>→</span></a>');
  }

  /* ----- Rejoindre ----- */
  function pRejoindre() {
    var h = hash().split('.'), pp = proj(h[0]), dd = dom(h[1]);
    var metier = '';
    if (dd && h[2]) dd.metiers.forEach(function (m) { if (slug(m) === h[2]) metier = m; });
    var allMetiers = []; DB.domains.forEach(function (d) { d.metiers.forEach(function (m) { if (allMetiers.indexOf(m) < 0) allMetiers.push(m); }); });
    shell('<section class="phero"><div class="in"><p class="eyebrow rv">Rejoindre</p><h1 class="h1 rv">Propose ton savoir-faire.</h1><p class="lead rv" style="max-width:38ch">Sur un side précis d’un projet, ou simplement pour te faire connaître du cercle.</p></div></section>' +
      '<section class="band dark"><div class="in"><div class="split" style="align-items:start"><div>' +
      '<form class="form" id="join" novalidate>' +
      '<div class="field"><label for="j-name">Nom ou nom du cabinet</label><input type="text" id="j-name" required autocomplete="name"></div>' +
      '<div class="field"><label for="j-email">E-mail</label><input type="email" id="j-email" required autocomplete="email"></div>' +
      '<div class="field"><label for="j-metier">Ton métier</label><input type="text" id="j-metier" list="metiers" value="' + esc(metier) + '" required><datalist id="metiers">' + allMetiers.map(function (m) { return '<option value="' + esc(m) + '">'; }).join('') + '</datalist></div>' +
      '<div class="field"><label for="j-type">Tu interviens comme</label><select id="j-type">' + DB.pros.map(function (p) { return '<option>' + p + '</option>'; }).join('') + '</select></div>' +
      '<div class="field"><label for="j-proj">Projet</label><select id="j-proj"><option value="">Pas de projet en particulier</option>' + pubProjects().map(function (p) { return '<option value="' + p.slug + '"' + (pp === p ? ' selected' : '') + '>' + esc(p.title) + '</option>'; }).join('') + '</select></div>' +
      '<div class="field"><label for="j-dom">Side</label><select id="j-dom"><option value="">Pas de side en particulier</option>' + DB.domains.map(function (d) { return '<option value="' + d.id + '"' + (dd === d ? ' selected' : '') + '>' + pad(d.n) + ' · ' + esc(d.t) + '</option>'; }).join('') + '</select></div>' +
      '<div class="field full"><label for="j-link">Portfolio ou site</label><input type="url" id="j-link" placeholder="https://"></div>' +
      '<div class="field full"><label for="j-msg">Ton message</label><textarea id="j-msg" placeholder="Ton parcours, ce que tu veux apporter au projet."></textarea></div>' +
      '<p class="full small" id="j-err" role="alert"></p>' +
      '<div class="full"><button class="btn btn--bord" type="submit">Envoyer ma proposition</button></div></form></div>' +
      '<div><ol class="path" style="margin-top:0">' +
      '<li style="grid-template-columns:70px 1fr"><span class="big" style="font-size:48px">01</span><div><h3 class="h4">Tu proposes</h3><p>Ton métier, ton statut, le side qui t’intéresse.</p></div></li>' +
      '<li style="grid-template-columns:70px 1fr"><span class="big" style="font-size:48px">02</span><div><h3 class="h4">On te répond</h3><p>Le cercle lit chaque proposition et revient vers toi.</p></div></li>' +
      '<li style="grid-template-columns:70px 1fr"><span class="big" style="font-size:48px">03</span><div><h3 class="h4">Tu prends un side</h3><p>Ton nom apparaît sur le projet et tu rejoins ACHIRA.</p></div></li></ol>' +
      '<div class="discord-band" style="margin-top:28px"><div><p class="eyebrow">Une question avant d’écrire ?</p><p class="body">Le cercle répond aussi sur Discord.</p></div>' + dBtn() + '</div></div></div></div></section>');
    $('#join').addEventListener('submit', function (e) {
      e.preventDefault();
      var v = function (id) { return $('#' + id).value.trim(); };
      if (!v('j-name') || !v('j-email') || !v('j-metier')) { $('#j-err').textContent = 'Indique ton nom, ton e-mail et ton métier pour envoyer ta proposition.'; return; }
      var sub = { id: Date.now(), name: v('j-name'), email: v('j-email'), metier: v('j-metier'), type: v('j-type'), project: v('j-proj'), domain: v('j-dom'), link: v('j-link'), msg: v('j-msg'), when: 'à l’instant', status: 'new' };
      var thanks = function (extra) { $('#join').outerHTML = '<div class="notice full"><h3 class="h3">Merci ' + esc(v('j-name')) + '.</h3><p style="margin-top:8px">Ta proposition est bien arrivée. ' + extra + '</p></div>'; };
      if (ONLINE) {
        var row = subToRow(sub); delete row.id; delete row.notes;
        var btn = this.querySelector('button[type=submit]'); btn.disabled = true; btn.textContent = 'Envoi…';
        SB.from('submissions').insert(row).then(function (res) {
          if (res.error) { btn.disabled = false; btn.textContent = 'Envoyer ma proposition'; $('#j-err').textContent = 'L’envoi n’a pas abouti. Réessaie dans un instant ou écris-nous sur Discord.'; return; }
          thanks('Le cercle lit chaque proposition et revient vers toi par e-mail.');
        });
        return;
      }
      DB.subs.unshift(sub); save();
      thanks('Dans cette maquette, elle apparaît maintenant dans la <a class="link" href="admin/candidatures.html">dashboard <span>→</span></a>');
    });
  }

  /* ================= DASHBOARD ================= */
  var ADM = [['Pilotage'], ['index.html', 'Tableau de bord', 'admin-dash'], ['demande.html', 'Demande et membres', 'admin-demande'], ['Contenu'], ['projets.html', 'Projets', 'admin-projets'], ['modele.html', 'Modèle des sides', 'admin-modele'], ['contenus.html', 'Textes du site', 'admin-contenus'], ['membres.html', 'Membres', 'admin-membres'], ['Cercle'], ['candidatures.html', 'Candidatures', 'admin-candidatures'], ['reglages.html', 'Réglages', 'admin-reglages']];
  function newSubs() { return DB.subs.filter(function (s) { return s.status === 'new'; }).length; }
  function admin(eb, title, actions, body) {
    var cur = PAGE === 'admin-projet' ? 'admin-projets' : PAGE;
    APP.innerHTML = '<div class="adm"><aside class="side-nav"><a class="adm-logo" href="index.html">' + LOGO + '<span><b>ACHIRA</b><small>Dashboard</small></span></a>' +
      '<button type="button" class="adm-search" data-act="search">' + SEARCH_ICON + '<span>Rechercher</span><kbd>/</kbd></button>' +
      '<nav class="adm-menu" aria-label="Dashboard">' + ADM.map(function (a) {
        if (a.length === 1) return '<span class="sep">' + a[0] + '</span>';
        var b = a[2] === 'admin-candidatures' && newSubs() ? '<span class="badge">' + newSubs() + '</span>' : '';
        return '<a href="' + a[0] + '"' + (cur === a[2] ? ' aria-current="page"' : '') + '><span>' + a[1] + '</span>' + b + '</a>';
      }).join('') + '<a href="../index.html"><span>Voir le site ↗</span></a></nav>' +
      '<div class="adm-foot"><div class="adm-user"><span class="av">' + esc((ADMIN_EMAIL || 'A')[0].toUpperCase()) + '</span><div>' + esc(ADMIN_EMAIL || 'Ahmed') + '<span>Admin</span></div></div>' +
      (ONLINE ? '<p class="small" style="font-size:11px;color:var(--s-ok)">Connecté à la base · enregistrement automatique</p><button class="btn btn--line btn--sm" data-act="logout">Se déconnecter</button>' : '<p class="small" style="font-size:11px;color:var(--champ)">Maquette · modifications gardées dans ce navigateur</p>') + '</div></aside>' +
      '<main class="adm-main" id="view"><div class="adm-top"><div><p class="eyebrow">' + eb + '</p><h1 class="h1">' + title + '</h1></div><div class="row">' + (actions || '') + '</div></div>' + body + '</main></div>';
  }

  /* ----- Tableau de bord ----- */
  function aDash() {
    var pub = pubProjects(), roles = allRoles();
    var toFill = 0; pub.forEach(function (p) { var c = cov(p); toFill += c.open + c.part; });
    var byJob = {}; roles.forEach(function (r) { byJob[r.metier] = (byJob[r.metier] || 0) + 1; });
    var top = Object.keys(byJob).map(function (k) { return [k, byJob[k]]; }).sort(function (a, b) { return b[1] - a[1]; }).slice(0, 6);
    var max = top.length ? top[0][1] : 1;
    var mk = DB.projects.filter(function (p) { return p.market; });
    var topMk = mk.slice().sort(function (a, b) { return b.market.score - a.market.score; }).slice(0, 8);
    var bySec = {}; mk.forEach(function (p) { var s = p.market.sector; bySec[s] = bySec[s] || { n: 0, sum: 0, a: 0, ach: 0 }; bySec[s].n++; bySec[s].sum += p.market.score; if (p.market.priority === 'A') bySec[s].a++; if (p.achira) bySec[s].ach++; });
    var secs = Object.keys(bySec).sort(function (a, b) { return bySec[b].sum / bySec[b].n - bySec[a].sum / bySec[a].n; });
    RERENDER = aDash;
    admin('Bonjour Ahmed', 'Tableau de bord', '<a class="btn btn--bord" href="projets.html#nouveau">+ Nouveau projet</a>',
      '<div class="kpis">' +
      '<div class="panel kpi"><span class="eyebrow">Projets publiés</span><strong class="tab">' + pub.length + '</strong><span>sur ' + DB.projects.length + ' au total</span></div>' +
      '<div class="panel kpi"><span class="eyebrow">Marchés en brouillon</span><strong class="tab">' + mk.filter(function (p) { return p.status === 'draft'; }).length + '</strong><span>' + mk.filter(function (p) { return p.market.priority === 'A'; }).length + ' en priorité A</span></div>' +
      '<div class="panel kpi"><span class="eyebrow">Spécialités ACHIRA</span><strong class="tab" style="color:var(--champ)">' + DB.projects.filter(function (p) { return p.achira; }).length + '</strong><span>projets marqués du logo</span></div>' +
      '<div class="panel kpi"><span class="eyebrow">Sides à compléter</span><strong class="tab">' + toFill + '</strong><span>à pourvoir ou en partie</span></div>' +
      '<div class="panel kpi"><span class="eyebrow">Métiers recherchés</span><strong class="tab">' + roles.length + '</strong><span>affichés sur le site</span></div>' +
      '<div class="panel kpi' + (newSubs() ? ' kpi--alert' : '') + '"><span class="eyebrow">Candidatures</span><strong class="tab">' + newSubs() + '</strong><span>à traiter</span></div></div>' +
      '<div class="g2"><section class="panel"><div class="panel__h"><div><h2 class="h3">Marchés les mieux notés</h2><p class="small">Allume le logo pour en faire une spécialité ACHIRA.</p></div><a class="btn btn--line btn--sm" href="projets.html">Les ' + mk.length + ' marchés</a></div><ul class="list">' +
      topMk.map(function (p) { var m = p.market; return '<li>' + achBtn(p) + '<a class="grow" href="projet.html#' + p.slug + '"><b>' + esc(m.micro) + '</b> <span class="small">· ' + m.id + '</span><p class="small">' + esc(m.nano) + ' · ' + esc(m.city) + '</p></a><span class="score tab">' + m.score + '</span>' + prio(m) + '</li>'; }).join('') + '</ul></section>' +
      '<section class="panel"><h2 class="h3">Marchés par secteur</h2><div class="tbl"><table style="min-width:0"><thead><tr><th>Secteur</th><th>Niches</th><th>Score moyen</th><th>Prio A</th><th>ACHIRA</th></tr></thead><tbody>' +
      secs.map(function (s) { var b = bySec[s]; return '<tr><td>' + esc(s) + '</td><td class="tab">' + b.n + '</td><td class="tab">' + Math.round(b.sum / b.n) + '</td><td class="tab">' + b.a + '</td><td class="tab" style="color:var(--champ)">' + (b.ach || '') + '</td></tr>'; }).join('') + '</tbody></table></div></section></div>' +
      (function () {
        var dep = DB.projects.filter(function (p) { return p.origin === 'depot'; });
        return '<section class="panel"><div class="panel__h"><div><h2 class="h3">Projets déposés</h2><p class="small">Envoyés depuis le formulaire public : sides calculés et personnes suggérées.</p></div><a class="btn btn--line btn--sm" href="../deposer.html">Ouvrir le formulaire ↗</a></div>' +
          (dep.length ? '<ul class="list">' + dep.slice(0, 6).map(function (p) { var c = cov(p); return '<li><a class="grow" href="projet.html#' + p.slug + '"><b>' + esc(p.title) + '</b><p class="small">' + esc(p.disc) + (p.place ? ' · ' + esc(p.place) : '') + ' · ' + (p.submitter ? esc(p.submitter.name) + ' · ' + esc(p.submitter.when) : '') + '</p></a><span class="st st--open">' + c.open + ' à pourvoir</span></li>'; }).join('') + '</ul>'
            : '<p class="small">Aucun projet déposé pour l’instant. Remplis le formulaire public pour voir le parcours complet.</p>') + '</section>';
      })() +
      '<section class="panel"><div class="panel__h"><div><h2 class="h3">Couverture des sides par projet</h2><p class="small">Projets du cercle et marchés marqués « spécialité ACHIRA ».</p></div>' + legend() + '</div><div class="matrix"><table><thead><tr><th>Projet</th>' + DB.domains.map(function (d) { return '<th class="d" title="' + esc(d.t) + '">' + pad(d.n) + '</th>'; }).join('') + '</tr></thead><tbody>' +
      DB.projects.filter(function (p) { return !p.market || p.achira; }).map(function (p) { return '<tr class="click" data-act="goedit" data-s="' + p.slug + '"><td style="white-space:nowrap"><b>' + esc(p.title) + '</b><br><span class="st st--' + p.status + '">' + PUB[p.status] + '</span></td>' + DB.domains.map(function (d) { var s = (p.sides[d.id] || { s: 'na' }).s; return '<td class="c"><span class="cell ' + s + '" title="' + esc(d.t + ' : ' + ST[s]) + '"></span></td>'; }).join('') + '</tr>'; }).join('') +
      '</tbody></table></div><p class="small">' + DB.domains.map(function (d) { return pad(d.n) + ' ' + d.t; }).join(' · ') + '</p></section>' +
      '<div class="g2"><section class="panel"><div class="panel__h"><h2 class="h3">Candidatures récentes</h2><a class="btn btn--line btn--sm" href="candidatures.html">Tout voir</a></div><ul class="list">' +
      DB.subs.slice(0, 4).map(function (s) { var p = proj(s.project), d = dom(s.domain); return '<li><div class="grow"><b>' + esc(s.name) + '</b> <span class="small">· ' + esc(s.metier) + ' · ' + esc(s.type) + '</span><p class="small">' + (p ? esc(p.title) : 'Sans projet') + (d ? ' · side ' + pad(d.n) : '') + ' · ' + esc(s.when) + '</p></div><span class="st st--' + s.status + '">' + SUB[s.status] + '</span></li>'; }).join('') +
      '</ul></section><section class="panel"><h2 class="h3">Métiers les plus recherchés</h2><ul class="list">' +
      top.map(function (t) { return '<li><span class="grow">' + esc(t[0]) + '<span style="display:block;height:6px;margin-top:8px;border-radius:3px;background:var(--s-open);width:' + Math.round(t[1] / max * 100) + '%"></span></span><b class="tab">' + t[1] + '</b></li>'; }).join('') + '</ul></section></div>');
  }
  ACT.goedit = function (el) { location.href = 'projet.html#' + el.dataset.s; };

  /* ----- Projets ----- */
  var AF = { s: 'tous', q: '', o: 'tous', sec: '', pr: '', ach: false, sort: 'score' };
  function originOf(p) { return p.market ? 'marche' : p.origin === 'depot' ? 'depot' : 'achira'; }
  function sectors() { var l = []; DB.projects.forEach(function (p) { if (p.market && l.indexOf(p.market.sector) < 0) l.push(p.market.sector); }); return l.sort(); }
  function aProjets() {
    if (hash() === 'nouveau') { history.replaceState(null, '', location.pathname); return ACT.newp(); }
    var cnt = function (o) { return DB.projects.filter(function (p) { return originOf(p) === o; }).length; };
    admin('Contenu', 'Projets et marchés', '<a class="btn btn--line" href="../deposer.html">Formulaire « Déposer » ↗</a><button class="btn btn--bord" data-act="newp">+ Nouveau projet</button>',
      '<div class="toolbar">' +
      '<div class="seg" role="group" aria-label="Origine">' + [['tous', 'Tout (' + DB.projects.length + ')'], ['achira', 'Cercle (' + cnt('achira') + ')'], ['depot', 'Déposés (' + cnt('depot') + ')'], ['marche', 'Marchés (' + cnt('marche') + ')']].map(function (x) { return '<button type="button" data-act="ao" data-v="' + x[0] + '" aria-pressed="' + (AF.o === x[0]) + '">' + x[1] + '</button>'; }).join('') + '</div>' +
      '<div class="seg" role="group" aria-label="Statut">' + [['tous', 'Tous statuts'], ['pub', 'Publiés'], ['draft', 'Brouillons'], ['arch', 'Archivés']].map(function (x) { return '<button type="button" data-act="as" data-v="' + x[0] + '" aria-pressed="' + (AF.s === x[0]) + '">' + x[1] + '</button>'; }).join('') + '</div></div>' +
      '<div class="toolbar"><input type="search" data-in="aq" value="' + esc(AF.q) + '" placeholder="Rechercher : niche, ville, entreprise, MA-001…" aria-label="Rechercher">' +
      '<select data-ch="asec" aria-label="Secteur" style="max-width:220px"><option value="">Tous les secteurs</option>' + sectors().map(function (s) { return '<option' + (AF.sec === s ? ' selected' : '') + '>' + esc(s) + '</option>'; }).join('') + '</select>' +
      '<div class="seg" role="group" aria-label="Priorité">' + [['', 'Toutes priorités'], ['A', 'A'], ['B', 'B'], ['C', 'C']].map(function (x) { return '<button type="button" data-act="apr" data-v="' + x[0] + '" aria-pressed="' + (AF.pr === x[0]) + '">' + x[1] + '</button>'; }).join('') + '</div>' +
      '<button type="button" class="chip" data-act="aach" aria-pressed="' + AF.ach + '"><span class="ach-mini">' + LOGO + '</span>Spécialités ACHIRA</button>' +
      '<select data-ch="asort" aria-label="Trier" style="max-width:180px"><option value="score"' + (AF.sort === 'score' ? ' selected' : '') + '>Tri : score</option><option value="nom"' + (AF.sort === 'nom' ? ' selected' : '') + '>Tri : nom</option><option value="id"' + (AF.sort === 'id' ? ' selected' : '') + '>Tri : identifiant</option></select></div>' +
      '<p class="small" id="count"></p>' +
      '<section class="panel"><div class="tbl"><table><thead><tr><th>ACHIRA</th><th>Projet</th><th>Secteur</th><th>Ville</th><th>Score</th><th style="min-width:170px">Sides</th><th>Contact</th><th>Statut</th></tr></thead><tbody id="results"></tbody></table></div></section>');
    RERENDER = renderAP;
    renderAP();
  }
  function renderAP() {
    var q = AF.q.toLowerCase();
    var l = DB.projects.filter(function (p) {
      var m = p.market;
      return (AF.s === 'tous' || p.status === AF.s) && (AF.o === 'tous' || originOf(p) === AF.o) && (!AF.sec || (m && m.sector === AF.sec)) && (!AF.pr || (m && m.priority === AF.pr)) && (!AF.ach || p.achira) &&
        (!q || [p.title, p.sub, p.place, p.disc, p.specialite, m && m.id, m && m.contact.company].join(' ').toLowerCase().indexOf(q) > -1);
    }).sort(function (a, b) {
      if (AF.sort === 'nom') return a.title.localeCompare(b.title, 'fr');
      if (AF.sort === 'id') return (a.market ? a.market.id : '').localeCompare(b.market ? b.market.id : '');
      return (b.market ? b.market.score : 101) - (a.market ? a.market.score : 101);
    });
    $('#count').textContent = l.length + ' résultat' + (l.length > 1 ? 's' : '') + ' · ' + l.filter(function (p) { return p.achira; }).length + ' spécialité(s) ACHIRA';
    $('#results').innerHTML = l.length ? l.map(function (p) {
      var m = p.market;
      return '<tr class="click" data-act="goedit" data-s="' + p.slug + '"><td>' + achBtn(p) + '</td><td><div class="pname"><img src="' + img(p.img) + '" alt=""><div><b>' + esc(p.title) + '</b><span>' + (m ? '<span class="tab">' + m.id + '</span> · ' : '') + esc(p.sub) + '</span>' + (p.specialite ? '<span style="display:block;color:var(--champ)">' + esc(p.specialite) + '</span>' : '') + '</div></div></td>' +
        '<td>' + esc(p.disc) + '</td><td>' + esc(p.place) + '</td><td>' + (m ? '<span class="score tab">' + m.score + '</span> ' + prio(m) : '<span class="small">—</span>') + '</td><td>' + covBar(p) + '</td>' +
        '<td class="small">' + (m ? esc(m.contact.company) : '—') + '</td><td><span class="st st--' + p.status + '">' + PUB[p.status] + '</span></td></tr>';
    }).join('') : '<tr><td colspan="8" class="small">Aucun projet ne correspond à ces filtres.</td></tr>';
  }
  ACT.as = function (b) { AF.s = b.dataset.v; $$('[data-act=as]').forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); renderAP(); };
  ACT.ao = function (b) { AF.o = b.dataset.v; $$('[data-act=ao]').forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); renderAP(); };
  ACT.apr = function (b) { AF.pr = b.dataset.v; $$('[data-act=apr]').forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); renderAP(); };
  ACT.aach = function (b) { AF.ach = !AF.ach; b.setAttribute('aria-pressed', AF.ach); renderAP(); };
  CH.asec = function (el) { AF.sec = el.value; renderAP(); };
  CH.asort = function (el) { AF.sort = el.value; renderAP(); };
  IN.aq = function (el) { AF.q = el.value; renderAP(); };
  ACT.newp = function () {
    var n = 1; while (proj('nouveau-projet-' + n)) n++;
    DB.projects.unshift({ slug: 'nouveau-projet-' + n, title: 'Nouveau projet ' + n, sub: '', disc: '', place: '', year: new Date().getFullYear(), phase: 'Idée', status: 'draft', featured: false, img: 'u-cercle-3', story: '', sides: {} });
    save(); location.href = 'projet.html#nouveau-projet-' + n;
  };

  /* ----- Éditeur de projet ----- */
  var SF = 'tous', OPEN = {};
  function aProjet() {
    var p = proj(hash());
    if (!p) { admin('Projets', 'Projet introuvable', '<a class="btn btn--line" href="projets.html">Retour aux projets</a>', '<p class="body">Ce projet n’existe pas ou a été supprimé.</p>'); return; }
    var c = cov(p);
    RERENDER = aProjet;
    admin('Projets / Modifier' + (p.market ? ' · ' + p.market.id : ''), esc(p.title),
      '<a class="btn btn--line" href="../projet.html#' + p.slug + '">Voir la page ↗</a>' + (p.status === 'pub' ? '<button class="btn btn--solid" data-act="pubp" data-v="draft">Dépublier</button>' : '<button class="btn btn--bord" data-act="pubp" data-v="pub">Publier</button>'),
      '<div class="g2"><section class="panel"><div class="panel__h"><h2 class="h3">Informations</h2><span class="st st--' + p.status + '">' + PUB[p.status] + '</span></div><div class="form">' +
      '<div class="field full"><label for="e-title">Titre</label><input type="text" id="e-title" data-ch="pf" data-k="title" value="' + esc(p.title) + '"></div>' +
      '<div class="field full"><label for="e-sub">Sous-titre</label><input type="text" id="e-sub" data-ch="pf" data-k="sub" value="' + esc(p.sub) + '"></div>' +
      '<div class="field"><label for="e-disc">Discipline</label><input type="text" id="e-disc" data-ch="pf" data-k="disc" value="' + esc(p.disc) + '"></div>' +
      '<div class="field"><label for="e-place">Lieu</label><input type="text" id="e-place" data-ch="pf" data-k="place" value="' + esc(p.place) + '"></div>' +
      '<div class="field"><label for="e-year">Année</label><input type="text" id="e-year" data-ch="pf" data-k="year" value="' + esc(p.year) + '"></div>' +
      '<div class="field"><label for="e-phase">Phase</label><select id="e-phase" data-ch="pf" data-k="phase">' + PHASES.map(function (x) { return '<option' + (x === p.phase ? ' selected' : '') + '>' + x + '</option>'; }).join('') + '</select></div>' +
      '<div class="field full"><label for="e-story">L’histoire</label><textarea id="e-story" data-ch="pf" data-k="story">' + esc(p.story) + '</textarea></div>' +
      '</div></section>' +
      '<div style="display:grid;gap:14px"><section class="panel"><div class="spec-row">' + achBtn(p, true) + '<div><h2 class="h3">Spécialité ACHIRA</h2><p class="small">' + (p.achira ? 'Activée : le logo apparaît sur la carte et la page du projet.' : 'Désactivée. Clique sur le logo pour marquer ce projet comme intéressant.') + '</p></div></div>' +
      '<div class="field"><label for="e-spec">Spécialité (facultatif)</label><input type="text" id="e-spec" data-ch="pf" data-k="specialite" value="' + esc(p.specialite) + '" placeholder="Ex. Tourisme premium, Cuir, SaaS réservation…"></div></section>' +
      '<section class="panel"><h2 class="h3">Couverture</h2>' + covBar(p) + '<div class="toggle"><span>À la une sur l’accueil</span><button class="switch" role="switch" aria-label="À la une" aria-checked="' + !!p.featured + '" data-act="feat"></button></div></section>' +
      '<section class="panel"><h2 class="h3">Image de couverture</h2><div style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px">' + IMGS.map(function (i) { return '<button type="button" data-act="cover" data-v="' + i + '" aria-label="Choisir ' + i + '" style="aspect-ratio:1;border-radius:8px;overflow:hidden;outline:' + (p.img === i ? '2px solid var(--champ)' : '0') + ';outline-offset:2px"><img src="' + img(i) + '" alt="" style="width:100%;height:100%;object-fit:cover"></button>'; }).join('') + '</div></section></div></div>' +
      suggestPanel(p) +
      marketPanels(p) +
      '<section class="panel"><div class="panel__h"><div><h2 class="h3">Les sides du projet</h2><p class="small">Pour chaque side : son état, la personne qui le porte, et les métiers que le site affiche comme recherchés.</p></div>' +
      '<div class="seg" role="group" aria-label="Filtrer les sides">' + [['tous', 'Tous (' + DB.domains.length + ')'], ['req', 'Requis (' + c.req + ')'], ['open', 'À compléter (' + (c.open + c.part) + ')']].map(function (x) { return '<button type="button" data-act="sf" data-v="' + x[0] + '" aria-pressed="' + (SF === x[0]) + '">' + x[1] + '</button>'; }).join('') + '</div></div>' +
      '<div class="sedit">' + DB.domains.filter(function (d) { var s = sideOf(p, d).s; return SF === 'tous' || (SF === 'req' ? s !== 'na' : (s === 'open' || s === 'part')); }).map(function (d) {
        var s = sideOf(p, d);
        return '<div class="srow"><span class="n">' + pad(d.n) + '</span><div><b>' + esc(d.t) + '</b> ' + (d.added ? '<span class="tag-new">ajout</span>' : '') + '<p class="small">' + d.tasks.length + ' missions · ' + (s.open && s.s !== 'na' ? s.open.length : 0) + ' métier(s) recherché(s)</p></div>' +
          '<select data-ch="ss" data-d="' + d.id + '" aria-label="État du side ' + esc(d.t) + '">' + Object.keys(ST).map(function (k) { return '<option value="' + k + '"' + (s.s === k ? ' selected' : '') + '>' + ST[k] + '</option>'; }).join('') + '</select>' +
          '<select data-ch="sl" data-d="' + d.id + '" aria-label="Responsable du side ' + esc(d.t) + '"><option value="">Pas de responsable</option>' + DB.members.map(function (m) { return '<option value="' + m.id + '"' + (s.lead === m.id ? ' selected' : '') + '>' + esc(m.name) + ' · ' + esc(m.metier) + '</option>'; }).join('') + '</select>' +
          '<button class="icon" type="button" data-act="sx" data-d="' + d.id + '" aria-expanded="' + !!OPEN[d.id] + '" aria-label="Détails du side">' + (OPEN[d.id] ? '−' : '+') + '</button>' +
          (OPEN[d.id] ? '<div class="srow__x"><div><p class="lbl" style="margin-bottom:10px">Métiers recherchés (affichés sur le site)</p><div class="chips">' + d.metiers.concat((s.open || []).filter(function (o) { return d.metiers.indexOf(o) < 0; })).map(function (m) { var on = !!(s.open && s.open.indexOf(m) > -1); return '<button type="button" class="chip" data-act="sj" data-d="' + d.id + '" data-v="' + esc(m) + '" aria-pressed="' + on + '">' + esc(m) + '</button>'; }).join('') + '</div></div>' +
            '<div><p class="lbl" style="margin-bottom:10px">Missions du side</p><p class="small">' + d.tasks.map(function (t) { return esc(typeof t === 'string' ? t : t.t); }).join(' · ') + '</p><a class="link" style="margin-top:12px" href="modele.html#' + d.id + '">Modifier dans le modèle <span>→</span></a></div></div>' : '') +
          '</div>';
      }).join('') + '</div></section>' +
      '<div class="row"><button class="btn btn--line" data-act="delp" id="delp">Supprimer le projet</button></div>');
  }
  /* ----- Sides touchés et personnes suggérées (moteur) ----- */
  function projectAnalysis(p) {
    if (p.answers) return analyze(p.answers, SECTOR_EXTRA[p.answers.secteur]);
    if (p.market) return analyzeMarket(p.market, DB);
    var extra = {}; Object.keys(p.sides).forEach(function (k) { if (p.sides[k].s !== 'na') extra[k] = [3, 'Side déjà requis par le projet']; });
    return analyze({}, extra);
  }
  function suggestPanel(p) {
    var r = projectAnalysis(p);
    var src = p.answers ? 'Calculé à partir des réponses du formulaire « Déposer un projet ».' : p.market ? 'Calculé à partir de la fiche marché (secteur, solution, produit, modules).' : 'Calculé à partir des sides déjà requis.';
    var who = p.submitter ? '<p class="small">Déposé par <b>' + esc(p.submitter.name) + '</b> · <span class="sel">' + esc(p.submitter.email) + '</span> · ' + esc(p.submitter.when) + '</p>' : '';
    if (!r.list.length) return '<section class="panel"><h2 class="h3">Sides touchés et personnes suggérées</h2><p class="small">Pas encore assez d’informations pour suggérer des sides.</p></section>';
    return '<section class="panel"><div class="panel__h"><div><h2 class="h3">Sides touchés et personnes suggérées</h2><p class="small">' + src + '</p>' + who + '</div><button class="btn btn--bord btn--sm" data-act="applysug">Ouvrir les sides suggérés</button></div>' +
      '<div class="tbl"><table><thead><tr><th>Side</th><th>Niveau</th><th>État</th><th>Personnes du cercle</th><th>Métiers à trouver</th></tr></thead><tbody>' +
      r.list.slice(0, 12).map(function (x) {
        var s = sideOf(p, x.d), ppl = r.members.filter(function (mm) { return mm.ds.indexOf(x.d.id) > -1; }).slice(0, 3), miss = r.missing.filter(function (y) { return y.d.id === x.d.id; });
        return '<tr><td><b><span class="num" style="font-size:15px">' + pad(x.d.n) + '</span> ' + esc(x.d.t) + '</b><br><span class="small">' + esc(x.reasons.join(' · ')) + '</span></td><td><span class="lvl lvl--' + slug(x.level) + '">' + x.level + '</span></td><td>' + st(s.s) + '</td>' +
          '<td><div class="chips">' + (ppl.length ? ppl.map(function (mm) { var on = s.lead === mm.m.id; return '<button type="button" class="chip" data-act="assign" data-d="' + x.d.id + '" data-m="' + mm.m.id + '" aria-pressed="' + on + '" title="' + esc(mm.m.metier) + '">' + (on ? 'Confié à ' : 'Confier à ') + esc(mm.m.name) + '</button>'; }).join('') : '<span class="small">Personne pour l’instant</span>') + '</div></td>' +
          '<td><div class="chips">' + miss.slice(0, 3).map(function (y) { return '<span class="chip chip--open">' + esc(y.job) + '</span>'; }).join('') + '</div></td></tr>';
      }).join('') + '</tbody></table></div></section>';
  }
  ACT.applysug = function () {
    var p = proj(hash()), r = projectAnalysis(p), n = 0;
    r.list.forEach(function (x) {
      if (x.score < 3) return;
      var s = sideOf(p, x.d);
      if (s.s === 'na') { s.s = 'open'; n++; }
      if (!s.open || !s.open.length) { var miss = r.missing.filter(function (y) { return y.d.id === x.d.id; }).map(function (y) { return y.job; }); s.open = (miss.length ? miss : x.d.metiers).slice(0, 2); }
    });
    save(); aProjet(); toast(n ? n + ' side(s) ouvert(s)' : 'Les sides suggérés sont déjà ouverts');
  };
  ACT.assign = function (b) {
    var p = proj(hash()), d = dom(b.dataset.d), m = mem(b.dataset.m), s = sideOf(p, d);
    if (s.lead === m.id) { s.lead = null; save(); aProjet(); toast('Side ' + pad(d.n) + ' : responsable retiré'); return; }
    s.lead = m.id;
    s.open = (s.open || []).filter(function (o) { return norm(o) !== norm(m.metier); });
    s.s = s.open.length ? 'part' : 'ok';
    save(); aProjet(); toast('Side ' + pad(d.n) + ' confié à ' + m.name);
  };

  /* ----- Fiche marché et contact (colonnes du plan d'action) ----- */
  var MK = [['id', 'Identifiant'], ['sector', 'Secteur'], ['domain', 'Domaine'], ['subdomain', 'Sous-domaine'], ['micro', 'Micro-niche'], ['nano', 'Nano-niche', 1], ['city', 'Ville'], ['score', 'Score exploratoire'], ['priority', 'Priorité', 0, ['A', 'B', 'C']],
    ['hypothesis', 'Hypothèse de problème'], ['probleme', 'Problème central', 1], ['preuve', 'Preuve à collecter', 1], ['source', 'Source documentaire', 1], ['solution', 'Solution agence'], ['produit', 'Produit SaaS'], ['modules', 'Modules MVP', 1], ['kpi', 'KPI à mesurer', 1],
    ['respDecouverte', 'Responsable découverte'], ['respProduit', 'Responsable produit'], ['respDistribution', 'Responsable distribution'],
    ['statutPreuve', 'Statut de la preuve', 0, ['HYPOTHESE - audit a faire', 'Audit en cours', 'Preuve partielle', 'Preuve validée', 'Abandonné']], ['prochaineAction', 'Prochaine action', 1]];
  var CK = [['company', 'Entreprise exemple'], ['city', 'Ville de l’entreprise'], ['phone', 'Téléphone public'], ['email', 'E-mail public'], ['whatsapp', 'WhatsApp confirmé'], ['instagram', 'Instagram confirmé'], ['url', 'Source (URL)', 1], ['type', 'Type de rapprochement', 1], ['date', 'Date de consultation'],
    ['statut', 'Statut du contact', 0, ['Coordonnées publiées en ligne — non testées', 'Contacté', 'Réponse reçue', 'RDV planifié', 'Audit réalisé', 'Pas intéressé']], ['prochain', 'Prochain contact / entreprise cible', 1]];
  function mkField(f, val, ch) {
    var id = ch + '-' + f[0], v = val == null ? '' : val;
    var input = f[3] ? '<select id="' + id + '" data-ch="' + ch + '" data-k="' + f[0] + '">' + (f[3].indexOf(v) < 0 && v !== '' ? '<option>' + esc(v) + '</option>' : '') + f[3].map(function (o) { return '<option' + (o === v ? ' selected' : '') + '>' + esc(o) + '</option>'; }).join('') + '</select>'
      : '<input type="text" id="' + id + '" data-ch="' + ch + '" data-k="' + f[0] + '" value="' + esc(v) + '"' + (f[0] === 'id' ? ' readonly' : '') + '>';
    return '<div class="field' + (f[2] ? ' full' : '') + '"><label for="' + id + '">' + f[1] + '</label>' + input + '</div>';
  }
  function marketPanels(p) {
    var m = p.market;
    if (!m) return '<section class="panel"><div class="panel__h"><div><h2 class="h3">Fiche marché</h2><p class="small">Ce projet n’a pas encore de fiche marché (niche, problème, solution, contact).</p></div><button class="btn btn--line btn--sm" data-act="addmk">+ Ajouter une fiche marché</button></div></section>';
    var c = m.contact;
    return '<div class="g2" style="grid-template-columns:minmax(0,1.3fr) minmax(0,1fr)"><section class="panel"><div class="panel__h"><h2 class="h3">Marché et niche</h2><span class="row" style="gap:8px"><span class="score tab">' + esc(m.score) + '</span>' + prio(m) + '</span></div><div class="form">' + MK.map(function (f) { return mkField(f, m[f[0]], 'mk'); }).join('') + '</div></section>' +
      '<section class="panel"><div class="panel__h"><h2 class="h3">Contact</h2>' + (c.url ? '<a class="link" href="' + esc(c.url) + '" target="_blank" rel="noopener">Source <span>↗</span></a>' : '') + '</div>' +
      '<div class="contact-card"><b>' + esc(c.company || 'Entreprise à identifier') + '</b><span>' + esc(c.city) + '</span>' +
      (c.phone ? '<span class="sel">Tél. ' + esc(c.phone) + '</span>' : '') + (c.whatsapp ? '<span class="sel">WhatsApp ' + esc(c.whatsapp) + '</span>' : '') + (c.email ? '<span class="sel">' + esc(c.email) + '</span>' : '') + (c.instagram ? '<span class="sel">' + esc(c.instagram) + '</span>' : '') + '</div>' +
      (/EXEMPLE/i.test(c.type) ? '<p class="warn">Exemple sectoriel : cette entreprise ne correspond pas forcément à la nano-niche. À vérifier avant de la contacter.</p>' : '') +
      '<div class="form">' + CK.map(function (f) { return mkField(f, c[f[0]], 'ck'); }).join('') + '</div></section></div>';
  }
  CH.mk = function (el) { var p = proj(hash()), k = el.dataset.k; p.market[k] = k === 'score' ? (+el.value || 0) : el.value; save(); toast('Fiche marché enregistrée'); };
  CH.ck = function (el) { var p = proj(hash()); p.market.contact[el.dataset.k] = el.value; save(); toast('Contact enregistré'); };
  ACT.addmk = function () {
    var p = proj(hash());
    p.market = { id: 'MA-' + String(Date.now()).slice(-3), sector: p.disc, domain: '', subdomain: '', micro: p.title, nano: p.sub, city: p.place, score: 0, priority: 'C', hypothesis: '', probleme: '', preuve: '', source: '', solution: '', produit: '', modules: '', kpi: '', respDecouverte: '', respProduit: '', respDistribution: '', statutPreuve: 'HYPOTHESE - audit a faire', prochaineAction: '',
      contact: { company: '', city: '', phone: '', email: '', whatsapp: '', instagram: '', url: '', type: '', date: '', statut: 'Coordonnées publiées en ligne — non testées', prochain: '' } };
    save(); aProjet(); toast('Fiche marché ajoutée');
  };
  CH.pf = function (el) { var p = proj(hash()); var k = el.dataset.k; p[k] = k === 'year' ? (+el.value || el.value) : el.value; save(); toast('Enregistré'); if (k === 'title') $('.adm-top .h1').textContent = el.value; };
  CH.ss = function (el) { var p = proj(hash()); var s = sideOf(p, dom(el.dataset.d)); s.s = el.value; if (s.s === 'ok') s.open = []; save(); toast('Side mis à jour'); aProjet(); };
  CH.sl = function (el) { var p = proj(hash()); sideOf(p, dom(el.dataset.d)).lead = el.value ? +el.value : null; save(); toast('Responsable mis à jour'); };
  ACT.sx = function (b) { OPEN[b.dataset.d] = !OPEN[b.dataset.d]; aProjet(); };
  ACT.sf = function (b) { SF = b.dataset.v; aProjet(); };
  ACT.sj = function (b) {
    var p = proj(hash()), s = sideOf(p, dom(b.dataset.d)), m = b.dataset.v;
    s.open = s.open || []; var i = s.open.indexOf(m);
    if (i > -1) s.open.splice(i, 1); else { s.open.push(m); if (s.s === 'na' || s.s === 'ok') s.s = s.lead ? 'part' : 'open'; }
    save(); aProjet();
  };
  ACT.feat = function () { var p = proj(hash()); p.featured = !p.featured; save(); aProjet(); toast(p.featured ? 'Affiché à la une' : 'Retiré de la une'); };
  ACT.cover = function (b) { var p = proj(hash()); p.img = b.dataset.v; save(); aProjet(); };
  ACT.pubp = function (b) { var p = proj(hash()); p.status = b.dataset.v; save(); aProjet(); toast(p.status === 'pub' ? 'Projet publié sur le site' : 'Projet retiré du site'); };
  ACT.delp = function (b) {
    if (b.dataset.confirm) { DB.projects = DB.projects.filter(function (x) { return x.slug !== hash(); }); save(); location.href = 'projets.html'; return; }
    b.dataset.confirm = '1'; b.textContent = 'Confirmer la suppression'; b.className = 'btn btn--bord';
  };

  /* ----- Modèle des sides ----- */
  function aModele() {
    var cur = dom(hash()) || DB.domains[0];
    admin('Contenu', 'Modèle des sides', '<button class="btn btn--line" data-act="addd">+ Ajouter un side</button>',
      '<p class="lead" style="max-width:52ch">Le modèle décrit tous les côtés possibles d’un projet. Chaque projet reprend ce modèle et indique, side par side, ce qui est couvert et ce qui manque.</p>' +
      '<div class="g2" style="grid-template-columns:minmax(0,.8fr) minmax(0,1.4fr)"><section class="panel"><h2 class="h3">Sides</h2>' +
      DB.poles.map(function (pl) { return '<p class="lbl" style="margin-top:6px">' + esc(pl.t) + '</p><ul class="tlist">' + pl.d.map(dom).filter(Boolean).map(function (d) { return '<li style="' + (d === cur ? 'background:var(--panel2);box-shadow:inset 2px 0 0 var(--achira)' : '') + '"><a href="#' + d.id + '" data-act="pickd" data-d="' + d.id + '" class="grow"><span class="num" style="font-size:15px">' + pad(d.n) + '</span> ' + esc(d.t) + '</a>' + (d.added ? '<span class="tag-new">ajout</span>' : '') + '</li>'; }).join('') + '</ul>'; }).join('') +
      '</section><section class="panel"><div class="panel__h"><h2 class="h3">Side ' + pad(cur.n) + '</h2>' + (cur.added ? '<span class="tag-new">ajouté au schéma</span>' : '<span class="small">' + esc(cur.ref || '') + ' · arbre des métiers</span>') + '</div>' +
      '<div class="field"><label for="m-t">Nom du side</label><input type="text" id="m-t" data-ch="mt" value="' + esc(cur.t) + '"></div>' +
      '<div class="field"><span class="lbl">Missions</span><ul class="tlist">' + (function flat(list, sub, path) { return list.map(function (x, i) { var n = tnode(x), pth = path.concat(i); return '<li class="' + (sub ? 'sub' : '') + '"><span class="grow">' + (n.k === 'grp' ? '<span class="lbl" style="color:var(--champ)">' + esc(n.t) + '</span>' : esc(n.t)) + '</span>' + (!sub ? '<button class="icon" type="button" data-act="rmt" data-i="' + i + '" aria-label="Retirer ' + esc(n.t) + '">×</button>' : '') + '</li>' + (n.c && n.c.length ? flat(n.c, true, pth) : ''); }).join(''); })(cur.tasks, false, []) + '</ul>' +
      '<div class="addrow"><input type="text" id="m-add" placeholder="Nouvelle mission" aria-label="Nouvelle mission"><button class="btn btn--line btn--sm" data-act="addt">Ajouter</button></div></div>' +
      ['comp', 'metiers'].map(function (k) { return '<div class="field"><span class="lbl">' + (k === 'comp' ? 'Compétences requises' : 'Métiers') + '</span><div class="chips">' + cur[k].map(function (x, i) { return '<span class="chip">' + esc(x) + ' <button type="button" data-act="rmc" data-k="' + k + '" data-i="' + i + '" aria-label="Retirer ' + esc(x) + '" style="font-size:14px;line-height:1">×</button></span>'; }).join('') + '</div><div class="addrow"><input type="text" id="m-' + k + '" placeholder="' + (k === 'comp' ? 'Nouvelle compétence' : 'Nouveau métier') + '" aria-label="Ajouter"><button class="btn btn--line btn--sm" data-act="addc" data-k="' + k + '">Ajouter</button></div></div>'; }).join('') +
      '<p class="small">Profils acceptés pour chaque métier : ' + DB.pros.join(' · ') + '</p></section></div>' +
      '<section class="panel"><h2 class="h3">Le schéma complet</h2>' + mindmap('PROJET', DB.domains, null) + '</section>');
  }
  function curD() { return dom(hash()) || DB.domains[0]; }
  ACT.pickd = function (a, e) { e.preventDefault(); history.replaceState(null, '', '#' + a.dataset.d); aModele(); };
  CH.mt = function (el) { curD().t = el.value; save(); toast('Side renommé'); aModele(); };
  ACT.rmt = function (b) { curD().tasks.splice(+b.dataset.i, 1); save(); aModele(); toast('Mission retirée'); };
  ACT.addt = function () { var v = $('#m-add').value.trim(); if (!v) return; curD().tasks.push(v); save(); aModele(); toast('Mission ajoutée'); };
  ACT.rmc = function (b) { curD()[b.dataset.k].splice(+b.dataset.i, 1); save(); aModele(); };
  ACT.addc = function (b) { var k = b.dataset.k, v = $('#m-' + k).value.trim(); if (!v) return; curD()[k].push(v); save(); aModele(); toast('Ajouté'); };
  ACT.addd = function () {
    var n = DB.domains.length + 1, id = 'd' + Date.now();
    DB.domains.push({ id: id, n: n, t: 'Nouveau side', added: true, tasks: [], comp: [], metiers: [] });
    DB.poles[DB.poles.length - 1].d.push(id); save(); history.replaceState(null, '', '#' + id); aModele(); toast('Side ajouté');
  };

  /* ----- Demande et membres : ce que les projets demandent face à ce que le cercle offre ----- */
  var DM = { src: 'sans-marches' };
  function demandData() {
    var projs = DB.projects.filter(function (p) { return p.status !== 'arch' && (DM.src === 'tout' || (DM.src === 'marches' ? p.market : !p.market)); });
    var jobs = {}, sides = {}, mem = {};
    function J(j) { var k = norm(j); return jobs[k] = jobs[k] || { job: j, projets: [], membres: jobMembers(j), interesses: [], sides: [] }; }
    DB.domains.forEach(function (d) { sides[d.id] = { d: d, open: 0, part: 0, ok: 0, projets: [] }; d.metiers.forEach(function (j) { var x = J(j); if (x.sides.indexOf(d) < 0) x.sides.push(d); }); });
    projs.forEach(function (p) {
      Object.keys(p.sides).forEach(function (k) {
        var s = p.sides[k], sd = sides[k]; if (!sd || s.s === 'na') return;
        sd[s.s]++; if (s.s !== 'ok') sd.projets.push(p);
        if (s.s !== 'ok') (s.open || []).forEach(function (j) { var x = J(j); if (x.projets.indexOf(p) < 0) x.projets.push(p); });
        (s.suggest || []).concat(s.lead ? [s.lead] : []).forEach(function (id) { mem[id] = mem[id] || { suggere: 0, porte: 0, projets: [] }; if (id === s.lead) mem[id].porte++; else mem[id].suggere++; if (mem[id].projets.indexOf(p) < 0) mem[id].projets.push(p); });
      });
    });
    DB.subs.forEach(function (s) { if (s.status !== 'no' && s.metier) J(s.metier).interesses.push(s); });
    var jl = Object.keys(jobs).map(function (k) { var x = jobs[k]; x.ecart = x.projets.length - x.membres.length - x.interesses.filter(function (s) { return s.status === 'new'; }).length; return x; })
      .filter(function (x) { return x.projets.length || x.membres.length || x.interesses.length; }).sort(function (a, b) { return b.ecart - a.ecart || b.projets.length - a.projets.length; });
    var ml = DB.members.map(function (m) { return { m: m, d: mem[m.id] || { suggere: 0, porte: 0, projets: [] } }; }).sort(function (a, b) { return (b.d.suggere + b.d.porte) - (a.d.suggere + a.d.porte); });
    var dep = projs.filter(function (p) { return p.answers; });
    return { projs: projs, jobs: jl, sides: DB.domains.map(function (d) { return sides[d.id]; }), members: ml, depots: dep };
  }
  function bar(v, max, col) { return '<span class="dbar"><i style="width:' + (max ? Math.round(v / max * 100) : 0) + '%;background:' + col + '"></i></span>'; }
  function aDemande() {
    var D = demandData(), maxJ = Math.max.apply(null, D.jobs.map(function (x) { return x.projets.length; }).concat([1])), maxS = Math.max.apply(null, D.sides.map(function (s) { return s.open + s.part; }).concat([1]));
    var gaps = D.jobs.filter(function (x) { return x.ecart > 0; });
    RERENDER = aDemande;
    admin('Pilotage', 'Demande et membres', '',
      '<p class="lead" style="max-width:60ch">Ce que les projets demandent, face à ce que le cercle peut offrir. Plus il y aura de projets déposés et de membres, plus ces chiffres guideront le recrutement et les suggestions.</p>' +
      '<div class="toolbar"><div class="seg" role="group" aria-label="Projets pris en compte">' + [['sans-marches', 'Projets du cercle et déposés'], ['marches', 'Marchés seulement'], ['tout', 'Tout']].map(function (x) { return '<button type="button" data-act="dmsrc" data-v="' + x[0] + '" aria-pressed="' + (DM.src === x[0]) + '">' + x[1] + '</button>'; }).join('') + '</div><span class="small tab">' + D.projs.length + ' projets analysés</span></div>' +
      '<div class="kpis">' +
      '<div class="panel kpi"><span class="eyebrow">Métiers demandés</span><strong class="tab">' + D.jobs.filter(function (x) { return x.projets.length; }).length + '</strong><span>par au moins un projet</span></div>' +
      '<div class="panel kpi kpi--alert"><span class="eyebrow">Métiers sans personne</span><strong class="tab">' + D.jobs.filter(function (x) { return x.projets.length && !x.membres.length && !x.interesses.length; }).length + '</strong><span>à recruter en priorité</span></div>' +
      '<div class="panel kpi"><span class="eyebrow">Personnes intéressées</span><strong class="tab">' + DB.subs.filter(function (s) { return s.status === 'new'; }).length + '</strong><span>candidatures à traiter</span></div>' +
      '<div class="panel kpi"><span class="eyebrow">Questionnaires</span><strong class="tab">' + D.depots.length + '</strong><span>projets déposés avec réponses</span></div></div>' +

      '<section class="panel"><div class="panel__h"><div><h2 class="h3">Métiers : demande face aux membres</h2><p class="small">Demande = projets qui ont ce métier en poste ouvert. Écart = demande − membres − candidatures en attente.</p></div></div><div class="tbl"><table><thead><tr><th>Métier</th><th>Sides</th><th style="min-width:160px">Demande</th><th>Membres</th><th>Intéressés</th><th>Écart</th><th></th></tr></thead><tbody>' +
      D.jobs.slice(0, 30).map(function (x) {
        return '<tr><td><b>' + esc(x.job) + '</b></td><td class="small tab">' + x.sides.map(function (d) { return pad(d.n); }).join(' · ') + '</td><td><span class="row" style="gap:10px;flex-wrap:nowrap">' + bar(x.projets.length, maxJ, 'var(--s-open)') + '<b class="tab">' + x.projets.length + '</b></span></td>' +
          '<td class="tab">' + (x.membres.length ? x.membres.map(function (m) { return esc(m.name); }).join(', ') : '<span class="small">aucun</span>') + '</td><td class="tab">' + (x.interesses.length || '<span class="small">—</span>') + '</td>' +
          '<td><span class="gap gap--' + (x.ecart > 0 ? 'neg' : 'ok') + ' tab">' + (x.ecart > 0 ? '−' + x.ecart : 'OK') + '</span></td>' +
          '<td><a class="btn btn--line btn--sm" href="../membres.html#job-' + slug(x.job) + '">Membres</a></td></tr>';
      }).join('') + '</tbody></table></div></section>' +

      '<div class="g2"><section class="panel"><h2 class="h3">Sides les plus demandés</h2><ul class="list">' +
      D.sides.slice().sort(function (a, b) { return (b.open + b.part) - (a.open + a.part); }).filter(function (s) { return s.open + s.part + s.ok; }).slice(0, 10).map(function (s) {
        var nm = DB.members.filter(function (m) { return memberDomainsIn(DB, m).indexOf(s.d.id) > -1; }).length;
        return '<li><span class="grow"><b><span class="num" style="font-size:15px">' + pad(s.d.n) + '</span> ' + esc(s.d.t) + '</b><span class="row" style="gap:10px;margin-top:6px;flex-wrap:nowrap">' + bar(s.open + s.part, maxS, 'var(--s-open)') + '<span class="small tab">' + s.open + ' à pourvoir · ' + s.part + ' en partie · ' + s.ok + ' couverts</span></span></span><span class="small tab">' + nm + ' membre' + (nm > 1 ? 's' : '') + '</span></li>';
      }).join('') + '</ul></section>' +
      '<section class="panel"><h2 class="h3">Membres les plus sollicités</h2><p class="small">Suggérés par le moteur ou responsables d’un side.</p><ul class="list">' +
      D.members.slice(0, 10).map(function (x) { return '<li>' + avatar(x.m) + '<span class="grow"><b>' + esc(x.m.name) + '</b><span class="small" style="display:block">' + esc(x.m.metier) + ' · ' + esc(x.m.type) + '</span></span><span class="small tab">' + x.d.porte + ' porté(s) · ' + x.d.suggere + ' suggéré(s)</span></li>'; }).join('') + '</ul></section></div>' +

      '<div class="g2"><section class="panel"><h2 class="h3">À recruter en priorité</h2><p class="small">Métiers demandés sans membre ni candidature. Partage-les sur Discord ou mets-les en avant sur la page Métiers.</p><div class="chips">' +
      (gaps.length ? gaps.slice(0, 16).map(function (x) { return '<span class="chip chip--open">' + esc(x.job) + ' · ' + x.projets.length + '</span>'; }).join('') : '<span class="small">Aucun écart : chaque métier demandé a au moins une personne.</span>') + '</div>' + dBtn() + '</section>' +
      '<section class="panel"><h2 class="h3">Réponses au questionnaire</h2>' + (D.depots.length ? QUESTIONS.map(function (q) {
        return '<div><p class="lbl" style="margin:8px 0">' + esc(q.t) + '</p>' + q.o.map(function (o) { var n = D.depots.filter(function (p) { return (p.answers[q.k] || []).indexOf(o[0]) > -1; }).length; return '<div class="row" style="gap:10px;flex-wrap:nowrap;margin:4px 0"><span class="small" style="width:46%">' + esc(o[1]) + '</span>' + bar(n, D.depots.length, 'var(--champ)') + '<span class="small tab">' + n + '</span></div>'; }).join('') + '</div>';
      }).join('') : '<p class="small">Aucun questionnaire rempli pour l’instant. Les réponses des projets déposés s’afficheront ici.</p><a class="btn btn--line btn--sm" href="../deposer.html">Remplir le questionnaire ↗</a>') + '</section></div>');
  }
  ACT.dmsrc = function (b) { DM.src = b.dataset.v; aDemande(); };

  /* ----- Textes du site ----- */
  var LABELS = { heroTitle: 'Accueil · titre', heroLead: 'Accueil · accroche', heroEyebrow: 'Accueil · sous-titre', manifesto: 'Manifeste', sidesIntro: 'Les sides d’un projet · introduction', quote: 'Citation · première partie', quoteEm: 'Citation · seconde partie', motto: 'Devise du footer' };
  function aContenus() {
    admin('Site public', 'Textes du site', '<a class="btn btn--line" href="../index.html">Voir l’accueil ↗</a>',
      '<p class="lead">Chaque texte affiché sur le site se modifie ici. Les changements sont visibles dès que tu ouvres la page.</p>' +
      '<section class="panel">' + Object.keys(LABELS).map(function (k) { var v = DB.content[k] || ''; return '<div class="field"><label for="c-' + k + '">' + LABELS[k] + '</label>' + (v.length > 70 ? '<textarea id="c-' + k + '" data-ch="ct" data-k="' + k + '">' + esc(v) + '</textarea>' : '<input type="text" id="c-' + k + '" data-ch="ct" data-k="' + k + '" value="' + esc(v) + '">') + '</div>'; }).join('') + '</section>');
  }
  CH.ct = function (el) { DB.content[el.dataset.k] = el.value; save(); toast('Texte enregistré'); };

  /* ----- Membres ----- */
  var NEWD = [];
  function aMembres() {
    admin('Contenu', 'Membres', '',
      '<section class="panel"><div class="tbl"><table><thead><tr><th>Membre</th><th>Métier</th><th>Statut</th><th>Sides</th><th></th></tr></thead><tbody>' +
      DB.members.map(function (m) { return '<tr><td><div class="pname">' + avatar(m, true) + '<div><b>' + esc(m.name) + '</b><span>' + esc(m.city) + '</span></div></div></td><td>' + esc(m.metier) + '</td><td>' + esc(m.type) + '</td><td><div class="chips">' + memberDomainsIn(DB, m).map(dom).filter(Boolean).map(function (d) { return '<span class="chip" title="' + esc(d.t) + '">' + pad(d.n) + '</span>'; }).join('') + '</div></td><td><button class="icon" data-act="rmm" data-id="' + m.id + '" aria-label="Retirer ' + esc(m.name) + '">×</button></td></tr>'; }).join('') +
      '</tbody></table></div></section>' +
      '<section class="panel"><h2 class="h3">Ajouter un membre</h2><div class="form">' +
      '<div class="field"><label for="n-name">Nom</label><input type="text" id="n-name"></div><div class="field"><label for="n-metier">Métier (de l’arbre)</label><input type="text" id="n-metier" list="n-jobs" placeholder="Ex. Comptable, Designer…"><datalist id="n-jobs">' + allJobs().map(function (j) { return '<option value="' + esc(j) + '">'; }).join('') + '</datalist></div>' +
      '<div class="field"><label for="n-type">Statut</label><select id="n-type">' + DB.pros.map(function (p) { return '<option>' + p + '</option>'; }).join('') + '</select></div><div class="field"><label for="n-city">Ville</label><input type="text" id="n-city"></div>' +
      '<div class="field full"><label for="n-bio">Bio courte</label><input type="text" id="n-bio"></div>' +
      '<div class="field full"><span class="lbl">Sides qu’il ou elle peut porter</span><div class="chips">' + DB.domains.map(function (d) { return '<button type="button" class="chip" data-act="nd" data-d="' + d.id + '" aria-pressed="' + (NEWD.indexOf(d.id) > -1) + '">' + pad(d.n) + ' ' + esc(d.t) + '</button>'; }).join('') + '</div></div>' +
      '<p class="full small" id="n-err" role="alert"></p><div class="full"><button class="btn btn--bord" data-act="addm">Ajouter le membre</button></div></div></section>');
  }
  ACT.nd = function (b) { var i = NEWD.indexOf(b.dataset.d); if (i > -1) NEWD.splice(i, 1); else NEWD.push(b.dataset.d); b.setAttribute('aria-pressed', i < 0); };
  ACT.addm = function () {
    var v = function (id) { return $('#' + id).value.trim(); };
    if (!v('n-name') || !v('n-metier')) { $('#n-err').textContent = 'Indique au moins le nom et le métier.'; return; }
    DB.members.push({ id: Date.now(), slug: slug(v('n-name')), name: v('n-name'), metier: v('n-metier'), type: v('n-type'), city: v('n-city'), bio: v('n-bio'), domains: NEWD.slice(), img: '' });
    NEWD = []; save(); aMembres(); toast('Membre ajouté');
  };
  ACT.rmm = function (b) { DB.members = DB.members.filter(function (m) { return m.id !== +b.dataset.id; }); save(); aMembres(); toast('Membre retiré'); };

  /* ----- Candidatures ----- */
  var CF = 'new';
  function aCandidatures() {
    admin('Cercle', 'Candidatures', '',
      '<div class="seg" role="group" aria-label="Filtrer">' + [['new', 'À traiter'], ['ok', 'Acceptées'], ['no', 'Refusées'], ['all', 'Toutes']].map(function (x) { return '<button type="button" data-act="cf" data-v="' + x[0] + '" aria-pressed="' + (CF === x[0]) + '">' + x[1] + '</button>'; }).join('') + '</div>' +
      '<section class="panel"><ul class="list">' + (function () {
        var l = DB.subs.filter(function (s) { return CF === 'all' || s.status === CF; });
        if (!l.length) return '<li><p class="small">Aucune candidature ici. Les propositions envoyées depuis la page Rejoindre arrivent dans cette liste.</p></li>';
        return l.map(function (s) {
          var p = proj(s.project), d = dom(s.domain);
          return '<li style="align-items:flex-start"><span class="av av--lg">' + esc(s.name[0]) + '</span><div class="grow" style="display:grid;gap:6px"><div class="row" style="gap:8px"><b>' + esc(s.name) + '</b><span class="chip">' + esc(s.metier) + '</span><span class="small">' + esc(s.type) + '</span><span class="st st--' + s.status + '">' + SUB[s.status] + '</span></div>' +
            '<p class="small">' + (p ? 'Projet : ' + esc(p.title) : 'Sans projet') + (d ? ' · Side ' + pad(d.n) + ' ' + esc(d.t) : '') + ' · ' + esc(s.when) + '</p>' + (s.msg ? '<p style="color:var(--iv80)">' + esc(s.msg) + '</p>' : '') + '<p class="small" style="user-select:all">' + esc(s.email) + (s.link ? ' · ' + esc(s.link) : '') + '</p></div>' +
            (s.status === 'new' ? '<div class="row"><button class="btn btn--bord btn--sm" data-act="acc" data-id="' + s.id + '">' + (p && d ? 'Accepter et confier le side' : 'Accepter') + '</button><button class="btn btn--line btn--sm" data-act="ref" data-id="' + s.id + '">Refuser</button></div>' : '') + '</li>';
        }).join('');
      })() + '</ul></section>');
  }
  ACT.cf = function (b) { CF = b.dataset.v; aCandidatures(); };
  ACT.acc = function (b) {
    var s = DB.subs.find(function (x) { return x.id === +b.dataset.id; }); s.status = 'ok';
    var m = { id: Date.now(), slug: slug(s.name), name: s.name, metier: s.metier, type: s.type, city: '', bio: s.msg || '', domains: s.domain ? [s.domain] : [], img: '' };
    DB.members.push(m);
    var p = proj(s.project), d = dom(s.domain), msg = 'Accepté · ajouté aux membres';
    if (p && d) {
      var side = sideOf(p, d); if (!side.lead) side.lead = m.id;
      if (side.open) side.open = side.open.filter(function (o) { return o !== s.metier; });
      if (side.s === 'open' || side.s === 'part') side.s = side.open && side.open.length ? 'part' : 'ok';
      if (side.s === 'na') side.s = 'ok';
      msg = 'Side ' + pad(d.n) + ' confié à ' + s.name;
    }
    save(); aCandidatures(); toast(msg);
  };
  ACT.ref = function (b) { DB.subs.find(function (x) { return x.id === +b.dataset.id; }).status = 'no'; save(); aCandidatures(); toast('Candidature refusée'); };

  /* ----- Réglages ----- */
  function aReglages() {
    admin('Administration', 'Réglages', '',
      '<div class="g2 g2--even"><section class="panel"><h2 class="h3">Général</h2>' +
      '<div class="field"><label for="r-name">Nom du site</label><input type="text" id="r-name" data-ch="rs" data-k="siteName" value="' + esc(DB.settings.siteName) + '"></div>' +
      '<div class="field"><label for="r-ak">Adresse du site AKARBI</label><input type="text" id="r-ak" data-ch="rs" data-k="akarbiUrl" value="' + esc(DB.settings.akarbiUrl) + '" placeholder="À renseigner"></div>' +
      '<div class="field"><label for="r-ig">Compte Instagram ACHIRA</label><input type="text" id="r-ig" data-ch="rs" data-k="instagram" value="' + esc(DB.settings.instagram) + '" placeholder="Bientôt"></div>' +
      '<div class="field"><label for="r-dc">Lien d’invitation Discord</label><input type="text" id="r-dc" data-ch="rs" data-k="discord" value="' + esc(discordUrl()) + '"><span class="small">Utilisé partout sur le site : footer, menu, accueil, cercle, sides, métiers, rejoindre.</span></div></section>' +
      '<section class="panel"><h2 class="h3">Profils professionnels</h2><p class="small">Proposés pour chaque métier, dans les candidatures et sur le site.</p><div class="chips">' + DB.pros.map(function (p) { return '<span class="chip">' + p + '</span>'; }).join('') + '</div>' +
      '<h2 class="h3" style="margin-top:8px">Utilisateurs</h2><ul class="list"><li><span class="grow"><b>Ahmed</b><br><span class="small">Admin</span></span></li><li><span class="grow"><b>Éditeur</b><br><span class="small">Peut modifier les projets et les textes</span></span><span class="st st--draft">Invitation à envoyer</span></li></ul></section></div>' +
      (ONLINE
        ? '<div class="g2 g2--even"><section class="panel"><h2 class="h3">Mon mot de passe</h2><div class="field"><label for="r-pw">Nouveau mot de passe (10 caractères minimum)</label><input type="password" id="r-pw" autocomplete="new-password"></div><p class="small" id="r-pw-msg" role="status"></p><div><button class="btn btn--bord" data-act="setpw">Changer mon mot de passe</button></div></section>' +
          '<section class="panel"><h2 class="h3">Données</h2><p class="body">Tout est enregistré dans la base Supabase du projet Achira, automatiquement, à chaque modification.</p><div><button class="btn btn--line" data-act="reload">Recharger depuis la base</button></div></section></div>'
        : '<section class="panel"><h2 class="h3">Données de la maquette</h2><p class="body">Tes modifications sont gardées dans ce navigateur. Tu peux revenir aux données d’exemple à tout moment.</p><div><button class="btn btn--line" data-act="reset">Revenir aux données d’exemple</button></div></section>'));
  }
  CH.rs = function (el) { DB.settings[el.dataset.k] = el.value; save(); toast('Réglage enregistré'); };
  ACT.reset = function (b) {
    if (!b.dataset.confirm) { b.dataset.confirm = '1'; b.textContent = 'Confirmer : tout effacer'; b.className = 'btn btn--bord'; return; }
    try { localStorage.removeItem(KEY); } catch (e) {} DB = fresh(); aReglages(); toast('Données d’exemple restaurées');
  };

  /* ---------- Démarrage ---------- */
  var PAGES = { home: pHome, sides: pSides, deposer: pDeposer, projets: pProjets, projet: pProjet, metiers: pMetiers, cercle: pCercle, membres: pMembres, rejoindre: pRejoindre,
    'admin-dash': aDash, 'admin-demande': aDemande,'admin-projets': aProjets, 'admin-projet': aProjet, 'admin-modele': aModele, 'admin-contenus': aContenus, 'admin-membres': aMembres, 'admin-candidatures': aCandidatures, 'admin-reglages': aReglages };
  ACT.logout = async function () { await SB.auth.signOut(); loginView('Tu es déconnecté.'); };
  ACT.reload = async function () { try { await loadAdmin(); RERENDER(); toast('Données rechargées depuis la base'); } catch (e) { toast(e.message); } };
  ACT.setpw = async function () {
    var pw = $('#r-pw').value, out = $('#r-pw-msg');
    if (pw.length < 10) { out.textContent = 'Choisis au moins 10 caractères.'; return; }
    var r = await SB.auth.updateUser({ password: pw });
    out.textContent = r.error ? 'Échec : ' + r.error.message : 'Mot de passe changé.'; if (!r.error) $('#r-pw').value = '';
  };

  /* ---------- Démarrage : données de la base si elle est configurée, sinon maquette locale ---------- */
  var ADMIN_EMAIL = '';
  function start() { (PAGES[PAGE] || pHome)(); }
  async function boot() {
    if (!ONLINE) return start();
    try {
      if (PAGE.indexOf('admin-') === 0) {
        var s = await SB.auth.getSession();
        if (!s.data.session) return loginView();
        ADMIN_EMAIL = s.data.session.user.email || '';
        APP.innerHTML = '<div class="login"><p class="small">Chargement des données…</p></div>';
        await loadAdmin();
      } else await loadPublic();
    } catch (e) {
      if (PAGE.indexOf('admin-') === 0) { await SB.auth.signOut(); return loginView(e.message); }
      ONLINE = false; // base injoignable : le site public s'affiche avec ses données de démonstration
    }
    start();
  }
  boot();
  window.addEventListener('hashchange', function () {
    if (PAGE === 'projet') pProjet();
    else if (PAGE === 'admin-projet') aProjet();
    else if (PAGE === 'admin-modele') aModele();
    else if (PAGE === 'metiers') { F.d = dom(hash()) ? hash() : ''; pMetiers(); }
    else if (PAGE === 'membres') pMembres();
  });
})();
