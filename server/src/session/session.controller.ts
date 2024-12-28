import { Controller, Post, Get, Body } from '@nestjs/common';
import { SessionsService } from './session.service';

@Controller('api')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post('track')
  async createSession(@Body() body: any) {
    const usaEasternTime = 'America/New_York';
    const startTime = new Date(body.start_time * 1000);

    const date = new Intl.DateTimeFormat('en-US', {
      timeZone: usaEasternTime,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
      .format(startTime)
      .split('/')
      .reverse()
      .join('-');

    const session = {
      file_type: body.file_type,
      start_time: new Date(body.start_time * 1000),
      end_time: new Date(body.end_time * 1000),
      duration: body.duration,
      date,
    };
    await this.sessionsService.create(session);
    return { status: 'success' };
  }

  @Get('stats/daily')
  async getDailyStats() {
    return this.sessionsService.getDailyStats();
  }
}
