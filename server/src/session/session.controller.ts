import {
  Controller,
  Post,
  Get,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { SessionsService } from './session.service';
import { CreateSessionDto, DailyStats, Session } from './sessions.dto';

@Controller('api')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  private convertToEasternTime(timestamp: number): Date {
    // Create a date object from the Unix timestamp
    const date = new Date(timestamp * 1000);

    // Convert to Eastern Time string
    const etString = date.toLocaleString('en-US', {
      timeZone: 'America/New_York',
    });

    // Convert back to Date object
    return new Date(etString);
  }

  private formatEasternDate(date: Date): string {
    return date
      .toLocaleString('en-US', {
        timeZone: 'America/New_York',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
      .split(',')[0]
      .split('/')
      .join('-');
  }

  @Post('track')
  async createSession(
    @Body() body: CreateSessionDto,
  ): Promise<{ status: string }> {
    try {
      const startTimeET = this.convertToEasternTime(body.start_time);
      const endTimeET = this.convertToEasternTime(body.end_time);

      const session: Session = {
        file_type: body.file_type,
        start_time: startTimeET,
        end_time: endTimeET,
        duration: body.duration,
        date: this.formatEasternDate(startTimeET),
      };

      // Validate that end_time is after start_time
      if (session.end_time <= session.start_time) {
        throw new HttpException(
          'End time must be after start time',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Validate that duration matches the time difference
      const calculatedDuration =
        (session.end_time.getTime() - session.start_time.getTime()) / 1000;
      if (Math.abs(calculatedDuration - body.duration) > 1) {
        // 1 second tolerance
        throw new HttpException(
          'Duration does not match time difference',
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.sessionsService.create(session);
      return { status: 'success' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to create session',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('stats/daily')
  async getDailyStats(): Promise<DailyStats[]> {
    try {
      return await this.sessionsService.getDailyStats();
    } catch (error) {
      throw new HttpException(
        'Failed to fetch daily stats:' + error,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
