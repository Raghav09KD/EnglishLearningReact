import { addCommentAPI, fetchAllComments } from "../components/CommentSection/commentHelper";
import request from "../lib/api/request";

jest.mock("../lib/api/request");

describe("commentHelper", () => {
  beforeEach(() => jest.clearAllMocks());

  it("calls POST /courseComments/add with correct payload", async () => {
    request.mockResolvedValueOnce({ data: { comment: "hello" } });

    const res = await addCommentAPI({ courseId: "123", comment: "hello" });

    expect(request).toHaveBeenCalledWith({
      method: "post",
      url: "/courseComments/add",
      data: { courseId: "123", comment: "hello" },
      auth: true,
    });
    expect(res.data.comment).toBe("hello");
  });

  it("calls GET /courseComments/:id", async () => {
    request.mockResolvedValueOnce({ data: [{ id: 1 }] });

    const res = await fetchAllComments("123");

    expect(request).toHaveBeenCalledWith({
      method: "get",
      url: "/courseComments/123",
      auth: true,
    });
    expect(res.data).toEqual([{ id: 1 }]);
  });
});
