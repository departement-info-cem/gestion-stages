import type { ProcessedOffer, ProgramProfile } from '../types';

/**
 * Génère le HTML d'une page d'offres à partir d'un template et des données
 */
export async function generateOfferPage(
  profile: ProgramProfile,
  offers: ProcessedOffer[],
  session: string
): Promise<string> {
  try {
    // Charger le template HTML unique
    const templatePath = `/templates/offre/template.html`;
    const response = await fetch(templatePath);
    
    if (!response.ok) {
      throw new Error(`Failed to load template: ${templatePath}`);
    }
    
    let html = await response.text();
    
    // Remplacer les variables de session et date
    const now = new Date().toLocaleDateString('fr-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    
    const bodyClass = `has-background-${profile.color}`;
    
    html = html.replace(/\{\{Titre\}\}/g, profile.name);
    html = html.replace(/\{\{session\}\}/g, session);
    html = html.replace(/\{\{now\}\}/g, now);
    html = html.replace(/\{\{bodyClass\}\}/g, bodyClass);
    
    // Générer le HTML des liens rapides et des cartes d'offres
    const quickLinks = generateQuickLinks(offers);
    const offerCards = generateOfferCards(offers, profile);
    
    // Remplacer les placeholders par le HTML généré
    html = html.replace(/\{\{QUICK_LINKS\}\}/g, quickLinks);
    html = html.replace(/\{\{OFFER_CARDS\}\}/g, offerCards);
    
    return html;
  } catch (error) {
    console.error('Error generating offer page:', error);
    throw error;
  }
}

/**
 * Génère les liens rapides vers les offres
 */
function generateQuickLinks(offers: ProcessedOffer[]): string {
  return offers
    .map((offer, index) => {
      const companyName = offer['Nom de l\'entreprise qui offre le stage'] || 'Entreprise inconnue';
      return `<a class="button is-small is-light" href="#offre${index}">${escapeHtml(String(companyName))}</a>`;
    })
    .join('\n      ');
}

/**
 * Génère les cartes d'offres
 */
function generateOfferCards(offers: ProcessedOffer[], profile: ProgramProfile): string {
  return offers
    .map((offer, index) => {
      const idColumn = getIdColumnForProfile(profile.id);
      const offerId = offer[idColumn] || 'N/A';
      const companyName = offer['Nom de l\'entreprise qui offre le stage'] || 'Entreprise inconnue';
      const numStagiaires = offer['Combien de stagiaires souhaitez-vous prendre pour cette offre ?'] || 1;
      const website = offer['Site web de l\'entreprise'] || '';
      const mandat = offer['Description du mandat ou des tâches prévues pour le stage'] || '';
      const contexte = offer['Description du contexte technologique (plateformes utilisées, équipements utilisés, technologies ...)'] || '';
      const remuneration = offer['Quel type de rémunération est proposée?'] || '';
      const salaire = offer['Si le stage est rémunéré, quel sera le salaire ou la compensation financière ?'] || '';
      const vehicule = offer['Est-ce que le stagiaire doit posséder un véhicule pour se déplacer ? (ex. chez des clients, entre les succursales du bureau, etc.)'] || '';
      const horaire = offer['Quel est l\'horaire hebdomadaire de l\'entreprise? (ex. 35 heures/semaine, etc.) ?'] || '';
      const teletravail = offer['Quelles sont les modalités concernant le télétravail ?'] || '';
      const lieu = offer['Si le stage comprend du présentiel, quelle sera l\'adresse où le stage sera effectué ? '] || '';
      const equipe = offer['Quelle est la taille de l\'équipe avec laquelle travaillera le stagiaire?'] || '';
      const suites = offer['Suite au stage, quelles sont les possibilités (ex. emploi temps plein, été, partiel, aucune) ?'] || '';

      return `
        <div class="offer-card" id="offre${index}">
          <div class="offer-header">
            <span class="offer-id">${escapeHtml(String(offerId))}</span>
            <h2 class="offer-company">${escapeHtml(String(companyName))}</h2>
            <div class="offer-meta">
              <span>👥 ${escapeHtml(String(numStagiaires))} stagiaire(s)</span>
              ${website ? ` • <a href="${escapeHtml(String(website))}" target="_blank" style="color: white;">🌐 Site web</a>` : ''}
            </div>
          </div>
          
          <div class="content-grid">
            <div class="info-box mandate">
              <h5>🎯 Mandat</h5>
              <p>${formatText(String(mandat))}</p>
            </div>
            
            <div class="info-box tech">
              <h5>💻 Contexte technologique</h5>
              <p>${formatText(String(contexte))}</p>
            </div>

            <div class="details-row">
              <div class="detail-box remuneration">
                <strong>💵 Rémunération</strong>
                <div>${escapeHtml(String(remuneration))}</div>
                ${salaire ? `<div style="margin-top: 0.5rem;">💰 ${escapeHtml(String(salaire))}</div>` : ''}
                ${vehicule ? `<div style="margin-top: 0.5rem;">🚗 Véhicule : ${escapeHtml(String(vehicule))}</div>` : ''}
              </div>
              
              <div class="detail-box workplace">
                <strong>🏢 Modalités de travail</strong>
                <div>⏰ ${escapeHtml(String(horaire))}</div>
                ${teletravail ? `<div style="margin-top: 0.5rem;">🏠 ${escapeHtml(String(teletravail))}</div>` : ''}
                ${lieu ? `<div style="margin-top: 0.5rem;">📍 ${escapeHtml(String(lieu))}</div>` : ''}
                ${equipe ? `<div style="margin-top: 0.5rem;">👥 Équipe : ${escapeHtml(String(equipe))}</div>` : ''}
              </div>
              
              <div class="detail-box future">
                <strong>🚀 Après le stage</strong>
                <div>${formatList(String(suites))}</div>
              </div>
            </div>
          </div>
        </div>`;
    })
    .join('\n        ');
}
/**
 * Obtient le nom de la colonne ID pour un profil
 */
function getIdColumnForProfile(profileId: string): string {
  switch (profileId) {
    case 'dec-ti':
      return 'IDTechTI';
    case 'dec-prog':
      return 'IDTechProg';
    case 'aec-devweb':
      return 'IDAecWeb';
    case 'aec-ti':
      return 'IDAecTI';
    default:
      return 'ID';
  }
}

/**
 * Échappe les caractères HTML spéciaux
 */
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Formate le texte en remplaçant les retours à la ligne par des <br/>
 */
function formatText(text: string): string {
  return escapeHtml(text).replace(/\n/g, '<br/>');
}

/**
 * Formate une liste séparée par des points-virgules
 */
function formatList(text: string): string {
  return escapeHtml(text).replace(/;/g, ' <br/> ');
}

/**
 * Télécharge un fichier HTML
 */
export function downloadHtmlFile(html: string, fileName: string): void {
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
