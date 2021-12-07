/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");

const RepliesTableTestHelper = {
  async addRelation({ threadId, commentId, replyId }) {
    const query = {
      text: "INSERT INTO relations VALUES($1, $2, $3)",
      values: [threadId, commentId, replyId],
    };

    await pool.query(query);
  },

  async findCommentsByThreadId(id) {
    const query = {
      text: "SELECT * FROM relations WHERE thread_id = $1",
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async findRepliesByCommentId(id) {
    const query = {
      text: "SELECT * FROM relations WHERE comment_id = $1",
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query("DELETE FROM relations WHERE 1=1");
  },
};

module.exports = RepliesTableTestHelper;
