import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginRequestDto, LoginResponseDto, throwRpc } from '@app/common';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Employee } from '../entities/employee.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Employee) private readonly employeeRepo: Repository<Employee>,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginRequestDto): Promise<LoginResponseDto> {
    const employee = await this.employeeRepo.findOne({
      where: { companyEmail: dto.companyEmail },
    });
    if (!employee) {
      throwRpc(401, 'Email perusahaan atau password salah');
    }

    const passwordMatches = await bcrypt.compare(dto.password, employee.passwordHash);
    if (!passwordMatches) {
      throwRpc(401, 'Email perusahaan atau password salah');
    }

    const accessToken = await this.jwtService.signAsync({
      sub: employee.id,
      companyEmail: employee.companyEmail,
      role: employee.role,
    });

    return {
      accessToken,
      employeeId: employee.id,
      fullName: employee.fullName,
      companyEmail: employee.companyEmail,
      role: employee.role,
    };
  }
}
