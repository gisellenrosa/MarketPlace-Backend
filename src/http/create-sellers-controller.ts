import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common';
import { z } from 'zod';

const createSellerBodySchema = z.object({
  id: z.string().uuid(),
  password: z.string().min(6),
  email: z.string().email(),
  name: z.string(),
  phone: z.string(),
  avatarId: z.string().optional(),
});

type CreateSellerBodySchema = z.infer<typeof createSellerBodySchema>;

@Controller('/sellers')
export class CreateSellerController {
  constructor(private registerSeller: RegisterSellerUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createSellerBodySchema))
  async handle(@Body() body: CreateSellerBodySchema) {
    const { name, email, password, phone, avatarId } = body;

    const result = await this.registerSeller.execute({
      name,
      email,
      password,
      phone,
      avatarId,
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
