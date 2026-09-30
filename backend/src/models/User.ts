
import mongoose from "mongoose";

interface User {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  profileImage?: string;
  status?: "active" | "pending" | "inactive";
  phone?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new mongoose.Schema<User>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  profileImage: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: ["Active", "Pending", "Inactive"],
    default: "Active",
  },
  phone: {
    type: String,
    default: "",
  },
}, {
  timestamps: true,
});

const User = mongoose.model<User>("User", userSchema);
export default User;