import * as mongoose from 'mongoose';

const userschema = new mongoose.Schema(
  {
    fullName: {type: String, required: true},
    phoneNumber: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    userType: {type: String, required: false},
  },
  {
    methods: {
      afisare() {
        console.log(`${this.fullName}!`);
      },
    },
  }
);

export type User = mongoose.InferSchemaType<typeof userschema>;
export const User = mongoose.model('User', userschema);
