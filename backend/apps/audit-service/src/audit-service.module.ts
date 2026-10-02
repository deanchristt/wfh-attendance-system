import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { AuditModule } from './audit/audit.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('AUDIT_DB_HOST', 'localhost'),
        port: config.get<number>('AUDIT_DB_PORT', 5432),
        username: config.get<string>('AUDIT_DB_USER', 'postgres'),
        password: config.get<string>('AUDIT_DB_PASSWORD', 'postgres'),
        database: config.get<string>('AUDIT_DB_NAME', 'dexa_audit'),
        entities: [AuditLog],
        synchronize: true,
      }),
    }),
    AuditModule,
  ],
})
export class AuditServiceModule {}
