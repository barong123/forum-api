const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const AddedReply = require("../../Domains/replies/entities/AddedReply");
const ReplyRepository = require("../../Domains/replies/ReplyRepository");
const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(addReply) {
    const { content, userId } = addReply;
    const id = `reply-${this._idGenerator()}`;
    const date = new Date().toISOString();
    const isDelete = false;

    const query = {
      text: "INSERT INTO replies VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner",
      values: [id, content, date, userId, isDelete],
    };

    const result = await this._pool.query(query);

    return new AddedReply({ ...result.rows[0] });
  }

  async getReply(replyId) {
    const query = {
      text: "SELECT * FROM replies WHERE id = $1",
      values: [replyId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("balasan tidak ditemukan");
    }

    const reply = result.rows[0];
    return reply;
  }

  async deleteReply(deleteReply) {
    const { replyId } = deleteReply;

    const query = {
      text: `UPDATE replies
      SET is_delete = true
      WHERE id = $1`,
      values: [replyId],
    };

    await this._pool.query(query);
  }

  // verifyReplyOwner juga mengecek ketersedian balasan di database agar menghemat jumlah query
  async verifyReplyOwner({ userId, replyId }) {
    const query = {
      text: "SELECT owner from replies WHERE id = $1",
      values: [replyId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError(`balasan yang dicari tidak ditemukan`);
    }

    const { owner } = result.rows[0];

    if (owner !== userId) {
      throw new AuthorizationError("anda tidak berhak melakukan perintah ini");
    }
  }
}

module.exports = ReplyRepositoryPostgres;
