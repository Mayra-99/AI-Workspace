// ============================================================
// PART 3 — Navigation + Résumé de texte
// ============================================================

// ─── CONFIGURATION API ──────────────────────────────────────
// Token HuggingFace (simulation active — réseau bloqué)
const HF_TOKEN = "hf_TON_TOKEN_ICI"; // ← ton token quand même

// URL de base de l'API Hugging Face
const HF_API = "https://api-inference.huggingface.co/models/";

// ─── SIMULATION API HUGGING FACE ────────────────────────────
// Même structure qu'un vrai appel API avec fetch()
// On simule la réponse après un délai réaliste
async function appelHuggingFace(nomModele, donnees) {

  // Simule le délai réseau réel (2 secondes)
  // setTimeout retarde l'exécution, Promise/resolve permet d'attendre
  await new Promise(resolve => setTimeout(resolve, 2000));

  const texte = donnees.inputs;

  // Simulation selon le modèle demandé
  if (nomModele.includes("bart")) {
    // Résumé : on prend les 40 premiers mots et on reformule
    const mots = texte.split(" ").slice(0, 40).join(" ");
    return [{
      summary_text: "Résumé : " + mots   }];
  }
if (nomModele.includes("opus-mt")) {
  const dictionnaire = {
    "je": "I", "suis": "am", "heureuse": "happy", "heureux": "happy",
    "bonjour": "hello", "merci": "thank you", "oui": "yes", "non": "no",
    "le": "the", "la": "the", "les": "the", "un": "a", "une": "a",
    "et": "and", "ou": "or", "mais": "but", "avec": "with", "pour": "for",
    "dans": "in", "sur": "on", "de": "of", "du": "of the",
    "bien": "well", "très": "very", "aussi": "also",
    "nous": "we", "vous": "you", "ils": "they", "elle": "she", "il": "he",
    "monde": "world", "vie": "life", "temps": "time", "travail": "work",
    "beau": "beautiful", "belle": "beautiful", "grand": "big", "petit": "small",
    "comment": "how", "ça": "it", "va": "goes", "mon": "my", "ton": "your",
    "ami": "friend", "eau": "water", "soleil": "sun", "jour": "day", "nuit": "night"
  };
  const mots = texte.toLowerCase().split(" ");
  const traduits = mots.map(mot => dictionnaire[mot] || mot);
  return [{ translation_text: traduits.join(" ") }];
}

  if (nomModele.includes("DialoGPT")) {
    // Réponses chat variées et réalistes
    const reponses = [
      "C'est une excellente question ! Je suis là pour vous aider au mieux.",
      "Très intéressant comme sujet. Pouvez-vous m'en dire davantage ?",
      "Je comprends votre demande. Voici ma réponse basée sur mes connaissances.",
      "Merci pour votre message. Je traite votre demande avec attention.",
      "Bonne remarque ! Permettez-moi de vous donner quelques éléments de réponse."
    ];
    const aleatoire = reponses[Math.floor(Math.random() * reponses.length)];
    return { generated_text: aleatoire };
  }

  return [{ result: "Réponse simulée du modèle " + nomModele }];
}

// ─── NAVIGATION ─────────────────────────────────────────────
// Appelée par onclick="showModule('...')" dans la sidebar
function showModule(moduleId) {

  // 1. Cacher TOUTES les sections du <main>
  const sections = document.querySelectorAll('.main section');
  sections.forEach(section => section.classList.add('hidden'));

  // 2. Afficher SEULEMENT la section demandée
  const cible = document.getElementById('module-' + moduleId);
  if (cible) cible.classList.remove('hidden');

  // 3. Retirer la classe active de tous les items sidebar
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => item.classList.remove('active'));

  // 4. Mettre la classe active sur l'item cliqué
  const itemActif = document.querySelector(`[onclick="showModule('${moduleId}')"]`);
  if (itemActif) itemActif.classList.add('active');
}

// ─── MODULE RÉSUMÉ ──────────────────────────────────────────
// Construit le HTML et l'injecte dans #module-resume
function buildResume() {
  const section = document.getElementById('module-resume');
  if (!section) return;

  section.innerHTML = `
    <div class="module-card">
      <h2> Résumé de texte</h2>
      <p class="module-desc">
        Colle un texte long ci-dessous. L'IA va le résumer automatiquement.
      </p>

      <label class="input-label">Texte à résumer :</label>
      <textarea class="text-area" id="input-resume"
        placeholder="Colle ici ton texte (minimum 100 mots recommandé)..."
        rows="8"></textarea>

      <button class="btn-primary" onclick="resumerTexte()">
        ✨ Résumer avec l'IA
      </button>

      <label class="input-label" style="margin-top:1rem;">Résultat :</label>
      <div class="output-box" id="output-resume">
        Le résumé apparaîtra ici...
      </div>
    </div>
  `;
}

// Appelle la simulation API pour résumer le texte
async function resumerTexte() {
  const texte = document.getElementById('input-resume').value.trim();
  const outputBox = document.getElementById('output-resume');

  // Vérification : texte non vide
  if (!texte) {
    outputBox.textContent = "⚠️ Merci de saisir un texte avant de résumer.";
    return;
  }

  // Message de chargement pendant la simulation
  outputBox.textContent = "⏳ L'IA analyse ton texte...";

  try {
    // Appel à la simulation (même code qu'avec la vraie API)
    const resultat = await appelHuggingFace("facebook/bart-large-cnn", {
      inputs: texte,
      parameters: {
        max_length: 150,
        min_length: 40,
        do_sample: false
      }
    });

    // L'API renvoie un tableau → on prend le premier élément
    const resume = resultat[0]?.summary_text || "Aucun résumé généré.";
    outputBox.textContent = resume;

  } catch (erreur) {
    outputBox.textContent = "❌ Erreur : " + erreur.message;
    console.error("Erreur résumé :", erreur);
  }
}
// ─── MODULE TRADUCTION ───────────────────────────────────────
function buildTraduction() {
  const section = document.getElementById('module-traduction');
  if (!section) return;

  section.innerHTML = `
    <div class="module-card">
      <h2>🌍 Traduction</h2>
      <p class="module-desc">
        Traduit automatiquement ton texte du Français vers l'Anglais.
      </p>
      <label class="input-label">Texte en français :</label>
      <textarea class="text-area" id="input-traduction"
        placeholder="Écris ton texte en français ici..."
        rows="6"></textarea>
      <button class="btn-primary" onclick="traduireTexte()">
        🔄 Traduire en Anglais
      </button>
      <label class="input-label" style="margin-top:1rem;">Traduction en anglais :</label>
      <div class="output-box" id="output-traduction">
        La traduction apparaîtra ici...
      </div>
    </div>
  `;
}

async function traduireTexte() {
  const texte = document.getElementById('input-traduction').value.trim();
  const outputBox = document.getElementById('output-traduction');

  if (!texte) {
    outputBox.textContent = "⚠️ Merci de saisir un texte à traduire.";
    return;
  }

  outputBox.textContent = "⏳ Traduction en cours...";

  try {
    const resultat = await appelHuggingFace("Helsinki-NLP/opus-mt-fr-en", {
      inputs: texte
    });
    const traduction = resultat[0]?.translation_text || "Traduction indisponible.";
    outputBox.textContent = traduction;

  } catch (erreur) {
    outputBox.textContent = "❌ Erreur : " + erreur.message;
  }
}
// ─── DÉMARRAGE ───────────────────────────────────────────────
// S'exécute quand tout le HTML est chargé
document.addEventListener('DOMContentLoaded', function () {
  buildResume();            // Construit le module résumé
  buildTraduction();        // Construit le module traduction
  showModule('dashboard'); // Affiche le dashboard par défaut
});