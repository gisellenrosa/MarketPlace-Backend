import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common';
import { z } from 'zod';

export const AvatarDto = z.object({
  id: z.string().uuid(),
  url: z.string().url(),
});

export type AvatarDtoType = z.infer<typeof AvatarDto>;

const createSellerBodySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  phone: z.string(),
  password: z.string().min(6),
  email: z.string().email(),
  avatar: AvatarDto,
});

type CreateSellerBodySchema = z.infer<typeof createSellerBodySchema>;

@Controller('/sellers')
export class CreateSellerController {
  constructor(private registerSeller: RegisterSellerUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createSellerBodySchema))
  async handle(@Body() body: CreateSellerBodySchema) {
    const { name, email, password, phone, avatar } = body;

    // Executando o caso de uso para registrar o seller
    const result = await this.registerSeller.execute({
      name,
      email,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case SellerAlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
