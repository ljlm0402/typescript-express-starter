import { AllowNull, AutoIncrement, Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table({ modelName: 'user', timestamps: true, paranoid: true })
export default class User extends Model<User> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @AllowNull(false)
  @Column(DataType.STRING(45))
  email: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  password: string;
}
