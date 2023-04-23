import { model, Schema } from "mongoose";

const adminSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  pendingOrders: {
    type: [],
  },
  finishedOrders: {
    type: [],
  },
  id: {
    type: String,
    required: false,
  },
});

// eslint-disable-next-line @typescript-eslint/naming-convention
const Admin = model("Admin", adminSchema, "admin");

export default Admin;
