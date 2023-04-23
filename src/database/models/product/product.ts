import { Schema, model } from "mongoose";

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  quantity: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
});

// eslint-disable-next-line @typescript-eslint/naming-convention
const Contact = model("Product", productSchema, "Products");

export default Contact;
