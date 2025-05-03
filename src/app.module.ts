import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateSellerController } from './controllers/create-sellers-controller';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [],
  controllers: [CreateSellerController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
