/* eslint-disable camelcase */
/* eslint-disable no-shadow */

const ThreadDetail = require("../../Domains/threads/entities/ThreadDetail");
const CommentDetail = require("../../Domains/comments/entities/CommentDetail");
const ReplyDetail = require("../../Domains/replies/entities/ReplyDetail");

class GetThreadDetailUseCase {
  constructor({
    threadRepository,
    commentRepository,
    replyRepository,
    likeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._likeRepository = likeRepository;
  }

  async execute(useCasePayload) {
    const { threadId } = useCasePayload;

    const thread = await this._threadRepository.getThread(threadId);

    const comments = await this._commentRepository.getCommentsByThreadId(
      threadId
    );

    const commentIds = comments.map((comment) => comment.id);
    const bulkReplies = await this._replyRepository.getRepliesByCommentIds(
      commentIds
    );

    const bulkCommentLikes = await this._likeRepository.getLikesByCommentIds(
      commentIds
    );

    return new ThreadDetail({
      ...thread,
      comments: this.getCommentsAndReplies(
        comments,
        bulkCommentLikes,
        bulkReplies
      ),
    });
  }

  getCommentsAndReplies(comments, bulkCommentLikes, bulkReplies) {
    return comments.map(
      (comment) =>
        new CommentDetail({
          ...comment,
          likeCount: this.getCommentLikeCount(bulkCommentLikes, comment.id),
          isDeleted: comment.is_delete,
          replies: this.getRepliesForComment(bulkReplies, comment.id),
        })
    );
  }

  getRepliesForComment(bulkReplies, commentId) {
    return bulkReplies
      .filter((reply) => reply.comment_id === commentId)
      .map(
        (reply) =>
          new ReplyDetail({
            ...reply,
            isDeleted: reply.is_delete,
          })
      );
  }

  getCommentLikeCount(bulkCommentLikes, commentId) {
    return bulkCommentLikes.filter((like) => like.comment_id === commentId)
      .length;
  }
}

module.exports = GetThreadDetailUseCase;
