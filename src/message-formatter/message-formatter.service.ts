import { Injectable } from '@nestjs/common';

@Injectable()
export class MessageFormatterService {
  public format(str: string): string {
    return `[${new Date().toISOString()}] ${str}`;
  }
}
