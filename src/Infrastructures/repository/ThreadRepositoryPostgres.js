const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const AddedThread = require("../../Domains/threads/entities/AddedThread");
const ThreadDetail = require("../../Domains/threads/entities/ThreadDetail");
const ThreadRepository = require("../../Domains/threads/ThreadRepository");

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(addThread) {
    const { title, body, userId } = addThread;
    const id = `thread-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: "INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner",
      values: [id, title, body, date, userId],
    };

    const result = await this._pool.query(query);

    return new AddedThread({ ...result.rows[0] });
  }

  async getThreadDetail(threadId) {
    const query = {
      text: "SELECT * FROM threads WHERE id = $1",
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("thread yang dicari tidak ditemukan");
    }

    const threadDetail = result.rows[0];

    const usernameQuery = {
      text: "SELECT username FROM users WHERE id = $1",
      values: [threadDetail.owner],
    };
    const usernameQueryResult = await this._pool.query(usernameQuery);

    const { username } = usernameQueryResult.rows[0];
    const comments = [];

    const { id, title, body, date } = threadDetail;
    return new ThreadDetail({
      id,
      title,
      body,
      date,
      username,
      comments,
    });
  }
}

module.exports = ThreadRepositoryPostgres;
