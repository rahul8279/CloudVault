import { model, Schema } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  passwordHash: string;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select : false
    },
  },
  { timestamps: true },
);

const User = model<IUser>("User", userSchema);
export default User;
