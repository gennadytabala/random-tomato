import { Injectable } from '@angular/core';
import { ISession, ISettings, SessionStatus, SessionType } from 'src/app/modules/interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class DefaultsService {

  public maxSessionDuration = 10
  public sessionType = SessionType.WORK
  public sessionStatus = SessionStatus.STOPPED
  public sessionProgress = 0
  public tick = 1000

  public settings: ISettings = {
    maxSessionTime:30,
    restPercent:20,
    workPercent:80,
    tickSize:60
  } 

  public session: ISession = {
    sessionType: this.sessionType,
    sessionStatus: this.sessionStatus,
    duration: this.maxSessionDuration,
    progress: this.sessionProgress,
    sessionMaxDuration: this.maxSessionDuration 
  }

  constructor() { }
}
