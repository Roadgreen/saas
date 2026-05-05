import type { BlogArticle } from '../articles';
import { articleBoulangerie } from './boulangerie';
import { articleSnack } from './snack';
import { articleGlacier } from './glacier';
import { articleCafe } from './cafe';
import { articleMarche } from './marche';

export const verticalArticles: BlogArticle[] = [
  articleBoulangerie,
  articleSnack,
  articleGlacier,
  articleCafe,
  articleMarche,
];
