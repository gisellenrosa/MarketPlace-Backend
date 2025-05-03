import { Injectable } from '@nestjs/common';
import { Either, right } from 'src/core/either';
import { HashGenerator } from '../forum/application/cryptography/hash-generator';
import { Seller } from '../forum/application/enterprise/entities/seller';
import { SellersRepository } from '../forum/application/repositories/sellers-repository';
import { SellerAlreadyExistsError } from '../forum/application/use-cases/errors/seller-already-exists-error';

interface RegisterSellerUseCaseRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  avatarId?: string;
}

type RegisterSellerUseCaseResponse = Either<
  SellerAlreadyExistsError,
  {
    seller: Seller;
  }
>;

@Injectable()
export class RegisterStudentUseCase {
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
    const studentWithSameEmail =
      await this.sellersRepository.findByEmail(email);

    if (studentWithSameEmail) {
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

    return right({
      seller,
    });
  }
}
function left(
  arg0: any,
): RegisterSellerUseCaseResponse | PromiseLike<RegisterSellerUseCaseResponse> {
  throw new Error('Function not implemented.');
}
