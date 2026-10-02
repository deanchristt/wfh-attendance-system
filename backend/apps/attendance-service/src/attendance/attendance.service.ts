import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, Repository } from 'typeorm';
import {
  AttendanceListAllQueryDto,
  AttendanceRecordDto,
  AttendanceStatus,
  AttendanceSummaryQueryDto,
  RecordAttendanceDto,
  throwRpc,
} from '@app/common';
import { Attendance } from '../entities/attendance.entity';

export interface AttendanceSummaryRow {
  date: string;
  masukTime: string | null;
  pulangTime: string | null;
}

function pad(value: number): string {
  return value.toString().padStart(2, '0');
}

function todayDateString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

function nowTimeString(): string {
  const now = new Date();
  return `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

function firstOfMonthString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-01`;
}

@Injectable()
export class AttendanceService {
  constructor(@InjectRepository(Attendance) private readonly attendanceRepo: Repository<Attendance>) {}

  async record(dto: RecordAttendanceDto): Promise<AttendanceRecordDto> {
    const date = todayDateString();
    const todaysRecords = await this.attendanceRepo.find({
      where: { employeeId: dto.employeeId, date },
    });

    const alreadyHas = (status: AttendanceStatus) => todaysRecords.some((r) => r.status === status);

    if (dto.status === AttendanceStatus.MASUK && alreadyHas(AttendanceStatus.MASUK)) {
      throwRpc(409, 'Sudah melakukan absen masuk hari ini');
    }
    if (dto.status === AttendanceStatus.PULANG) {
      if (!alreadyHas(AttendanceStatus.MASUK)) {
        throwRpc(400, 'Belum melakukan absen masuk hari ini');
      }
      if (alreadyHas(AttendanceStatus.PULANG)) {
        throwRpc(409, 'Sudah melakukan absen pulang hari ini');
      }
    }

    const record = this.attendanceRepo.create({
      employeeId: dto.employeeId,
      date,
      time: nowTimeString(),
      status: dto.status,
    });
    const saved = await this.attendanceRepo.save(record);
    return saved;
  }

  async getSummary(query: AttendanceSummaryQueryDto): Promise<AttendanceSummaryRow[]> {
    const from = query.from ?? firstOfMonthString();
    const to = query.to ?? todayDateString();

    const records = await this.attendanceRepo.find({
      where: { employeeId: query.employeeId, date: Between(from, to) },
      order: { date: 'ASC', time: 'ASC' },
    });

    const byDate = new Map<string, AttendanceSummaryRow>();
    for (const record of records) {
      const row = byDate.get(record.date) ?? { date: record.date, masukTime: null, pulangTime: null };
      if (record.status === AttendanceStatus.MASUK) {
        row.masukTime = record.time;
      } else {
        row.pulangTime = record.time;
      }
      byDate.set(record.date, row);
    }
    return Array.from(byDate.values()).sort((a, b) => (a.date < b.date ? 1 : -1));
  }

  async listAll(query: AttendanceListAllQueryDto): Promise<AttendanceRecordDto[]> {
    const where: FindOptionsWhere<Attendance> = {};
    if (query.employeeId) {
      where.employeeId = query.employeeId;
    }
    if (query.from && query.to) {
      where.date = Between(query.from, query.to);
    }
    const records = await this.attendanceRepo.find({
      where,
      order: { date: 'DESC', time: 'DESC' },
    });
    return records;
  }
}
