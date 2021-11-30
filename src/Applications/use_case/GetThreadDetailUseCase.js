const ThreadDetail = require("../../Domains/threads/entities/ThreadDetail");
const CommentDetail = require("../../Domains/threads/entities/CommentDetail");

class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const { threadId } = useCasePayload;
    const threadDetail = await this._threadRepository.getThreadDetail(threadId);

    const repliesIdArr = await this._replyRepository.getRepliesId(threadId);
    const commentsArr = [];
    if (repliesIdArr.length > 0) {
      for (let i = 0; i < repliesIdArr.length; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        const commentDetail = await this._commentRepository.getCommentDetail(
          repliesIdArr[i]
        );
        commentsArr.push(commentDetail);
      }
    }

    threadDetail.comments = commentsArr;

    return threadDetail;
  }
}

module.exports = GetThreadDetailUseCase;
