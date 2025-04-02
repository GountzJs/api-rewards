import { Client } from '@libsql/client';
import { getCardAdapter } from '../adapters/cards';
import { CardEntity } from '../models/entities/card.entity';
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

  async getLatest({
    client,
    userId,
    records,
  }: {
    client: Client;
    userId: string;
    records: number;
  }): Promise<{ ids: string[] }> {
    try {
      return this.userCardsRepository.getLatestIds({
        client,
        userId,
        limit: records,
      });
    } catch (err) {
      throw new Error(
        '[CODE:9900] Algo salió mal al obtener las últimas cartas',
      );
    }
  }

  async getCards({
    ids,
    client,
  }: {
    ids: string[];
    client: Client;
  }): Promise<CardEntity[]> {
    try {
      return this.userCardsRepository
        .getCards({ ids, client })
        .then((cards) => cards.map((card) => getCardAdapter(card)));
    } catch {
      throw new Error('[CODE:9900] Algo salió mal al obtener las cartas');
    }
  }
}
