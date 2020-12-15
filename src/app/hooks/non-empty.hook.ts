import { Hook, HookDecorator, HttpResponseBadRequest } from "@foal/core";

function hasEmptyFields(object: any): boolean {
  const jsonString = JSON.stringify(object);
  const re = /"{2}|'{2}/;
  const hasEmptyFields = re.exec(jsonString) != null
  return hasEmptyFields;
}

export function NonEmptyBody(): HookDecorator {
  return Hook(async (ctx, services) => {
    if (hasEmptyFields(ctx.request.body)) {
      return new HttpResponseBadRequest(
        { text: `Request body contains some empty fields` }
      );
    }
  });
}

export function NonEmptyQuery(): HookDecorator {
  return Hook(async (ctx, services) => {
    if (hasEmptyFields(ctx.request.query)) {
      return new HttpResponseBadRequest({ text: `Query contains some empty fields` });
    }
  });
}
