import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { AuthModule } from './auth/auth.module';
import { EmployeeModule } from './employee/employee.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('IDENTITY_DB_HOST', 'localhost'),
        port: config.get<number>('IDENTITY_DB_PORT', 5432),
        username: config.get<string>('IDENTITY_DB_USER', 'postgres'),
        password: config.get<string>('IDENTITY_DB_PASSWORD', 'postgres'),
        database: config.get<string>('IDENTITY_DB_NAME', 'dexa_identity'),
        entities: [Employee],
        synchronize: true,
      }),
    }),
    AuthModule,
    EmployeeModule,
    SeedModule,
  ],
})
export class IdentityServiceModule {}
