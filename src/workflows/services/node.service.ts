import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Node } from '../entities/node.entity';

@Injectable()
export class NodeService {
  constructor(
    @InjectRepository(Node)
    private readonly nodeRepository: Repository<Node>,
  ) {}

  async getNodeById(id: number): Promise<Node> {
    const node = await this.nodeRepository.findOne({ where: { id } });
    if (!node) {
      throw new NotFoundException(`Node with ID ${id} not found`);
    }
    return node;
  }

  async updateNode(id: number, updateData: Partial<Node>): Promise<Node> {
    const node = await this.getNodeById(id);

    // Update node fields
    Object.assign(node, updateData);

    return this.nodeRepository.save(node);
  }

  async deleteNode(id: number): Promise<void> {
    const node = await this.getNodeById(id);
    await this.nodeRepository.delete(node.id);
  }
}
