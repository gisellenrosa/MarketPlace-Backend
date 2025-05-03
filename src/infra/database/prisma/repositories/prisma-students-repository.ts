import { Injectable } from '@nestjs/common';
import { Seller } from 'src/domain/forum/application/enterprise/entities/seller';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';
import { PrismaSellerMapper } from '../mappers/prisma-seller-mapper';

@Injectable()
export class PrismaSellersRepository implements SellersRepository {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<Seller | null> {
    const student = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!student) {
      return null;
    }

    return PrismaSellerMapper.toDomain(student);
  }

  async create(seller: Seller): Promise<void> {
    const data = PrismaSellerMapper.toPrisma(seller);

    await this.prisma.user.create({
      data,
    });
  }
}
