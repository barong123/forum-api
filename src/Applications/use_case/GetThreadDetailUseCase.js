class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const { threadId } = useCasePayload;

    const threadDetail = await this._threadRepository.getThreadDetail(threadId);
    const commentsIdArr = await this._replyRepository.getRepliesId(threadId);

    let i = 0;
    while (i < commentsIdArr.length) {
      const commentDetail = await this._commentRepository.getCommentDetail(
        commentsIdArr[i]
      );
      const repliesIdArr = await this._replyRepository.getRepliesId(
        commentsIdArr[i]
      );

      let j = 0;
      while (j < repliesIdArr.length) {
        const replyDetail = await this._commentRepository.getCommentDetail(
          repliesIdArr[j]
        );

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
