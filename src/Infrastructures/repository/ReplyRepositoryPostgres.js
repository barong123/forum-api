/* eslint-disable camelcase */
/* eslint-disable indent */
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const AddedReply = require("../../Domains/replies/entities/AddedReply");
const ReplyDetail = require("../../Domains/replies/entities/ReplyDetail");
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

  async getReplyDetail(replyId) {
    const query = {
      text: "SELECT * FROM replies WHERE id = $1",
      values: [replyId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("balasan dari thread tidak ditemukan");
    }

    const replyDetail = result.rows[0];

    const usernameQuery = {
      text: "SELECT username FROM users WHERE id = $1",
      values: [replyDetail.owner],
    };
    const usernameQueryResult = await this._pool.query(usernameQuery);

    const { username } = usernameQueryResult.rows[0];
    const replies = [];

    const { id, date, content, is_delete } = replyDetail;
    const isDeleted = is_delete;

    return new ReplyDetail({
      id,
      content,
      date,
      username,
      replies,
      isDeleted,
    });
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

  async verifyReply({ userId, replyId }) {
    const matchQuery = {
      text: "SELECT owner from replies WHERE id = $1",
      values: [replyId],
    };

    const result = await this._pool.query(matchQuery);

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
