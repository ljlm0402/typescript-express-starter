import {
    AllowNull,
    AutoIncrement,
    Column,
    Comment,
    PrimaryKey,
    Table,
    DataType,
    Model,
} from 'sequelize-typescript';

@Table({ modelName: 'user', timestamps: true, paranoid: true })
export default class User extends Model<User> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Comment('이메일')
  @AllowNull(false)
  @Column(DataType.STRING(45))
  email: string;

  @Comment('비밀번호')
  @AllowNull(false)
  @Column(DataType.STRING(255))
  password: string;
}
