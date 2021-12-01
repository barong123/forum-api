/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");

const RepliesTableTestHelper = {
  async addReply({
    threadOrCommentId = "thread-123",
    replyId = "comment-123",
  }) {
    const query = {
      text: "INSERT INTO replies VALUES($1, $2)",
      values: [threadOrCommentId, replyId],
    };

    await pool.query(query);
  },

  async findRepliesByThreadId(id) {
    const query = {
      text: "SELECT * FROM replies WHERE thread_or_comment_id = $1",
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query("DELETE FROM replies WHERE 1=1");
  },
};

module.exports = RepliesTableTestHelper;
