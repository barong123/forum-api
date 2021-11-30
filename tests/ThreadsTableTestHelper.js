/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");

const ThreadsTableTestHelper = {
  async addThread({
    id = "thread-123",
    title = "ini judul",
    body = "ini isi thread",
    date = "2021-08-08T07:22:33.555Z",
    owner = "user-CrkY5iAgOdMqv36bIvys2",
  }) {
    const query = {
      text: "INSERT INTO threads VALUES($1, $2, $3, $4, $5)",
      values: [id, title, body, date, owner],
    };

    await pool.query(query);
  },

  async cleanTable() {
    await pool.query("DELETE FROM threads WHERE 1=1");
  },
};

module.exports = ThreadsTableTestHelper;
