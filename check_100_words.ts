
import { ALL_GRE_WORDS } from './src/data';

const newWordsList = [
  "Abate", "Abjure", "Assuage", "Belie", "Burgeon", "Burnish", "Buttress", "Castigate", "Coagulate", "Condone",
  "Confound", "Converge", "Daunt", "Delineate", "Denigrate", "Deride", "Desiccate", "Disabuse", "Discredit", "Dismiss",
  "Disparage", "Dissemble", "Distend", "Distill", "Diverge", "Divest", "Document", "Embellish", "Emulate", "Enervate",
  "Engender", "Enumerate", "Equivocate", "Exculpate", "Facilitate", "Flag", "Flout", "Foment", "Forestall", "Gouge",
  "Impair", "Impede", "Implode", "Insinuate", "Inundate", "Laud", "Mitigate", "Mollify", "Negate", "Obviate",
  "Abstemious", "Acerbic", "Alacrity", "Arcane", "Austere", "Banal", "Boorish", "Cacophonous", "Capricious", "Caustic",
  "Cogent", "Commensurate", "Complaisant", "Compliant", "Conciliatory", "Contentious", "Contrite", "Convoluted", "Craven", "Derivative",
  "Desultory", "Dichotomy", "Diffuse", "Discordant", "Discrete", "Disjointed", "Disparate", "Dogmatic", "Dormant", "Empirical",
  "Erudite", "Esoteric", "Exigent", "Extemporaneous", "Fallacious", "Fatuous", "Fawning", "Felicitous", "Fervid", "Fledgling",
  "Anomaly", "Antipathy", "Approbation", "Catalyst", "Chicanery", "Coda", "Compendium", "Connoisseur", "Diatribe", "Elegy"
];

const existingWords = new Set(ALL_GRE_WORDS.map(w => w.word.toLowerCase()));
const toAdd = newWordsList.filter(w => !existingWords.has(w.toLowerCase()));

console.log(JSON.stringify(toAdd));
console.log("Total to add:", toAdd.length);
