import { Module } from '@nestjs/common';
import { RegisterSellerUseCase } from 'src/domain/forum/application/use-cases/register-seller';
import { CreateSellerController } from './controllers/create-sellers-controller';

@Module({
  imports: [],
  controllers: [CreateSellerController],
  providers: [RegisterSellerUseCase],
})
export class HttpModule {}
