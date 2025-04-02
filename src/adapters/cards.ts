import { CardEntity } from '../models/entities/card.entity';
import { Cards } from '../models/enums/cards.enum';
import { EmbeecardCategory } from '../models/enums/embeecard-category.enum';

interface Props {
  pack: string;
  category: string;
  name: string;
  description: string;
  identify: string;
  cover: string;
  isSpecial: number;
}

export const getCardAdapter = ({
  pack,
  category,
  name,
  description,
  identify,
  cover,
  isSpecial,
}: Props): CardEntity => ({
  pack: pack as Cards,
  category: category as EmbeecardCategory,
  name,
  description,
  identify,
  cover,
  isSpecial: isSpecial === 1,
});
