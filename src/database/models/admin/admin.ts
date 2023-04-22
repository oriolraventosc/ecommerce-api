import { model, Schema } from "mongoose";

const projectSchema = new Schema({
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
});

// eslint-disable-next-line @typescript-eslint/naming-convention
const Project = model("Project", projectSchema, "projects");

export default Project;
