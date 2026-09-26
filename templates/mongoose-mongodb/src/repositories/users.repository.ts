import { singleton } from "tsyringe";
import { User as UserInterface } from "@interfaces/users.interface";
import { User } from "@config/models";
import mongoose from "mongoose";

export interface IUsersRepository {
  findAll(): Promise<UserInterface[]>;
  findById(id: string): Promise<UserInterface | null>;
  findByEmail(email: string): Promise<UserInterface | null>;
  save(user: Partial<UserInterface>): Promise<UserInterface>;
  update(
    id: string,
    update: Partial<UserInterface>
  ): Promise<UserInterface | null>;
  delete(id: string): Promise<boolean>;
}

@singleton()
export class UsersRepository implements IUsersRepository {
  async findAll(): Promise<UserInterface[]> {
    const users = await User.find({}).sort({ createdAt: -1 });
    return users.map((user) => user.toJSON());
  }

  async findById(id: string): Promise<UserInterface | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }

    const user = await User.findById(id);
    return user ? user.toJSON() : null;
  }

  async findByEmail(email: string): Promise<UserInterface | null> {
    const user = await User.findOne({ email }).select("+password");
    return user ? user.toJSON() : null;
  }

  async save(userData: Partial<UserInterface>): Promise<UserInterface> {
    const user = new User(userData);
    const savedUser = await user.save();
    return savedUser.toJSON();
  }

  async update(
    id: string,
    updateData: Partial<UserInterface>
  ): Promise<UserInterface | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }

    const user = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    return user ? user.toJSON() : null;
  }

  async delete(id: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return false;
    }

    const result = await User.findByIdAndDelete(id);
    return !!result;
  }
}
