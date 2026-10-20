/* ACHIRA — données de la maquette.
   Le modèle des sides reprend le schéma PROJET (domaines 1 à 12) ; les domaines 13 à 16 sont des ajouts.
   Projets, membres et candidatures sont des exemples. */
window.ACHIRA_DATA = {
  pros: ['Salarié', 'Indépendant', 'Cabinet'],

  poles: [
    { id: 'gestion', t: 'Gestion & finance', d: ['d1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8', 'd9', 'd10', 'd11', 'd12'] },
    { id: 'creation', t: 'Création, production & marque', d: ['d13', 'd14', 'd15', 'd16'] }
  ],

  domains: [
    { id: 'd1', n: 1, t: 'Comptabilité générale',
      tasks: [
        'Tenue des comptes et saisie',
        'Comptabilité clients',
        { t: 'Comptabilité fournisseurs', c: [
          'Gestion des factures',
          'Paiements fournisseurs',
          'Rapprochements',
          { t: 'Litiges et avoirs', c: [
            { t: 'Compétences requises', k: 'grp', c: ['Contrôle des pièces', 'Saisie comptable', 'Lettrage', 'Rapprochement', 'Gestion des échéances'] },
            { t: 'Métiers recherchés', k: 'grp', c: ['Comptable fournisseurs', 'Assistant comptable', 'Responsable comptable',
              { t: 'Expert-comptable', c: [{ t: 'Professionnels', k: 'grp', c: ['Salarié', 'Indépendant', 'Cabinet'] }] }] }
          ] }
        ] },
        'Gestion des factures et avoirs',
        'Rapprochements bancaires',
        'Immobilisations et amortissements',
        'Écritures de régularisation',
        'Clôture mensuelle et annuelle',
        'Bilan et compte de résultat',
        'Révision et justification des comptes'
      ],
      comp: ['Saisie comptable', 'Lettrage', 'Rapprochement', 'Clôture des comptes', 'Normes CGNC'],
      metiers: ['Comptable', 'Assistant comptable', 'Chef comptable', 'Expert-comptable'] },

    { id: 'd2', n: 2, t: 'Comptabilité analytique et contrôle de gestion',
      tasks: ['Comptabilité par projet', 'Comptabilité par centre de coûts', 'Répartition charges directes / indirectes', 'Calcul des coûts de revient', 'Analyse des marges', 'Budgets prévisionnels', 'Analyse des écarts budget / réel', 'Indicateurs de performance', 'Reporting de gestion'],
      comp: ['Calcul de coûts', 'Budgétisation', 'Analyse d’écarts', 'Tableurs et BI', 'Reporting'],
      metiers: ['Contrôleur de gestion', 'Analyste financier', 'Responsable contrôle de gestion'] },

    { id: 'd3', n: 3, t: 'Fiscalité et obligations déclaratives',
      tasks: ['TVA collectée et déductible', 'Déclarations de TVA', 'Impôt sur les bénéfices', 'Impôts et taxes de l’activité', 'Retenues à la source', 'Fiscalité internationale', 'Contrôle et régularisation fiscale', 'Calendrier des échéances'],
      comp: ['TVA', 'IS et IR', 'Télédéclaration SIMPL', 'Veille fiscale'],
      metiers: ['Fiscaliste', 'Conseiller fiscal', 'Expert-comptable'] },

    { id: 'd4', n: 4, t: 'Trésorerie et financement',
      tasks: ['Plan de trésorerie', 'Prévisions des encaissements', 'Prévisions des décaissements', 'Suivi des soldes bancaires', 'Gestion des retards de paiement', 'Financement bancaire', 'Recherche de financements', 'Besoin en fonds de roulement', 'Scénarios de trésorerie'],
      comp: ['Prévision de trésorerie', 'Relation bancaire', 'Gestion du BFR', 'Modélisation'],
      metiers: ['Trésorier', 'Credit manager', 'Directeur financier', 'Conseiller bancaire'] },

    { id: 'd5', n: 5, t: 'Facturation et gestion commerciale',
      tasks: ['Devis et commandes', 'Émission des factures', 'Facturation électronique', 'Acomptes et paiements partiels', 'Suivi des impayés', 'Relances clients', 'Litiges de facturation', 'Conditions de paiement', 'Reconnaissance du chiffre d’affaires'],
      comp: ['Facturation', 'Recouvrement', 'Négociation', 'Outils de facturation'],
      metiers: ['Assistant ADV', 'Chargé de recouvrement', 'Responsable ADV'] },

    { id: 'd6', n: 6, t: 'Paie et charges sociales',
      tasks: ['Collecte des variables de paie', 'Bulletins de salaire', 'Cotisations sociales', 'Déclarations sociales', 'Congés et absences', 'Primes et avantages', 'Entrées et sorties du personnel', 'Coût salarial par projet', 'Coordination organismes sociaux'],
      comp: ['Droit du travail', 'Calcul de paie', 'Déclarations CNSS et AMO', 'Logiciel de paie'],
      metiers: ['Gestionnaire de paie', 'Responsable RH', 'Juriste social'] },

    { id: 'd7', n: 7, t: 'Juridique financier et contrats',
      tasks: ['Choix de la structure juridique', 'Création et modification d’entreprise', 'Contrats fournisseurs', 'Contrats clients', 'Contrats de prestation', 'Clauses de paiement', 'Suivi des obligations contractuelles', 'Approbation des comptes', 'Secrétariat juridique'],
      comp: ['Droit des sociétés', 'Rédaction de contrats', 'Négociation', 'Secrétariat juridique'],
      metiers: ['Juriste d’entreprise', 'Avocat d’affaires', 'Notaire'] },

    { id: 'd8', n: 8, t: 'Audit, contrôle interne et conformité',
      tasks: ['Contrôle des pièces justificatives', 'Séparation des tâches', 'Gestion des habilitations', 'Pistes d’audit', 'Préparation d’audit externe', 'Contrôle de cohérence des comptes', 'Détection des anomalies', 'Gestion documentaire', 'Conformité réglementaire'],
      comp: ['Contrôle interne', 'Analyse des risques', 'Normes d’audit', 'Rigueur documentaire'],
      metiers: ['Auditeur interne', 'Commissaire aux comptes', 'Responsable conformité'] },

    { id: 'd9', n: 9, t: 'Systèmes d’information comptable',
      tasks: ['Choix du logiciel comptable', 'Configuration du plan comptable', 'Paramétrage des taxes', 'Intégration bancaire', 'Automatisation des factures', 'Connexion avec l’ERP', 'Migration des données', 'Tableaux de bord financiers', 'Gestion des accès et sauvegardes'],
      comp: ['Paramétrage ERP', 'Migration de données', 'Automatisation', 'Sécurité des accès'],
      metiers: ['Consultant ERP', 'Développeur', 'Chef de projet SI'] },

    { id: 'd10', n: 10, t: 'Achats et gestion fournisseurs',
      tasks: ['Référencement des fournisseurs', 'Demandes d’achat', 'Validation des dépenses', 'Commandes fournisseurs', 'Contrôle des factures', 'Rapprochement commande-livraison-facture', 'Suivi des contrats fournisseurs', 'Échéances de paiement'],
      comp: ['Sourcing', 'Négociation', 'Gestion des contrats', 'Contrôle des factures'],
      metiers: ['Acheteur', 'Responsable achats', 'Comptable fournisseurs'] },

    { id: 'd11', n: 11, t: 'Gestion des risques financiers',
      tasks: ['Risque de trésorerie', 'Risque de crédit client', 'Risque de change', 'Fraude et détournement', 'Erreurs comptables', 'Dépendance fournisseur', 'Assurances de l’activité', 'Plans de continuité financière'],
      comp: ['Cartographie des risques', 'Assurances', 'Analyse crédit', 'Prévention de la fraude'],
      metiers: ['Risk manager', 'Courtier en assurance', 'Analyste crédit'] },

    { id: 'd12', n: 12, t: 'Conseil financier et pilotage',
      tasks: ['Business plan', 'Prévisionnel financier', 'Plan de financement initial', 'Plan de financement long terme', 'Scénarios de rentabilité', 'Évaluation des investissements', 'Analyse du seuil de rentabilité', 'Recherche de subventions', 'Conseil financier stratégique'],
      comp: ['Business plan', 'Modélisation financière', 'Évaluation d’investissements', 'Recherche de financements'],
      metiers: ['Conseiller financier', 'DAF à temps partagé', 'Expert-comptable'] },

    { id: 'd13', n: 13, t: 'Création et design', added: true,
      tasks: ['Direction artistique', 'Design produit', 'Prototypage', 'Identité visuelle', 'Photographie produit', 'Packaging'],
      comp: ['Dessin et patronage', 'Direction artistique', 'Prototypage', 'Retouche photo'],
      metiers: ['Designer', 'Directeur artistique', 'Photographe', 'Styliste'] },

    { id: 'd14', n: 14, t: 'Production et fabrication', added: true,
      tasks: ['Sourcing des matières', 'Fabrication en atelier', 'Contrôle qualité', 'Gestion des stocks', 'Logistique et livraison', 'Retouches et réparations'],
      comp: ['Travail du cuir', 'Coupe et couture', 'Contrôle qualité', 'Planification'],
      metiers: ['Artisan', 'Tailleur', 'Maroquinier', 'Responsable production'] },

    { id: 'd15', n: 15, t: 'Marketing et communication', added: true,
      tasks: ['Stratégie de marque', 'Réseaux sociaux', 'Contenus photo et vidéo', 'Événements et rencontres', 'Relations presse', 'Partenariats'],
      comp: ['Storytelling', 'Réseaux sociaux', 'Tournage et montage', 'Organisation d’événements'],
      metiers: ['Chargé de communication', 'Community manager', 'Vidéaste', 'Mannequin'] },

    { id: 'd16', n: 16, t: 'Digital et outils', added: true,
      tasks: ['Site web et e-commerce', 'Paiement en ligne', 'Hébergement et sécurité', 'Données et mesure d’audience', 'Outils internes'],
      comp: ['Développement web', 'UX / UI', 'Sécurité', 'Analyse de données'],
      metiers: ['Développeur web', 'Designer UX / UI', 'Data analyst'] }
  ],

  members: [
    { id: 1, slug: 'yassine-b', name: 'Yassine B.', metier: 'Tailleur', type: 'Indépendant', city: 'Casablanca', domains: ['d14'], img: 'u-cercle-3', bio: 'Vingt ans d’atelier. Il a monté le premier patron de la Veste Signature.' },
    { id: 2, slug: 'salma-r', name: 'Salma R.', metier: 'Photographe', type: 'Indépendant', city: 'Fès', domains: ['d13', 'd15'], img: 'u-cercle-1', bio: 'Elle photographie les mains plus que les visages.' },
    { id: 3, slug: 'karim-e', name: 'Karim E.', metier: 'Designer', type: 'Salarié', city: 'Casablanca', domains: ['d13'], img: 'u-cercle-2', bio: 'Designer produit, il dessine le coffret ACHIRA.' },
    { id: 4, slug: 'meriem-a', name: 'Meriem A.', metier: 'Expert-comptable', type: 'Cabinet', city: 'Rabat', domains: ['d1', 'd3', 'd12'], img: '', bio: 'Son cabinet tient les comptes des projets du cercle.' },
    { id: 5, slug: 'othmane-k', name: 'Othmane K.', metier: 'Juriste d’entreprise', type: 'Indépendant', city: 'Casablanca', domains: ['d7'], img: '', bio: 'Statuts, contrats, propriété des créations.' },
    { id: 6, slug: 'sara-d', name: 'Sara D.', metier: 'Développeur web', type: 'Indépendant', city: 'Paris', domains: ['d16', 'd9'], img: '', bio: 'Elle construit les outils du cercle depuis la diaspora.' },
    { id: 7, slug: 'nora-l', name: 'Nora L.', metier: 'Mannequin', type: 'Indépendant', city: 'Paris', domains: ['d15'], img: '', bio: 'Elle porte les pièces lors des essayages et des tournages.' }
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
