export enum SessionType {
  WORK = "work",
  REST = "rest"
}

export enum SessionStatus {
  STARTED,
  PAUSED,
  STOPPED
}

export interface ISession {
  sessionType: SessionType,
  sessionStatus: SessionStatus,
  duration: number,
  progress: number,
  sessionMaxDuration: number
}

export interface ISettings {
  workPercent: number
  restPercent: number
  maxSessionTime: number
}
