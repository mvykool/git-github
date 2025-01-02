import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SessionsModule } from './session/session.module';
import { DatabaseService } from './db/database.service';

const mongoUri = process.env.MONGODB_URI?.replace(/"/g, '');

@Module({
  imports: [MongooseModule.forRoot(mongoUri), SessionsModule],
  providers: [DatabaseService],
})
export class AppModule {}
