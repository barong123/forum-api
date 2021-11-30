/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable("comments", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    content: {
      type: "TEXT",
      notNull: true,
    },
    date: {
      type: "TEXT",
      notNull: true,
    },
    owner: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    is_delete: {
      type: "BOOLEAN",
      notNull: true,
    },
    // followed_thread_or_comment_id: {
    //   type: "VARCHAR(50)",
    //   notNull: true,
    // },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("comments");
};
