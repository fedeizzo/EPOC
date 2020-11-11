import { Config, Hook, HookDecorator, HttpResponse } from '@foal/core';
import { sign } from 'jsonwebtoken';

export function RefreshJWT(): HookDecorator {
  return Hook(async (ctx, services) => {
    if (!ctx.user) {
      return;
    }

    return (response: HttpResponse) => {
      const newToken = sign(
        { username: ctx.user.username },
        Config.get<string>('settings.jwt.secretOrPublicKey'),
        { expiresIn: '15m' }
      );
      response.setHeader('Authorization', newToken);
    }
  });
}
