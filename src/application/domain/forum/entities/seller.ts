import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export interface SellerProps {
  name: string;
  email: string;
  password: string;
  phone: string;
  avatarId?: string; // O campo avatarId é opcional
}

export class Seller extends Entity<SellerProps> {
  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }

  get phone() {
    return this.props.phone;
  }

  get avatarId() {
    return this.props.avatarId;
  }

  // Método estático para criar um novo Seller
  static create(props: SellerProps, id?: UniqueEntityID) {
    const seller = new Seller(props, id);
    return seller;
  }
}
