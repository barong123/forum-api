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

    let i = 0;
    while (i < repliesIdArr.length) {
      // eslint-disable-next-line no-await-in-loop
      const commentDetail = await this._commentRepository.getCommentDetail(
        repliesIdArr[i]
      );
      threadDetail.comments.push(commentDetail);
      i += 1;
    }

    return threadDetail;
  }
}

module.exports = GetThreadDetailUseCase;
