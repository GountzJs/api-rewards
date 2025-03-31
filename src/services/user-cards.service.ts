import { Client } from '@libsql/client';
import { CardPack } from '../models/enums/card-pack.enum';
import { UserCardsRepository } from '../repositories/user-cards.repository';

export class UserCardsService {
  constructor(
    private readonly userCardsRepository: UserCardsRepository = new UserCardsRepository(),
  ) {}

  async getCardsByUser({
    client,
    userId,
    page,
    pageSize,
    pack,
  }: {
    userId: string;
    client: Client;
    page: number;
    pageSize: number;
    pack: CardPack;
  }) {
    try {
      const res = await this.userCardsRepository.getCardsByUser(
        client,
        userId,
        page,
        pageSize,
        pack,
      );
      return res;
    } catch {
      throw new Error('[CODE:500]: Fallo al obtener las cartas');
    }
  }
}
