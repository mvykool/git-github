import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SessionsModule } from './session/session.module';

@Module({
  imports: [MongooseModule.forRoot(process.env.MONGODB_URI), SessionsModule],
})
export class AppModule {}
