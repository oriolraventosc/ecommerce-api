import enviroment from "../loadEnviroment.js";
import mongoose from "mongoose";
import debugCreator from "debug";

const debug = debugCreator(`${enviroment.debug}database`);

const connectToDataBase = async (url: string) => {
  try {
    await mongoose.connect(url);
    mongoose.set("debug", process.env.DEBUG === "true");
    mongoose.set("toJSON", {
      virtuals: true,
      transform(doc, ret) {
        delete ret._id;
        delete ret.__v;

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return ret;
      },
    });
    debug("Connected to the data base");
  } catch {
    debug("Error connecting with the data base");
  }
};

export default connectToDataBase;
