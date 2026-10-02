import { Role } from '../../enums/role.enum';

export class LoginResponseDto {
  accessToken: string;
  employeeId: string;
  fullName: string;
  companyEmail: string;
  role: Role;
}
