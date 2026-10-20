/* ACHIRA — données de la maquette.
   Le modèle des sides vient de arbre.js (arbre des métiers et domaines, Maroc).
   Projets, membres et candidatures sont des exemples. */
window.ACHIRA_DATA = {
  pros: ['Salarié', 'Indépendant', 'Cabinet'],

  /* Les sides (domaines, tâches, compétences, métiers) viennent de arbre.js. */

  members: [
    { id: 1, slug: 'ahmed', name: 'Ahmed', metier: 'Tailleur', type: 'Indépendant', city: 'Casablanca', domains: ['d14'], img: 'u-cercle-3', bio: 'Vingt ans d’atelier. Il a monté le premier patron de la Veste Signature.' },
    { id: 2, slug: 'marouan', name: 'Marouan', metier: 'Photographe', type: 'Indépendant', city: 'Fès', domains: ['d13', 'd15'], img: 'u-cercle-1', bio: 'Elle photographie les mains plus que les visages.' },
    { id: 3, slug: 'wassim', name: 'Wassim', metier: 'Designer', type: 'Salarié', city: 'Casablanca', domains: ['d13'], img: 'u-cercle-2', bio: 'Designer produit, il dessine le coffret ACHIRA.' },
    { id: 4, slug: 'meriem-a', name: 'Meriem A.', metier: 'Expert-comptable', type: 'Cabinet', city: 'Rabat', domains: ['d1', 'd3', 'd12'], img: '', bio: 'Son cabinet tient les comptes des projets du cercle.' },
    { id: 5, slug: 'othmane-k', name: 'Othmane K.', metier: 'Juriste d’entreprise', type: 'Indépendant', city: 'Casablanca', domains: ['d7'], img: '', bio: 'Statuts, contrats, propriété des créations.' },
    { id: 6, slug: 'sara-d', name: 'Sara D.', metier: 'Développeur web', type: 'Indépendant', city: 'Paris', domains: ['d16', 'd9'], img: '', bio: 'Elle construit les outils du cercle depuis la diaspora.' },
    { id: 7, slug: 'nora-l', name: 'Nora L.', metier: 'Mannequin', type: 'Indépendant', city: 'Paris', domains: ['d15'], img: '', bio: 'Elle porte les pièces lors des essayages et des tournages.' },
    { id: 8, slug: 'youssef-m', name: 'Youssef M.', metier: 'Contrôleur de gestion', type: 'Indépendant', city: 'Casablanca', domains: ['d2', 'd4'], img: '', bio: 'Coûts de revient, marges, budgets : il rend les chiffres lisibles.' },
    { id: 9, slug: 'hind-b', name: 'Hind B.', metier: 'Gestionnaire de paie', type: 'Cabinet', city: 'Rabat', domains: ['d6'], img: '', bio: 'Son cabinet gère la paie et les déclarations CNSS de petites équipes.' },
    { id: 10, slug: 'amine-r', name: 'Amine R.', metier: 'Community manager', type: 'Indépendant', city: 'Marrakech', domains: ['d15'], img: '', bio: 'Réseaux sociaux et contenus pour le tourisme et la restauration.' },
    { id: 11, slug: 'rania-t', name: 'Rania T.', metier: 'Conseiller financier', type: 'Salarié', city: 'Tanger', domains: ['d12', 'd4'], img: '', bio: 'Business plans et dossiers de financement pour les jeunes entreprises.' },
    { id: 12, slug: 'ilyes', name: 'Ilyes', metier: 'Développeur web', type: 'Indépendant', city: 'Rabat', domains: ['d16'], img: '', bio: 'Sites et outils numériques pour les projets du cercle.' }
  ],

  /* s : ok = couvert · part = en partie · open = à pourvoir · na = non requis */
  projects: [
    { slug: 'premiere-trace', title: 'Première trace', sub: 'La Veste Signature, de la tannerie au cercle', disc: 'Mode et cuir', place: 'Casablanca', year: 2026, phase: 'Production', status: 'pub', featured: true, img: 'poster-achira', achira: true, specialite: 'Mode et cuir',
      story: 'Une rencontre à la tannerie, puis six mois d’essais. La première pièce AKARBI réunit un tailleur, une photographe, un designer et un cabinet comptable autour d’une même veste.',
      sides: {
        d1: { s: 'ok', lead: 4 }, d2: { s: 'part', lead: 4, open: ['Contrôleur de gestion'] }, d3: { s: 'ok', lead: 4 },
        d4: { s: 'open', open: ['Trésorier', 'Directeur financier'] }, d5: { s: 'part', open: ['Assistant ADV'] }, d6: { s: 'na' },
        d7: { s: 'ok', lead: 5 }, d8: { s: 'na' }, d9: { s: 'part', lead: 6, open: ['Consultant ERP'] }, d10: { s: 'open', open: ['Acheteur'] },
        d11: { s: 'na' }, d12: { s: 'ok', lead: 4 }, d13: { s: 'ok', lead: 3 }, d14: { s: 'ok', lead: 1 }, d15: { s: 'part', lead: 2, open: ['Vidéaste'] }, d16: { s: 'ok', lead: 6 } } },

    { slug: 'atelier-casablanca', title: 'Atelier Casablanca', sub: 'Ouvrir un atelier partagé pour les artisans du cercle', disc: 'Lieu et artisanat', place: 'Casablanca', year: 2026, phase: 'Lancement', status: 'pub', featured: true, img: 'u-cercle-1',
      story: 'Un lieu où les artisans du cercle travaillent côte à côte, partagent les machines et accueillent les essayages.',
      sides: {
        d1: { s: 'part', lead: 4, open: ['Assistant comptable'] }, d2: { s: 'open', open: ['Contrôleur de gestion'] }, d3: { s: 'ok', lead: 4 },
        d4: { s: 'open', open: ['Trésorier'] }, d5: { s: 'na' }, d6: { s: 'open', open: ['Gestionnaire de paie'] },
        d7: { s: 'part', lead: 5, open: ['Notaire'] }, d8: { s: 'na' }, d9: { s: 'na' }, d10: { s: 'open', open: ['Responsable achats'] },
        d11: { s: 'open', open: ['Courtier en assurance'] }, d12: { s: 'part', lead: 4, open: ['Conseiller financier'] }, d13: { s: 'ok', lead: 3 }, d14: { s: 'part', lead: 1, open: ['Maroquinier', 'Responsable production'] }, d15: { s: 'open', open: ['Chargé de communication'] }, d16: { s: 'na' } } },

    { slug: 'coffret-achira', title: 'Coffret ACHIRA', sub: 'La lettre et l’écrin de la première pièce', disc: 'Design', place: 'Casablanca', year: 2025, phase: 'Terminé', status: 'pub', featured: true, img: 'end-achira',
      story: 'Un coffret pensé comme une lettre que l’on ouvre. Il accompagne chaque veste et fait entrer son propriétaire dans le cercle.',
      sides: {
        d1: { s: 'ok', lead: 4 }, d2: { s: 'ok', lead: 4 }, d3: { s: 'ok', lead: 4 }, d4: { s: 'na' }, d5: { s: 'ok', lead: 4 }, d6: { s: 'na' },
        d7: { s: 'ok', lead: 5 }, d8: { s: 'na' }, d9: { s: 'na' }, d10: { s: 'ok', lead: 3 }, d11: { s: 'na' }, d12: { s: 'na' },
        d13: { s: 'ok', lead: 3 }, d14: { s: 'ok', lead: 1 }, d15: { s: 'ok', lead: 2 }, d16: { s: 'na' } } },

    { slug: 'gnawa-cuir', title: 'Gnawa / Cuir', sub: 'Une bande-son pour l’atelier', disc: 'Musique', place: 'Essaouira', year: 2026, phase: 'Idée', status: 'draft', featured: false, img: 'u-cercle-2',
      story: 'Enregistrer les sons de l’atelier et les mêler au guembri pour la prochaine collection.',
      sides: {
        d1: { s: 'open', open: ['Comptable'] }, d7: { s: 'open', open: ['Juriste d’entreprise'] }, d12: { s: 'open', open: ['Conseiller financier'] },
        d13: { s: 'part', lead: 2, open: ['Directeur artistique'] }, d15: { s: 'open', open: ['Vidéaste', 'Community manager'] } } }
  ],

  subs: [
    { id: 1, name: 'Ines M.', email: 'ines@exemple.ma', metier: 'Trésorier', type: 'Indépendant', project: 'premiere-trace', domain: 'd4', msg: 'Dix ans en banque, j’accompagne aujourd’hui des PME sur leur trésorerie.', when: 'il y a 2 h', status: 'new' },
    { id: 2, name: 'Omar K.', email: 'omar@exemple.ma', metier: 'Vidéaste', type: 'Indépendant', project: 'premiere-trace', domain: 'd15', msg: 'Je propose de filmer le prochain chapitre, du cuir brut à l’essayage.', when: 'hier', status: 'new' },
    { id: 3, name: 'Cabinet Atlas', email: 'contact@exemple.ma', metier: 'Gestionnaire de paie', type: 'Cabinet', project: 'atelier-casablanca', domain: 'd6', msg: 'Nous gérons la paie de petites structures artisanales.', when: 'lun.', status: 'new' },
    { id: 4, name: 'Rachid Z.', email: 'rachid@exemple.ma', metier: 'Maroquinier', type: 'Salarié', project: 'atelier-casablanca', domain: 'd14', msg: 'Trente ans de métier, envie de transmettre.', when: '10 oct.', status: 'ok' }
  ],

  content: {
    heroTitle: 'ACHIRA',
    heroLead: 'Un cercle qui avance ensemble.',
    heroEyebrow: 'Des histoires singulières. Des valeurs partagées.',
    manifesto: 'AKARBI est née d’une rencontre. ACHIRA prolonge cette possibilité : trouver, au croisement de parcours différents, des personnes avec qui partager une ambition, une sensibilité et l’envie de construire.',
    sidesIntro: 'Un projet ne se résume pas à une idée. Il a une comptabilité, une fiscalité, une trésorerie, des contrats, une fabrication, une image. Chaque côté demande un savoir-faire, et le cercle les réunit.',
    quote: 'L’achat donne un accès.',
    quoteEm: 'Les valeurs donnent l’appartenance.',
    motto: 'TRUST YOUR WAY'
  },

  settings: { siteName: 'ACHIRA', akarbiUrl: '', instagram: '', discord: 'https://discord.gg/FdEmP3XJq' }
};
