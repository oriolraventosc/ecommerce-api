import enviroment from "../loadEnviroment.js";
import debugCreator from "debug";
import app from "./app.js";

const debug = debugCreator(`${enviroment.debug}server`);

const startServer = async (port: string) => {
  await new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      debug(`Server connected on port ${enviroment.port}`);
      resolve(server);
    });
    server.on("error", (error: Error) => {
      debug("Error connecting to the server");
      reject(error);
    });
  });
};

export default startServer;
