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
    const utcDate = new Date(timestamp * 1000);

    // Create a formatter for Eastern Time
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    // Get the parts
    const parts = formatter.formatToParts(utcDate);
    const dateObj: { [key: string]: string } = {};
    parts.forEach((part) => {
      if (part.type !== 'literal') {
        dateObj[part.type] = part.value;
      }
    });

    // Construct a new date in Eastern Time
    return new Date(
      `${dateObj.year}-${dateObj.month}-${dateObj.day}T${dateObj.hour}:${dateObj.minute}:${dateObj.second}`,
    );
  }

  private formatEasternDate(date: Date): string {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    const parts = formatter.formatToParts(date);
    const month = parts.find((p) => p.type === 'month')?.value;
    const day = parts.find((p) => p.type === 'day')?.value;
    const year = parts.find((p) => p.type === 'year')?.value;

    return `${month}-${day}-${year}`;
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

      if (session.end_time <= session.start_time) {
        throw new HttpException(
          'End time must be after start time',
          HttpStatus.BAD_REQUEST,
        );
      }

      const calculatedDuration =
        (session.end_time.getTime() - session.start_time.getTime()) / 1000;
      if (Math.abs(calculatedDuration - body.duration) > 1) {
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
