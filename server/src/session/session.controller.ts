import { Controller, Post, Get, Body } from '@nestjs/common';
import { SessionsService } from './session.service';

@Controller('api')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post('track')
  async createSession(@Body() body: any) {
    const session = {
      file_type: body.file_type,
      start_time: new Date(body.start_time * 1000),
      end_time: new Date(body.end_time * 1000),
      duration: body.duration,
      date: new Date(body.start_time * 1000).toISOString().split('T')[0],
    };
    await this.sessionsService.create(session);
    return { status: 'success' };
  }

  @Get('stats/daily')
  async getDailyStats() {
    return this.sessionsService.getDailyStats();
  }
}
