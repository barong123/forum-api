const LikeRepository = require("../../Domains/likes/LikeRepository");

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool) {
    super();
    this._pool = pool;
  }

  async addLike(putLike) {
    const { commentId, userId } = putLike;

    const query = {
      text: "INSERT INTO likes VALUES($1, $2)",
      values: [commentId, userId],
    };

    await this._pool.query(query);
  }

  async removeLike(putLike) {
    const { commentId, userId } = putLike;

    const query = {
      text: "DELETE FROM likes WHERE comment_id = $1 AND user_id = $2",
      values: [commentId, userId],
    };

    await this._pool.query(query);
  }

  async checkLikeExistence(putLike) {
    const { commentId, userId } = putLike;

    const query = {
      text: "SELECT * FROM likes WHERE comment_id = $1 AND user_id = $2",
      values: [commentId, userId],
    };

    const result = await this._pool.query(query);

    return Boolean(result.rowCount);
  }

  async getLikesByCommentIds(commentIds) {
    const query = {
      text: "SELECT * FROM likes WHERE comment_id = ANY($1::text[])",
      values: [commentIds],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }
}

module.exports = LikeRepositoryPostgres;
