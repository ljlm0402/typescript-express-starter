import { Entity, Property } from '@mikro-orm/core';

import { BaseEntity } from './BaseEntity';

@Entity()
export class User extends BaseEntity {
  @Property()
  email!: string;

  @Property()
  password!: string;

  constructor(email: string, password: string) {
    super();
    this.email = email;
    this.password = password;
  }
}
