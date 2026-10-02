/**
 * RabbitMQ queue names - one queue per microservice RPC endpoint,
 * plus two dedicated fan-out queues for the profile-update side effects.
 */
export const MQ_QUEUES = {
  IDENTITY_RPC: 'identity_rpc_queue',
  ATTENDANCE_RPC: 'attendance_rpc_queue',
  AUDIT_EVENTS: 'audit_events_queue',
  NOTIFY_EVENTS: 'notify_events_queue',
};

/** Injection tokens for ClientProxy instances registered via ClientsModule. */
export const MQ_CLIENTS = {
  IDENTITY: 'IDENTITY_SERVICE_CLIENT',
  ATTENDANCE: 'ATTENDANCE_SERVICE_CLIENT',
  AUDIT: 'AUDIT_SERVICE_CLIENT',
  NOTIFY: 'NOTIFY_SERVICE_CLIENT',
};

/** RPC message patterns exposed by identity-service. */
export const IDENTITY_PATTERNS = {
  LOGIN: 'identity.login',
  GET_PROFILE: 'identity.get_profile',
  UPDATE_PROFILE: 'identity.update_profile',
  CHANGE_PASSWORD: 'identity.change_password',
  LIST_EMPLOYEES: 'identity.list_employees',
  GET_EMPLOYEE: 'identity.get_employee',
  CREATE_EMPLOYEE: 'identity.create_employee',
  UPDATE_EMPLOYEE: 'identity.update_employee',
};

/** RPC message patterns exposed by attendance-service. */
export const ATTENDANCE_PATTERNS = {
  RECORD: 'attendance.record',
  GET_SUMMARY: 'attendance.get_summary',
  LIST_ALL: 'attendance.list_all',
};

/** Event pattern emitted by identity-service whenever an employee profile changes. */
export const EVENT_PATTERNS = {
  EMPLOYEE_PROFILE_UPDATED: 'employee.profile.updated',
};
