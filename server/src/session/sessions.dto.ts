import { IsString, IsNumber, Min } from '@nestjs/class-validator';

export class CreateSessionDto {
  @IsString()
  file_type: string;

  @IsNumber()
  @Min(0)
  start_time: number;

  @IsNumber()
  @Min(0)
  end_time: number;

  @IsNumber()
  @Min(0)
  duration: number;
}

export interface Session {
  file_type: string;
  start_time: Date;
  end_time: Date;
  duration: number;
  date: string;
}

export interface DailyStats {
  date: string;
  total_duration: number;
  session_count: number;
  avg_duration: number;
  file_types: Record<string, number>;
}
