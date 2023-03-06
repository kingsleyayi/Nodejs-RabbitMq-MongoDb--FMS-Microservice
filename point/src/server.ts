import http from "http";
import app, { port } from "./app";
import eventLogger from "./services/eventLogger";

const server = http.createServer({}, app);
server
  .listen(app.get("port"), () => {
    eventLogger.logInfo("app listening on port" + port);
  })
  .on("error", (e) => eventLogger.logWarn(e.toString()));
