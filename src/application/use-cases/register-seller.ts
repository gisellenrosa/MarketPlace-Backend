import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { Seller } from '../../enterprise/entities/seller'; // Entidade do Seller
import { HashGenerator } from '../cryptography/hash-generator';
import { SellersRepository } from '../repositories/sellers-repository'; // Repositório do Seller
import { SellerAlreadyExistsError } from './errors/seller-already-exists-error'; // Erro de Seller já existe

interface CreateSellerUseCaseRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  avatarId?: string;
}

type CreateSellerUseCaseResponse = Either<
  SellerAlreadyExistsError,
  { seller: Seller }
>;

@Injectable()
export class CreateSellerUseCase {
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
  }: CreateSellerUseCaseRequest): Promise<CreateSellerUseCaseResponse> {
    const sellerWithSameEmail = await this.sellersRepository.findByEmail(email);

    if (sellerWithSameEmail) {
      return left(new SellerAlreadyExistsError(email)); // Retorna um erro caso já exista
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

    return right({ seller }); // Retorna o seller criado
  }
}
