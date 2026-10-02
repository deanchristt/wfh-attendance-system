import { Role } from '../../enums/role.enum';

export class EmployeeProfileDto {
  id: string;
  fullName: string;
  companyEmail: string;
  photoUrl: string | null;
  position: string;
  phoneNumber: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}
