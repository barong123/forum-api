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

  pgm.addConstraint(
    "replies",
    "unique_thread_or_comment_id_and_reply_id",
    "UNIQUE(thread_or_comment_id, reply_id)"
  );
};

exports.down = (pgm) => {
  pgm.dropTable("replies");
};
