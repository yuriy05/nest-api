import { Injectable } from '@nestjs/common';
import { MessageFormatterService } from 'src/message-formatter/message-formatter.service';

@Injectable()
export class LoggerService {
  constructor(
    private readonly messageFormatterService: MessageFormatterService,
  ) {}

  public log(msg: string): string {
    const formattedMessage = this.messageFormatterService.format(msg);

    console.log(formattedMessage);

    return formattedMessage;
  }
}
