/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");

const LikesTableTestHelper = {
  async addLike({ commentid = "comment-123", userId = "user-123" }) {
    const query = {
      text: "INSERT INTO likes VALUES($1, $2)",
      values: [commentid, userId],
    };

    await pool.query(query);
  },

  async findSpecificLike({ commentId, userId }) {
    const query = {
      text: "SELECT * FROM likes WHERE comment_id = $1 AND user_id = $2",
      values: [commentId, userId],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query("DELETE FROM likes WHERE 1=1");
  },
};

module.exports = LikesTableTestHelper;
