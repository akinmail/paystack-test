import request from "supertest";
import { app } from "../app";

describe("indexController test", () => {
  it("GET /health", (done) => {
    request(app).get("/health").expect(200).expect({ msg: "Up!" }, done);
  });
});
