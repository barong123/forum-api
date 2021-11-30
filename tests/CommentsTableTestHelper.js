/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");

const CommentsTableTestHelper = {
  async addThread({
    id = "comment-123",
    content = "ini konten",
    date = "2021-08-08T07:22:33.555Z",
    owner = "user-CrkY5iAgOdMqv36bIvys2",
  }) {
    const query = {
      text: "INSERT INTO comments VALUES($1, $2, $3, $4)",
      values: [id, content, date, owner],
    };

    await pool.query(query);
  },

  async cleanTable() {
    await pool.query("DELETE FROM comments WHERE 1=1");
  },
};

module.exports = CommentsTableTestHelper;
