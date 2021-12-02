const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const InvariantError = require("../../../Commons/exceptions/InvariantError");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const AddedThread = require("../../../Domains/threads/entities/AddedThread");
const AddThread = require("../../../Domains/threads/entities/AddThread");
const ThreadDetail = require("../../../Domains/threads/entities/ThreadDetail");
const pool = require("../../database/postgres/pool");
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");

describe("ThreadRepositoryPostgres", () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addThread function", () => {
    it("should persist added thread", async () => {
      // Arrange
      const addThread = new AddThread({
        title: "abc",
        body: "abc",
        userId: "user-123",
      });
      const fakeIdGenerator = () => "123";
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await threadRepositoryPostgres.addThread(addThread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadsById(
        "thread-123"
      );
      expect(threads).toHaveLength(1);
    });

    it("should return added comment correctly", async () => {
      // Arrange
      const addThread = new AddThread({
        title: "abc",
        body: "abc",
        userId: "user-123",
      });
      const fakeIdGenerator = () => "123";
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(addThread);

      // Assert
      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: "thread-123",
          title: "abc",
          owner: "user-123",
        })
      );
    });
  });

  describe("getThreadDetail function", () => {
    it("should throw NotFoundError when thread not found", async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        threadRepositoryPostgres.getThreadDetail("thread-123")
      ).rejects.toThrowError(NotFoundError);
    });

    it("should return thread detail correctly", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "myUser",
      });
      await ThreadsTableTestHelper.addThread({ id: "thread-123" });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const threadDetail = await threadRepositoryPostgres.getThreadDetail(
        "thread-123"
      );

      // Assert
      expect(threadDetail).toStrictEqual(
        new ThreadDetail({
          id: "thread-123",
          title: "ini judul",
          body: "ini isi thread",
          date: "2021-08-08T07:22:33.555Z",
          username: "myUser",
          comments: [],
        })
      );
    });
  });
});
