const RelationRepository = require("../../Domains/relations/RelationRepository");

class RelationRepositoryPostgres extends RelationRepository {
  constructor(pool) {
    super();
    this._pool = pool;
  }

  async addRelation({ threadId, commentId, replyId }) {
    const query = {
      text: "INSERT INTO relations values($1, $2, $3)",
      values: [threadId, commentId, replyId],
    };

    await this._pool.query(query);
  }

  async getCommentsId(threadId) {
    const query = {
      text: "SELECT comment_id FROM relations WHERE thread_id = $1",
      values: [threadId],
    };

    const result = await this._pool.query(query);

    const idArr = [];
    for (let i = 0; i < result.rows.length; i += 1) {
      const commentId = result.rows[i].comment_id;
      idArr.push(commentId);
    }

    return idArr;
  }

  async getRepliesId(commentId) {
    const query = {
      text: "SELECT reply_id FROM relations WHERE comment_id = $1",
      values: [commentId],
    };

    const result = await this._pool.query(query);

    const idArr = [];
    for (let i = 0; i < result.rows.length; i += 1) {
      const replyId = result.rows[i].reply_id;

      if (replyId) {
        idArr.push(replyId);
      }
    }

    return idArr;
  }
}

module.exports = RelationRepositoryPostgres;
