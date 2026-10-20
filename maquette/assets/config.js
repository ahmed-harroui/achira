/* Connexion à la base Supabase du projet Achira.
   La clé « anon » est publique par conception : les règles de sécurité (RLS) de la base limitent ce qu'elle permet. */
window.ACHIRA_CONFIG = {
  url: 'https://wscvemgeqyzlojkmrmkb.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndzY3ZlbWdlcXl6bG9qa21ybWtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI0NDgzNTIsImV4cCI6MjEwODAyNDM1Mn0.nLc-xcfTEF9cUpudV35eeSIy6nQRgXwi2m2BCTAZQ9I',
  teamEmail: 'equipe@achira.local' // compte d'équipe : la dashboard ne demande que le mot de passe
};
