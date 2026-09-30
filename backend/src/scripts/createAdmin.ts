import dotenv from 'dotenv';
dotenv.config();

import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import User from '../models/User.js';

const email = (process.env.ADMIN_EMAIL || 'admin@gmail.com').trim().toLowerCase();
const password = String(process.env.ADMIN_PASSWORD || 'admin123#');

const main = async () => {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI is missing in .env');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    existingUser.name = existingUser.name || 'Admin';
    existingUser.password = await bcrypt.hash(password, 10);
    existingUser.role = 'admin';
    existingUser.status = 'Active';
    await existingUser.save();

    console.log('Admin updated successfully');
    console.log(JSON.stringify({
      email: existingUser.email,
      role: existingUser.role,
      status: existingUser.status,
      passwordMatches: await bcrypt.compare(password, existingUser.password)
    }, null, 2));
  } else {
    const createdUser = await User.create({
      name: 'Admin',
      email,
      password: await bcrypt.hash(password, 10),
      role: 'admin',
      status: 'Active',
      department: 'Management',
      location: 'System'
    });

    console.log('Admin created successfully');
    console.log(JSON.stringify({
      email: createdUser.email,
      role: createdUser.role,
      status: createdUser.status,
      passwordMatches: await bcrypt.compare(password, createdUser.password)
    }, null, 2));
  }

  await mongoose.disconnect();
};

main().catch((err) => {
  console.error('Failed to create admin:', err);
  process.exit(1);
});
