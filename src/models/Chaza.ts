import mongoose from "mongoose";

const chazaSchema = new mongoose.Schema(
  {
    owner: {
      ref: "User",
      type: mongoose.Schema.Types.ObjectId,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    products: [
      {
        ref: "Product",
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    score: {
      type: Number,
      default: -1,
    },
    image: {
      type: String,
      requried: true,
    },
    payment_method: [
      {
        type: Number,
      },
    ],
    QR: [
      {
        name:{
          Type: String,
          required: false 
        }, 
        url:{
          Type: String,
          required: false
        },
      }
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Chaza = mongoose.model("Chaza", chazaSchema);

export default Chaza;
