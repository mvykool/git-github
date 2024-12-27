import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SessionsModule } from './session/session.module';

const mongoUri = process.env.MONGODB_URI?.replace(/"/g, '');

@Module({
  imports: [MongooseModule.forRoot(mongoUri), SessionsModule],
})
export class AppModule {}
