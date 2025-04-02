import { Cards } from '../enums/cards.enum';
import { EmbeecardCategory } from '../enums/embeecard-category.enum';

export interface CardEntity {
  pack: Cards;
  category: EmbeecardCategory;
  name: string;
  description: string;
  identify: string;
  cover: string;
  isSpecial: boolean;
}
