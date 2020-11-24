// // std
// import { ok, strictEqual } from "assert";

// // 3p
// import {
//   Context,
//   createController,
//   getHttpMethod,
//   getPath,
//   isHttpResponseOK,
// } from "@foal/core";

// // App
// import { PlanController } from "./plan.controller";

// describe("PlanController", () => {
//   let controller: PlanController;

//   beforeEach(() => (controller = createController(PlanController)));

//   describe('has a "foo" method that', () => {
//     it("should handle requests at GET /.", () => {
//       strictEqual(getHttpMethod(PlanController, "foo"), "GET");
//       strictEqual(getPath(PlanController, "foo"), "/");
//     });

//     it("should return an HttpResponseOK.", () => {
//       const ctx = new Context({});
//       ok(isHttpResponseOK(controller.foo(ctx)));
//     });
//   });
// });
