import { Context } from 'hono';
import { BlankInput } from 'hono/types';
import { initTursoClient } from '../db';
import { CardPack } from '../models/enums/card-pack.enum';
import { UserCardsService } from '../services/user-cards.service';

type CardsLatestContext = Context<
  {
    Bindings: CloudflareBindings;
  },
  '/api/cards/:id',
  BlankInput
>;

export class UsersCardsController {
  constructor(
    private readonly userCardsService: UserCardsService = new UserCardsService(),
  ) {}

  getCardsByUser = async (c: CardsLatestContext) => {
    const { id } = c.req.param();
    const { page, pack } = c.req.query();
    const pageNumber = Number(page) || 0;
    if (!Object.values(CardPack).includes(pack as CardPack))
      return c.json({ error: 'Pack is not valid' }, 400);
    if (isNaN(pageNumber))
      return c.json({ error: 'Page number is not a number' }, 400);
    const pageSize = 10;
    const client = initTursoClient({
      TURSO_DATABASE_URL: c.env.TURSO_DATABASE_URL,
      TURSO_AUTH_TOKEN: c.env.TURSO_AUTH_TOKEN,
    });
    try {
      const { cards, pagination } = await this.userCardsService.getCardsByUser({
        client,
        userId: id,
        page: pageNumber,
        pageSize: pageSize,
        pack: pack as CardPack,
      });
      return c.json({ cards, pagination }, 200);
    } catch {
      return c.json({ message: 'Something went wrong' }, 500);
    }
  };
}
