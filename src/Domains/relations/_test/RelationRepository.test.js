const RelationRepository = require("../RelationRepository");

describe("RelationRepository interface", () => {
  it("should throw error when invoke abstract behavior", async () => {
    // Arrange
    const replyRepository = new RelationRepository();

    // Action and Assert
    await expect(replyRepository.addRelation({})).rejects.toThrowError(
      "RELATION_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(replyRepository.getCommentsId({})).rejects.toThrowError(
      "RELATION_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(replyRepository.getRepliesId({})).rejects.toThrowError(
      "RELATION_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
  });
});
