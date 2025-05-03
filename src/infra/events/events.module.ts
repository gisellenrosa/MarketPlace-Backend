import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [
    // Add your event handlers or services here
  ],
})
export class EventsModule {}
