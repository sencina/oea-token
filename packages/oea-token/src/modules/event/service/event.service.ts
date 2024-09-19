import { NotFoundException } from '@utils';

export class EventService {
  async create() {
    throw new NotFoundException('address');
  }
}
