import { Client } from '@libsql/client';
import { CardPack } from '../models/enums/card-pack.enum';

export class UserCardsRepository {
  async getCardsByUser(
    client: Client,
    userId: string,
    page: number,
    pageSize: number,
    pack: CardPack,
  ) {
    const offset = (page - 1) * pageSize;
    const { rows } = await client.execute({
      sql: `
        SELECT
          c.pack,
          c.category,
          c.name,
          c.description,
          c.cover,
          c.identify,
          c.is_special as isSpecial,
          COUNT(uc.card_id) AS quantity
        FROM user_cards uc
        INNER JOIN cards c ON uc.card_id = c.id
        WHERE uc.user_id = ? AND c.pack = ?
        GROUP BY uc.user_id, uc.card_id
        LIMIT ? OFFSET ?
      `,
      args: [userId, pack, pageSize, offset],
    });

    const countSql = `
      SELECT COUNT(DISTINCT uc.card_id) AS total
      FROM user_cards uc
      INNER JOIN cards c ON uc.card_id = c.id
      WHERE uc.user_id = ? AND c.pack = ?
    `;

    const countArgs = [userId, pack];

    const { rows: countRows } = await client.execute({
      sql: countSql,
      args: countArgs,
    });

    const totalRecords = Number(countRows[0].total || 0);

    const totalPages = Math.ceil(totalRecords / pageSize);

    return {
      cards: rows,
      pagination: {
        page,
        pageSize,
        totalRecords,
        totalPages,
      },
    };
  }
}
