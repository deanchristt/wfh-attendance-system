import { Role } from '../enums/role.enum';

export interface JwtPayload {
  sub: string;
  companyEmail: string;
  role: Role;
}
