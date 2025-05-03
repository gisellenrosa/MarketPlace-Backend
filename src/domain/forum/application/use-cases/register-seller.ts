import { Injectable } from '@nestjs/common';
import { Either, left, right } from 'src/core/either';
import { HashGenerator } from '../cryptography/hash-generator';
import { Seller } from '../enterprise/entities/seller';
import { SellersRepository } from '../repositories/sellers-repository';
import { SellerAlreadyExistsError } from './errors/seller-already-exists-error';

interface RegisterSellerUseCaseRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  avatarId?: string;
}

type RegisterSellerUseCaseResponse = Either<
  SellerAlreadyExistsError,
  { seller: Seller }
>;

@Injectable()
export class RegisterSellerUseCase {
  constructor(
    private sellersRepository: SellersRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    password,
    phone,
    avatarId,
  }: RegisterSellerUseCaseRequest): Promise<RegisterSellerUseCaseResponse> {
    const sellerWithSameEmail = await this.sellersRepository.findByEmail(email);

    if (sellerWithSameEmail) {
      return left(new SellerAlreadyExistsError(email));
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const seller = Seller.create({
      name,
      email,
      password: hashedPassword,
      phone,
      avatarId,
    });

    await this.sellersRepository.create(seller);

    return right({ seller });
  }
}
