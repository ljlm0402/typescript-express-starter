import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from '@entities/base.entity';

@Entity()
export class UserEntity extends BaseEntity {
  constructor(email: string, password: string) {
    super();
    this.email = email;
    this.password = password;
  }

  @Property({ type: 'text' })
  email!: string;

  @Property({ type: 'text' })
  password!: string;
}
