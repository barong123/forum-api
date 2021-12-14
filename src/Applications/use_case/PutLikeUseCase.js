const PutLike = require("../../Domains/likes/entities/PutLike");

class PutLikeUseCase {
  constructor({ threadRepository, commentRepository, likeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
  }

  async execute({ threadId, commentId, userId }) {
    const putLike = new PutLike({ commentId, userId });

    await this._threadRepository.verifyThreadExistence(threadId);
    await this._commentRepository.verifyCommentExistence(commentId);
    const isCommentLiked = await this._likeRepository.checkLikeExistence(
      putLike
    );

    if (isCommentLiked) {
      await this._likeRepository.removeLike(putLike);
    } else {
      await this._likeRepository.addLike(putLike);
    }
  }
}

module.exports = PutLikeUseCase;
