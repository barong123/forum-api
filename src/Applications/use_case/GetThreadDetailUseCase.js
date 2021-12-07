/* eslint-disable camelcase */
/* eslint-disable no-shadow */

const ThreadDetail = require("../../Domains/threads/entities/ThreadDetail");
const CommentDetail = require("../../Domains/comments/entities/CommentDetail");
const ReplyDetail = require("../../Domains/replies/entities/ReplyDetail");

class GetThreadDetailUseCase {
  constructor({
    userRepository,
    threadRepository,
    commentRepository,
    replyRepository,
    relationRepository,
  }) {
    this._userRepository = userRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._relationRepository = relationRepository;
  }

  async execute(useCasePayload) {
    const { threadId } = useCasePayload;

    const thread = await this._threadRepository.getThread(threadId);
    const threadUsername = await this._userRepository.getUsernameById(
      thread.owner
    );

    const { id, title, body, date } = thread;
    const threadDetail = new ThreadDetail({
      id,
      title,
      body,
      date,
      username: threadUsername,
      comments: [],
    });

    const commentsIdArr = await this._relationRepository.getCommentsId(
      threadId
    );

    let i = 0;
    while (i < commentsIdArr.length) {
      const comment = await this._commentRepository.getComment(
        commentsIdArr[i]
      );
      const commentUsername = await this._userRepository.getUsernameById(
        comment.owner
      );

      const { id, content, date, is_delete } = comment;
      const commentDetail = new CommentDetail({
        id,
        content,
        date,
        username: commentUsername,
        isDeleted: is_delete,
        replies: [],
      });

      if (commentDetail.isDeleted) {
        commentDetail.content = "**komentar telah dihapus**";
      }

      const repliesIdArr = await this._relationRepository.getRepliesId(
        commentsIdArr[i]
      );

      let j = 0;
      while (j < repliesIdArr.length) {
        const reply = await this._replyRepository.getReply(repliesIdArr[j]);
        const replyUsername = await this._userRepository.getUsernameById(
          reply.owner
        );

        const { id, content, date, is_delete } = reply;
        const replyDetail = new ReplyDetail({
          id,
          content,
          date,
          username: replyUsername,
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
}

module.exports = GetThreadDetailUseCase;
