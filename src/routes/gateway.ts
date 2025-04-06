import { Request, Response } from 'express';
import { createGatewayOnNodeRuntime } from '@lobehub/chat-plugins-gateway';

gatewayRoute.route = '/gateway' as const;

export async function gatewayRoute(req: Request, res: Response) {
  const handler = createGatewayOnNodeRuntime({});

  return await handler(req, res);
}
