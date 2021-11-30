/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("replies", {
    thread_or_comment_id: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    reply_id: {
      type: "VARCHAR(50)",
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("replies");
};
