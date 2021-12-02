const ReplysHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "replies",
  register: async (server, { container }) => {
    const repliesHandler = new ReplysHandler(container);
    server.route(routes(repliesHandler));
  },
};
