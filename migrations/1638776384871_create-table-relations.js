/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("relations", {
    thread_id: {
      type: "VARCHAR(50)",
    },
    comment_id: {
      type: "VARCHAR(50)",
    },
    reply_id: {
      type: "VARCHAR(50)",
    },
  });

  pgm.addConstraint(
    "relations",
    "fk_relations.thread_id_threads.id",
    "FOREIGN KEY(thread_id) REFERENCES threads(id) ON DELETE CASCADE"
  );

  pgm.addConstraint(
    "relations",
    "fk_relations.comment_id_comments.id",
    "FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE"
  );

  pgm.addConstraint(
    "relations",
    "fk_relations.reply_id_replies.id",
    "FOREIGN KEY(reply_id) REFERENCES replies(id) ON DELETE CASCADE"
  );

  pgm.addConstraint(
    "relations",
    "unique_thread_id_and_comment_id_and_reply_id",
    "UNIQUE(thread_id, comment_id, reply_id)"
  );
};

exports.down = (pgm) => {
  pgm.dropTable("relations");
};
