import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from '@app/common';
import { Employee } from '../entities/employee.entity';

/** Seeds a default admin + a couple of sample employees so the app is usable right after first boot. */
@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(@InjectRepository(Employee) private readonly employeeRepo: Repository<Employee>) {}

  async onModuleInit() {
    const count = await this.employeeRepo.count();
    if (count > 0) {
      return;
    }

    const seedPassword = await bcrypt.hash('password123', 10);
    await this.employeeRepo.save([
      this.employeeRepo.create({
        fullName: 'HRD Admin',
        companyEmail: 'admin@dexagroup.com',
        passwordHash: seedPassword,
        position: 'HRD Administrator',
        phoneNumber: '081200000000',
        role: Role.ADMIN,
      }),
      this.employeeRepo.create({
        fullName: 'Budi Santoso',
        companyEmail: 'budi.santoso@dexagroup.com',
        passwordHash: seedPassword,
        position: 'Software Engineer',
        phoneNumber: '081200000001',
        role: Role.EMPLOYEE,
      }),
      this.employeeRepo.create({
        fullName: 'Siti Aminah',
        companyEmail: 'siti.aminah@dexagroup.com',
        passwordHash: seedPassword,
        position: 'Product Analyst',
        phoneNumber: '081200000002',
        role: Role.EMPLOYEE,
      }),
    ]);
    this.logger.log('Seeded default admin + sample employees (password: password123)');
  }
}
