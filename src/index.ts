import enviroment from "./loadEnviroment.js";
import connectToDataBase from "./database/index.js";
import startServer from "./server/index.js";

const { mongoDbUrl, port } = enviroment;

await startServer(port);
await connectToDataBase(mongoDbUrl);
