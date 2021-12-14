const AddThreadUseCase = require("../../../../Applications/use_case/AddThreadUseCase");
const GetThreadDetailUseCase = require("../../../../Applications/use_case/GetThreadDetailUseCase");

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadDetailHandler = this.getThreadDetailHandler.bind(this);
  }

  async getThreadDetailHandler(request) {
    const getThreadDetailUseCase = this._container.getInstance(
      GetThreadDetailUseCase.name
    );

    const { threadId } = request.params;

    const thread = await getThreadDetailUseCase.execute({ threadId });

    return {
      status: "success",
      data: {
        thread,
      },
    };
  }

  async postThreadHandler(request, h) {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);

    const { title, body } = request.payload;
    const { id } = request.auth.credentials;

    const addedThread = await addThreadUseCase.execute({
      title,
      body,
      userId: id,
    });

    const response = h.response({
      status: "success",
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = ThreadsHandler;
