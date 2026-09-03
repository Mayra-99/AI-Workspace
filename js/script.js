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

// ─── MODULE CHAT ─────────────────────────────────────────────
function buildChat() {
  const section = document.getElementById('module-chat');
  if (!section) return;

  section.innerHTML = `
    <div class="module-card">
      <h2>💬 Chat IA</h2>
      <p class="module-desc">Discute avec une IA conversationnelle.</p>

      <div class="chat-box" id="chat-messages">
        <div class="chat-msg bot">👋 Bonjour ! Je suis votre assistant IA. Comment puis-je vous aider ?</div>
      </div>

      <div class="chat-input-row">
        <input type="text" class="chat-input" id="input-chat"
          placeholder="Écris ton message..."
          onkeydown="if(event.key==='Enter') envoyerMessage()" />
        <button class="btn-primary" onclick="envoyerMessage()">Envoyer ➤</button>
      </div>

      <button class="btn-secondary" onclick="reinitialiserChat()">🔄 Nouvelle conversation</button>
    </div>
  `;
}

async function envoyerMessage() {
  const input = document.getElementById('input-chat');
  const messagesBox = document.getElementById('chat-messages');
  const message = input.value.trim();

  if (!message) return;

  // Afficher le message de l'utilisateur
  messagesBox.innerHTML += `<div class="chat-msg user">👤 ${message}</div>`;
  input.value = "";
  messagesBox.scrollTop = messagesBox.scrollHeight;

  // Message de chargement
  const loadingId = "loading-" + Date.now();
  messagesBox.innerHTML += `<div class="chat-msg bot" id="${loadingId}">⏳ L'IA réfléchit...</div>`;
  messagesBox.scrollTop = messagesBox.scrollHeight;

  try {
    const resultat = await appelHuggingFace("microsoft/DialoGPT-medium", {
      inputs: message
    });

    const reponse = resultat?.generated_text || "Je n'ai pas compris, reformulez.";
    document.getElementById(loadingId).textContent = "🤖 " + reponse;
    messagesBox.scrollTop = messagesBox.scrollHeight;

  } catch (erreur) {
    document.getElementById(loadingId).textContent = "❌ Erreur : " + erreur.message;
  }
}

function reinitialiserChat() {
  const messagesBox = document.getElementById('chat-messages');
  if (messagesBox) {
    messagesBox.innerHTML = `<div class="chat-msg bot">👋 Nouvelle conversation démarrée !</div>`;
  }
}

// ─── MODULE PRÉDICTION ───────────────────────────────────────
function buildPrediction() {
  const section = document.getElementById('module-prediction');
  if (!section) return;

  section.innerHTML = `
    <div class="module-card">
      <h2>📊 Prédiction IA</h2>
      <p class="module-desc">
        Remplis les informations ci-dessous pour obtenir une prédiction personnalisée.
      </p>

      <label class="input-label">Âge :</label>
      <input type="number" class="text-area" id="input-age"
        min="18" max="100" placeholder="Ex: 35"
        style="height:auto; padding:0.5rem;" />

      <label class="input-label">Revenu mensuel (FCFA) :</label>
      <input type="number" class="text-area" id="input-revenu"
        min="0" placeholder="Ex: 250000"
        style="height:auto; padding:0.5rem;" />

      <label class="input-label">Ville :</label>
      <select class="text-area" id="input-ville"
        style="height:auto; padding:0.5rem;">
        <option value="dakar">Dakar</option>
        <option value="thies">Thiès</option>
        <option value="saint-louis">Saint-Louis</option>
        <option value="ziguinchor">Ziguinchor</option>
        <option value="kaolack">Kaolack</option>
        <option value="autre">Autre</option>
      </select>

      <button class="btn-primary" onclick="predire()">
        📈 Prédire
      </button>

      <div class="output-box" id="output-prediction">
        La prédiction apparaîtra ici...
      </div>
    </div>
  `;
}

function predire() {
  const age = parseInt(document.getElementById('input-age').value);
  const revenu = parseInt(document.getElementById('input-revenu').value);
  const ville = document.getElementById('input-ville').value;
  const output = document.getElementById('output-prediction');

  // Vérification
  if (!age || !revenu) {
    output.textContent = "⚠️ Merci de remplir tous les champs.";
    return;
  }

  // Calcul du score fictif
  let score = 0;

  // Score selon l'âge
  if (age >= 25 && age <= 45) score += 40;
  else if (age > 45 && age <= 60) score += 25;
  else score += 10;

  // Score selon le revenu
  if (revenu >= 500000) score += 50;
  else if (revenu >= 200000) score += 35;
  else if (revenu >= 100000) score += 20;
  else score += 5;

  // Bonus selon la ville
  if (ville === "dakar") score += 10;
  else if (ville === "thies" || ville === "saint-louis") score += 7;
  else score += 3;

  // Limiter entre 0 et 100
  score = Math.min(100, score);

  // Profil selon le score
  let profil, conseil;
  if (score >= 75) {
    profil = "🟢 Profil Excellent";
    conseil = "Vous êtes éligible aux offres premium. Excellent potentiel d'investissement.";
  } else if (score >= 50) {
    profil = "🟡 Profil Intermédiaire";
    conseil = "Bon profil avec quelques axes d'amélioration. Éligible aux offres standard.";
  } else {
    profil = "🔴 Profil à développer";
    conseil = "Nous vous recommandons nos offres d'accompagnement pour améliorer votre profil.";
  }

  output.innerHTML = `
    <strong>${profil}</strong><br><br>
    Score IA : <strong>${score}/100</strong><br><br>
    📍 Ville : ${ville.charAt(0).toUpperCase() + ville.slice(1)}<br>
    👤 Âge : ${age} ans<br>
    💰 Revenu : ${revenu.toLocaleString()} FCFA<br><br>
    💡 ${conseil}
  `;
}
// ─── DÉMARRAGE ───────────────────────────────────────────────
// S'exécute quand tout le HTML est chargé
document.addEventListener('DOMContentLoaded', function () {
  buildResume();            // Construit le module résumé
  buildTraduction();        // Construit le module traduction
  buildPrediction();        // Construit le module prédiction
    buildChat();              // Construit le module chat
  showModule('dashboard'); // Affiche le dashboard par défaut
});