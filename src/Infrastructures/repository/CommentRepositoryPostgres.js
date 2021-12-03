/* eslint-disable camelcase */
/* eslint-disable indent */
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const AddedComment = require("../../Domains/threads/entities/AddedComment");
const CommentDetail = require("../../Domains/threads/entities/CommentDetail");
const CommentRepository = require("../../Domains/threads/CommentRepository");
const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(addComment, isThreadReply = true) {
    const { content, userId } = addComment;
    const id = `${isThreadReply ? "comment" : "reply"}-${this._idGenerator()}`;
    const date = new Date().toISOString();
    const isDelete = false;

    const query = {
      text: "INSERT INTO comments VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner",
      values: [id, content, date, userId, isDelete],
    };

    const result = await this._pool.query(query);

    return new AddedComment({ ...result.rows[0] });
  }

  async getCommentDetail(commentId) {
    const query = {
      text: "SELECT * FROM comments WHERE id = $1",
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("komen dari thread tidak ditemukan");
    }

    const commentDetail = result.rows[0];

    const usernameQuery = {
      text: "SELECT username FROM users WHERE id = $1",
      values: [commentDetail.owner],
    };
    const usernameQueryResult = await this._pool.query(usernameQuery);

    const { username } = usernameQueryResult.rows[0];
    const replies = [];

    const { id, date, content, is_delete } = commentDetail;
    const isDeleted = is_delete;

    return new CommentDetail({
      id,
      content,
      date,
      username,
      replies,
      isDeleted,
    });
  }

  async deleteComment(deleteComment) {
    const { commentId } = deleteComment;

    const query = {
      text: `UPDATE comments
      SET is_delete = true
      WHERE id = $1`,
      values: [commentId],
    };

    await this._pool.query(query);
  }

  async verifyComment(deleteComment) {
    const { userId, commentId } = deleteComment;

    const matchQuery = {
      text: "SELECT owner from comments WHERE id = $1",
      values: [commentId],
    };

    const result = await this._pool.query(matchQuery);

    if (!result.rowCount) {
      throw new NotFoundError(
        `${
          commentId.includes("comment") ? "komen" : "balasan"
        } yang dicari tidak ditemukan`
      );
    }

    const { owner } = result.rows[0];

    if (owner !== userId) {
      throw new AuthorizationError("anda tidak berhak melakukan perintah ini");
    }
  }
}

module.exports = CommentRepositoryPostgres;
