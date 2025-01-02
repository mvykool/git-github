import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private keepAliveInterval: NodeJS.Timeout;

  constructor(@InjectConnection() private readonly connection: Connection) {}

  async onModuleInit() {
    console.log('DatabaseService initialized');

    // Start keep-alive pings every 5 minutes
    this.keepAliveInterval = setInterval(
      async () => {
        try {
          await this.connection.db.admin().ping();
          console.log('Keep-alive ping successful');
        } catch (error) {
          console.error('Error during keep-alive ping:', error);
        }
      },
      5 * 60 * 1000,
    ); // Ping every 5 minutes
  }

  onModuleDestroy() {
    // Clear the interval when the module is destroyed
    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval);
      console.log('Keep-alive pings stopped');
    }
  }
}
