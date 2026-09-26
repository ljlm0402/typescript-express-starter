import { Schema, model, Document, Types } from 'mongoose';

/**
 * User 인터페이스 (MongoDB Document 타입)
 */
export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User 스키마 정의
 */
const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address',
      ],
      index: true, // 이메일 필드에 인덱스 생성
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false, // 기본적으로 password 필드는 조회 시 제외
    },
  },
  {
    timestamps: true, // createdAt, updatedAt 자동 생성
    versionKey: '__v', // 버전 키 설정
    toJSON: {
      transform: (doc, ret) => {
        // JSON 직렬화 시 _id를 id로 변환하고 불필요한 필드 제거
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.password; // JSON 응답에서 password 제거
        return ret;
      },
    },
    toObject: {
      transform: (doc, ret) => {
        // Object 변환 시에도 동일하게 적용
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
      },
    },
  },
);

/**
 * 인덱스 설정
 */
UserSchema.index({ email: 1 }, { unique: true }); // 이메일 유니크 인덱스
UserSchema.index({ createdAt: 1 }); // 생성일 인덱스

/**
 * 스키마 메서드 정의
 */
UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

/**
 * 정적 메서드: 이메일로 사용자 찾기
 */
UserSchema.statics.findByEmail = function (email: string) {
  return this.findOne({ email: email.toLowerCase() });
};

/**
 * 정적 메서드: 비밀번호 포함하여 이메일로 사용자 찾기
 */
UserSchema.statics.findByEmailWithPassword = function (email: string) {
  return this.findOne({ email: email.toLowerCase() }).select('+password');
};

/**
 * User 모델 생성 및 내보내기
 */
export const UserModel = model<IUser>('User', UserSchema);

/**
 * 타입 안전성을 위한 추가 인터페이스
 */
export interface IUserMethods {
  toJSON(): Omit<IUser, 'password'>;
}

export interface IUserStatics {
  findByEmail(email: string): Promise<IUser | null>;
  findByEmailWithPassword(email: string): Promise<IUser | null>;
}

export interface IUserModel extends IUserStatics {
  new (doc?: any): IUser & IUserMethods;
}
