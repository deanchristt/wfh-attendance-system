import { HttpException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { firstValueFrom, Observable } from 'rxjs';

export interface RpcErrorShape {
  statusCode: number;
  message: string;
}

/** Used inside a microservice (identity-service / attendance-service) to signal a business error back to the caller. */
export function throwRpc(statusCode: number, message: string): never {
  throw new RpcException({ statusCode, message } as RpcErrorShape);
}

/** Used inside the gateway to turn a ClientProxy call into a plain awaited value, re-throwing RPC errors as HttpException. */
export async function callRpc<T>(source: Observable<T>): Promise<T> {
  try {
    return await firstValueFrom(source);
  } catch (err) {
    const shape = err as Partial<RpcErrorShape> & { message?: string };
    const statusCode = shape?.statusCode ?? 500;
    const message = shape?.message ?? 'Unexpected error';
    throw new HttpException(message, statusCode);
  }
}
