# Guide Pratique d'Accessibilité
## Analyse It - MSPR-TPRE-502

---

## 🎯 Introduction

Ce guide pratique fournit des instructions concrètes pour implémenter l'accessibilité dans le projet **Analyze It**. Il s'adresse aux développeurs, designers et testeurs qui travaillent sur l'application.

### Objectifs du guide
- **Standardiser** les pratiques d'accessibilité
- **Faciliter** l'implémentation pour les développeurs
- **Assurer** la conformité WCAG 2.1 AA
- **Améliorer** l'expérience utilisateur pour tous

---

## 📋 Checklist d'Accessibilité

### ✅ Navigation et Structure

#### Rôles et attributs ARIA
```tsx
// ✅ Navigation principale
<nav role="navigation" aria-label="Navigation principale">
  <ul role="menubar">
    <li role="menuitem">
      <a href="/" aria-current="page">Accueil</a>
    </li>
  </ul>
</nav>

// ✅ Contenu principal
<main role="main" id="main-content">
  <h1>Titre de page</h1>
  <section aria-labelledby="section-title">
    <h2 id="section-title">Titre de section</h2>
  </section>
</main>
```

#### Hiérarchie des titres
```tsx
// ✅ Structure correcte
<h1>Titre principal de la page</h1>
  <h2>Section principale</h2>
    <h3>Sous-section</h3>
    <h3>Autre sous-section</h3>
  <h2>Autre section</h2>
    <h3>Sous-section</h3>
```

### ✅ Formulaires Accessibles

#### Labels et associations
```tsx
// ✅ Label explicite
<div className="input-group">
  <label htmlFor="email">Adresse e-mail</label>
  <input
    id="email"
    type="email"
    name="email"
    required
    aria-required="true"
    aria-describedby="email-help email-error"
  />
  <div id="email-help">Format : nom@domaine.com</div>
  <div id="email-error" role="alert" aria-live="polite"></div>
</div>

// ✅ Label implicite (à éviter si possible)
<input
  type="text"
  aria-label="Rechercher"
  placeholder="Entrez votre recherche"
/>
```

#### Validation et erreurs
```tsx
// ✅ Messages d'erreur accessibles
const [errors, setErrors] = useState({});

return (
  <form onSubmit={handleSubmit}>
    <div className="input-group">
      <label htmlFor="password">Mot de passe</label>
      <input
        id="password"
        type="password"
        aria-invalid={errors.password ? "true" : "false"}
        aria-describedby={errors.password ? "password-error" : undefined}
      />
      {errors.password && (
        <div id="password-error" role="alert" aria-live="polite">
          {errors.password}
        </div>
      )}
    </div>
  </form>
);
```

### ✅ Boutons et Interactions

#### Boutons accessibles
```tsx
// ✅ Bouton avec texte descriptif
<button 
  type="submit"
  aria-label="Se connecter au système"
  className="btn-primary"
>
  Se connecter
</button>

// ✅ Bouton icône avec label
<button
  aria-label="Fermer la modal"
  onClick={handleClose}
  className="btn-icon"
>
  <IconClose aria-hidden="true" />
</button>

// ✅ Bouton toggle avec état
<button
  aria-pressed={isExpanded}
  aria-expanded={isExpanded}
  onClick={toggleExpanded}
>
  {isExpanded ? 'Réduire' : 'Développer'}
</button>
```

#### Navigation au clavier
```tsx
// ✅ Support complet du clavier
const handleKeyDown = (e: React.KeyboardEvent) => {
  switch (e.key) {
    case 'Enter':
    case ' ':
      e.preventDefault();
      handleClick();
      break;
    case 'Escape':
      handleClose();
      break;
  }
};

return (
  <div
    role="button"
    tabIndex={0}
    onClick={handleClick}
    onKeyDown={handleKeyDown}
    aria-label="Ouvrir le menu"
  >
    Menu
  </div>
);
```

### ✅ Images et Médias

#### Images avec alternatives
```tsx
// ✅ Image informative
<img 
  src="/logo.png" 
  alt="Logo Analyze It - Plateforme d'analyse épidémiologique"
  width="200"
  height="100"
/>

// ✅ Image décorative
<img 
  src="/background.jpg" 
  alt=""
  aria-hidden="true"
/>

// ✅ Image complexe avec description
<figure>
  <img 
    src="/chart.png" 
    alt="Graphique des tendances épidémiologiques"
    aria-describedby="chart-description"
  />
  <figcaption id="chart-description">
    Évolution des cas de COVID-19 par continent sur les 12 derniers mois.
    L'Europe montre une tendance à la baisse depuis janvier.
  </figcaption>
</figure>
```

### ✅ Graphiques et Visualisations

#### Graphiques accessibles
```tsx
// ✅ Graphique avec alternatives textuelles
<div className="chart-container">
  <h3>Évolution des cas par continent</h3>
  
  {/* Graphique principal */}
  <div className="chart-visual" aria-hidden="true">
    <Bar data={data} options={options} />
  </div>
  
  {/* Alternative textuelle */}
  <div className="chart-summary" role="region" aria-label="Résumé du graphique">
    <h4>Résumé des données</h4>
    <ul>
      {data.datasets[0].data.map((value, index) => (
        <li key={index}>
          {data.labels[index]}: {value.toLocaleString()} cas
        </li>
      ))}
    </ul>
  </div>
  
  {/* Tableau de données */}
  <table className="chart-data" aria-label="Données détaillées du graphique">
    <thead>
      <tr>
        <th>Continent</th>
        <th>Nombre de cas</th>
      </tr>
    </thead>
    <tbody>
      {data.labels.map((label, index) => (
        <tr key={index}>
          <td>{label}</td>
          <td>{data.datasets[0].data[index].toLocaleString()}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

### ✅ Couleurs et Contraste

#### Contraste des couleurs
```css
/* ✅ Contraste suffisant (4.5:1 minimum) */
.btn-primary {
  background-color: #009DE1; /* Bleu principal */
  color: #FFFFFF; /* Blanc */
  /* Ratio de contraste : 4.8:1 */
}

.btn-secondary {
  background-color: #F5F5F5; /* Gris clair */
  color: #333333; /* Gris foncé */
  /* Ratio de contraste : 12.6:1 */
}

/* ❌ Contraste insuffisant */
.btn-danger {
  background-color: #FF6B6B; /* Rouge clair */
  color: #FFFFFF; /* Blanc */
  /* Ratio de contraste : 2.8:1 - INSUFFISANT */
}
```

#### Indicateurs non-colorés
```tsx
// ✅ Indicateur avec icône ET couleur
<div className="status-indicator">
  <span className="status-icon" aria-hidden="true">✓</span>
  <span className="status-text">Succès</span>
</div>

// ❌ Indicateur couleur uniquement
<div className="status" style={{ color: 'green' }}>
  Succès
</div>
```

---

## 🧪 Tests d'Accessibilité

### Tests Automatisés

#### Configuration Vitest
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    globals: true,
  },
});
```

#### Tests d'Attributs ARIA
```tsx
// Navbar.test.tsx
describe('Accessibilité de la navigation', () => {
  it('devrait avoir une structure de navigation correcte', () => {
    render(<Navbar />);
    
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('aria-label', 'Navigation principale');
    
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2); // Accueil + Compte
  });

  it('devrait indiquer la page active', () => {
    render(<Navbar />);
    
    const homeLink = screen.getByRole('link', { name: 'Accueil' });
    expect(homeLink).toHaveAttribute('aria-current', 'page');
  });
});
```

#### Tests de Formulaires
```tsx
// UserLogin.test.tsx
describe('Accessibilité du formulaire de connexion', () => {
  it('devrait avoir des labels associés aux champs', () => {
    render(<UserLogin />);
    
    const emailInput = screen.getByLabelText(/e-mail/i);
    const passwordInput = screen.getByLabelText(/mot de passe/i);
    
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('devrait indiquer les champs requis', () => {
    render(<UserLogin />);
    
    const emailInput = screen.getByLabelText(/e-mail/i);
    const passwordInput = screen.getByLabelText(/mot de passe/i);
    
    expect(emailInput).toHaveAttribute('aria-required', 'true');
    expect(passwordInput).toHaveAttribute('aria-required', 'true');
  });
});
```

### Tests Manuels

#### Checklist de Test Manuel

**Navigation au clavier :**
- [ ] Tabulation fonctionne dans l'ordre logique
- [ ] Shift+Tab fonctionne en sens inverse
- [ ] Enter et Espace activent les éléments
- [ ] Échap ferme les modales/menus
- [ ] Pas de piège au clavier

**Lecteur d'écran :**
- [ ] Tous les éléments sont annoncés
- [ ] Les rôles sont corrects
- [ ] Les états sont annoncés
- [ ] Les erreurs sont signalées
- [ ] La navigation est claire

**Contraste et couleurs :**
- [ ] Contraste suffisant (4.5:1 minimum)
- [ ] Les informations ne dépendent pas uniquement de la couleur
- [ ] Les liens sont distinguables sans survol

**Zoom et responsive :**
- [ ] L'interface reste utilisable à 200% de zoom
- [ ] Pas de débordement horizontal
- [ ] Les éléments restent cliquables

---

## 🛠️ Outils et Ressources

### Outils de Développement

#### ESLint Accessibility
```bash
# Installation
npm install --save-dev eslint-plugin-jsx-a11y

# Configuration
{
  "extends": [
    "plugin:jsx-a11y/recommended"
  ],
  "rules": {
    "jsx-a11y/alt-text": "error",
    "jsx-a11y/anchor-has-content": "error",
    "jsx-a11y/aria-props": "error",
    "jsx-a11y/aria-proptypes": "error",
    "jsx-a11y/aria-unsupported-elements": "error",
    "jsx-a11y/role-has-required-aria-props": "error",
    "jsx-a11y/role-supports-aria-props": "error"
  }
}
```

#### axe-core pour les tests
```bash
# Installation
npm install --save-dev @axe-core/react

# Utilisation dans les tests
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

it('should not have accessibility violations', async () => {
  const { container } = render(<MyComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Outils de Test

#### Lighthouse Accessibility
```bash
# Audit d'accessibilité
npx lighthouse https://votre-site.com --only-categories=accessibility
```

#### WAVE Web Accessibility Evaluator
- Extension navigateur
- Analyse en temps réel
- Rapports détaillés

#### axe DevTools
- Extension navigateur
- Tests automatisés
- Suggestions d'amélioration

---

## 📚 Bonnes Pratiques

### Principes Généraux

1. **Penser accessibilité dès la conception**
   - Intégrer l'accessibilité dans les wireframes
   - Considérer les parcours utilisateur alternatifs
   - Planifier les alternatives textuelles

2. **Tester régulièrement**
   - Tests automatisés dans le CI/CD
   - Tests manuels hebdomadaires
   - Tests utilisateurs trimestriels

3. **Documenter les décisions**
   - Justifier les choix d'implémentation
   - Documenter les alternatives
   - Maintenir un guide de style

### Erreurs Communes à Éviter

#### ❌ Problèmes Fréquents
```tsx
// ❌ Pas de label
<input type="text" />

// ❌ Label non associé
<label>Email</label>
<input type="email" />

// ❌ Bouton sans texte
<button onClick={handleClick}>
  <Icon />
</button>

// ❌ Image sans alt
<img src="/logo.png" />

// ❌ Div cliquable sans rôle
<div onClick={handleClick}>Cliquez ici</div>
```

#### ✅ Solutions Correctes
```tsx
// ✅ Label associé
<label htmlFor="email">Email</label>
<input id="email" type="email" />

// ✅ Bouton avec aria-label
<button onClick={handleClick} aria-label="Fermer">
  <Icon aria-hidden="true" />
</button>

// ✅ Image avec alt
<img src="/logo.png" alt="Logo de l'entreprise" />

// ✅ Élément cliquable avec rôle
<button onClick={handleClick} type="button">
  Cliquez ici
</button>
```

---

## 🎯 Métriques et Suivi

### Indicateurs de Performance

#### Métriques d'Accessibilité
- **Conformité WCAG 2.1 AA** : Objectif 100%
- **Tests d'accessibilité** : Objectif 100% de passage
- **Temps de correction** : < 24h pour les erreurs critiques
- **Formation équipe** : 100% des développeurs formés

#### Tableau de Bord
```typescript
// Métriques à suivre
interface AccessibilityMetrics {
  wcagCompliance: number; // Pourcentage de conformité
  testCoverage: number;   // Couverture des tests a11y
  violations: number;     // Nombre de violations
  fixTime: number;        // Temps moyen de correction
  userFeedback: number;   // Score de satisfaction utilisateurs
}
```

### Processus d'Amélioration Continue

1. **Audit mensuel** : Vérification complète
2. **Feedback utilisateur** : Collecte et analyse
3. **Formation continue** : Mise à jour des compétences
4. **Mise à jour des outils** : Veille technologique

---

## 📞 Support et Contacts

### Équipe Accessibilité
- **Lead Accessibility** : [Nom] - [email]
- **Accessibility Tester** : [Nom] - [email]
- **UX Designer** : [Nom] - [email]

### Ressources Internes
- **Slack** : #accessibility
- **Documentation** : [Lien vers la doc]
- **Formations** : [Lien vers les formations]

### Ressources Externes
- **WCAG 2.1** : https://www.w3.org/WAI/WCAG21/quickref/
- **ARIA Practices** : https://www.w3.org/WAI/ARIA/apg/
- **WebAIM** : https://webaim.org/

---

*Guide mis à jour le 22 juin 2025 - Version 1.0* 