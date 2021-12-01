const ReplyRepository = require("../../Domains/threads/ReplyRepository");

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool) {
    super();
    this._pool = pool;
  }

  async addReply(threadOrCommentId, replyId) {
    const query = {
      text: "INSERT INTO replies values($1, $2)",
      values: [threadOrCommentId, replyId],
    };

    await this._pool.query(query);
  }

  async getRepliesId(threadOrCommentId) {
    const query = {
      text: "SELECT reply_id FROM replies WHERE thread_or_comment_id = $1",
      values: [threadOrCommentId],
    };

    const result = await this._pool.query(query);

    const idArr = [];
    for (let i = 0; i < result.rows.length; i += 1) {
      idArr[i] = result.rows[i].reply_id;
    }

    return idArr;
  }
}

module.exports = ReplyRepositoryPostgres;
