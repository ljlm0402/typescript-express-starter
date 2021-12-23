import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class User {
  @Field()
  id: number;

  @Field()
  email: string;

  @Field()
  password: string;
}
