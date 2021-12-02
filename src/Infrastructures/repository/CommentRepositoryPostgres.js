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

  async addComment(addComment) {
    const { content, userId, threadId } = addComment;

    const threadQuery = {
      text: "SELECT * FROM threads WHERE id = $1",
      values: [threadId],
    };

    const threadQueryResult = await this._pool.query(threadQuery);

    if (!threadQueryResult.rowCount) {
      throw new NotFoundError("thread tidak ditemukan");
    }

    const id = `comment-${this._idGenerator()}`;
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
      throw new NotFoundError("komen tidak ditemukan");
    }

    const commentDetail = result.rows[0];

    const usernameQuery = {
      text: "SELECT username FROM users WHERE id = $1",
      values: [commentDetail.owner],
    };
    const usernameQueryResult = await this._pool.query(usernameQuery);

    const { username } = usernameQueryResult.rows[0];
    const replies = [];

    const { id, date } = commentDetail;
    const content = commentDetail.is_delete
      ? "**komentar telah dihapus**"
      : commentDetail.content;

    return new CommentDetail({
      id,
      content,
      date,
      username,
      replies,
    });
  }

  async deleteComment(deleteComment) {
    const { userId, commentId } = deleteComment;

    const matchQuery = {
      text: "SELECT owner from comments WHERE id = $1",
      values: [commentId],
    };

    const result = await this._pool.query(matchQuery);

    if (!result.rowCount) {
      throw new NotFoundError("komen yang dicari tidak ditemukan");
    }

    const { owner } = result.rows[0];

    if (owner !== userId) {
      throw new AuthorizationError("anda tidak berhak melakukan perintah ini");
    }

    const query = {
      text: `UPDATE comments
      SET is_delete = true
      WHERE id = $1`,
      values: [commentId],
    };

    await this._pool.query(query);
  }
}

module.exports = CommentRepositoryPostgres;
