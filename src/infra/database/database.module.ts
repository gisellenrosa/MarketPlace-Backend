import { Module } from '@nestjs/common';
import { SellersRepository } from 'src/domain/forum/application/repositories/sellers-repository';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';
import { PrismaSellersRepository } from './prisma/repositories/prisma-students-repository';

@Module({
  imports: [],
  providers: [
    PrismaService,
    {
      provide: SellersRepository,
      useClass: PrismaSellersRepository,
    },
  ],
  exports: [PrismaService, SellersRepository],
})
export class DatabaseModule {}
