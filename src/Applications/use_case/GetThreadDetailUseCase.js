/* eslint-disable camelcase */
/* eslint-disable no-shadow */

const ThreadDetail = require("../../Domains/threads/entities/ThreadDetail");
const CommentDetail = require("../../Domains/comments/entities/CommentDetail");
const ReplyDetail = require("../../Domains/replies/entities/ReplyDetail");

class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const { threadId } = useCasePayload;

    const thread = await this._threadRepository.getThread(threadId);
    const threadDetail = new ThreadDetail({
      ...thread,
      comments: [],
    });

    const comments = await this._commentRepository.getCommentsByThreadId(
      threadId
    );
    // const comments = this.sortByDate(UnorderedComments);

    const commentIds = comments.map((comment) => comment.id);
    const bulkReplies = await this._replyRepository.getRepliesByCommentIds(
      commentIds
    );
    // const bulkReplies = this.sortByDate(UnorderedBulkReplies);

    let i = 0;
    while (i < comments.length) {
      const comment = comments[i];

      const { id, content, date, username, is_delete } = comment;
      const commentDetail = new CommentDetail({
        id,
        content,
        date,
        username,
        isDeleted: is_delete,
        replies: [],
      });

      if (commentDetail.isDeleted) {
        commentDetail.content = "**komentar telah dihapus**";
      }

      const replies = bulkReplies.filter(
        (reply) => reply.comment_id === comment.id
      );

      let j = 0;
      while (j < replies.length) {
        const reply = replies[j];

        const { id, content, date, username, is_delete } = reply;
        const replyDetail = new ReplyDetail({
          id,
          content,
          date,
          username,
          isDeleted: is_delete,
        });

        if (replyDetail.isDeleted) {
          replyDetail.content = "**balasan telah dihapus**";
        }

        commentDetail.replies.push(replyDetail);
        j += 1;
      }

      threadDetail.comments.push(commentDetail);
      i += 1;
    }

    return threadDetail;
  }

  sortByDate(commentsOrRepliesArray) {
    return commentsOrRepliesArray.sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  }
}

module.exports = GetThreadDetailUseCase;
