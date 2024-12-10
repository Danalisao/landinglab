import * as yup from 'yup';

const landingPageSchema = yup.object().shape({
  industry: yup
    .string()
    .required('L\'industrie est requise')
    .min(2, 'L\'industrie doit contenir au moins 2 caractères'),
  targetAudience: yup
    .string()
    .required('Le public cible est requis')
    .min(2, 'Le public cible doit contenir au moins 2 caractères'),
  mainGoal: yup
    .string()
    .required('L\'objectif principal est requis')
    .oneOf(['lead', 'sale', 'signup', 'contact', 'download'], 'Objectif non valide'),
  primaryColor: yup
    .string()
    .required('La couleur principale est requise')
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Format de couleur invalide'),
  secondaryColor: yup
    .string()
    .required('La couleur secondaire est requise')
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Format de couleur invalide'),
  aiProvider: yup
    .string()
    .required('Le choix de l\'IA est requis')
    .oneOf(['openai', 'claude'], 'Fournisseur d\'IA non valide'),
  // Ces champs seront générés par l'IA, ils ne sont pas requis lors de la création
  title: yup.string(),
  description: yup.string()
});

export default landingPageSchema;
