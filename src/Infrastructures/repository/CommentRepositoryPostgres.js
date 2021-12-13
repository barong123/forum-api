const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const AddedComment = require("../../Domains/comments/entities/AddedComment");
const CommentRepository = require("../../Domains/comments/CommentRepository");
const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(addComment) {
    const { content, userId } = addComment;
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

  async getComment(commentId) {
    const query = {
      text: "SELECT * FROM comments WHERE id = $1",
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("komen dari thread tidak ditemukan");
    }

    const comment = result.rows[0];

    return comment;
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

  async verifyCommentExistence(commentId) {
    const matchQuery = {
      text: "SELECT * FROM comments WHERE id = $1",
      values: [commentId],
    };

    const result = await this._pool.query(matchQuery);

    if (!result.rowCount) {
      throw new NotFoundError("komen dari thread tidak ditemukan");
    }
  }

  // verifyCommemntOwner juga mengecek ketersedian komen di database agar menghemat jumlah query
  async verifyCommentOwner({ userId, commentId }) {
    const query = {
      text: "SELECT owner FROM comments WHERE id = $1",
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("komen dari thread tidak ditemukan");
    }

    const { owner } = result.rows[0];

    if (owner !== userId) {
      throw new AuthorizationError("anda tidak berhak melakukan perintah ini");
    }
  }
}

module.exports = CommentRepositoryPostgres;
