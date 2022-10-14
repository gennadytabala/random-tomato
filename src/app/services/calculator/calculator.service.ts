import { Injectable } from '@angular/core';
import { SessionType, ISettings, ISession, SessionStatus } from 'src/app/modules/interfaces/interfaces';
import { BroadcastService, EventKeys } from '../broadcast/broadcast.service';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class CalculatorService {

  constructor(
    private broadcastService: BroadcastService,
    private storage: StorageService
  ) {
    console.log('calc');
    
    this.progressDone = this.progressDone.bind(this)
    this.broadcastService.on(EventKeys.PROGRESS_DONE).subscribe(this.progressDone)

    this.broadcastService.on(EventKeys.PROGRESS_INCREASED).subscribe(val => console.log(`incr ${val}`))

    this.broadcastService.on(EventKeys.TIME_TICK).subscribe(val => console.log(`tick ${val}`))
  }

  progressDone() {
    console.log(`calc progrdone: ${1}`);
    
    const currentSession = this.storage.getCurrentSession()
    const settings = this.storage.getSettings()
    const nextSession = this.calculate(settings, currentSession)
    this.broadcastService.broadcast(EventKeys.SESSION_CHANGED, nextSession)
  }

  getSessionDuration(sessionType: SessionType, settings: ISettings): number {

    //TODO second set "sessionMaxTime" 
    const sessionMaxTime: number = sessionType === SessionType.WORK ? settings.maxSessionTime : settings.maxSessionTime / 100 * settings.restPercent
    const sessionMinTime: number = 5
    const itemsPerSession = sessionMaxTime / sessionMinTime

    const sessionItem = Math.floor(sessionMaxTime / (itemsPerSession))

    const rand = Math.floor(Math.random() * itemsPerSession + 1)
    const duration = rand * sessionItem

    return duration;

  }

  calculate(settings: ISettings, currentSession: ISession) {

    let sessionType = SessionType.WORK
    if (currentSession.sessionType === SessionType.WORK) {
      sessionType = SessionType.REST
    }

    let sessionMaxTime = settings.maxSessionTime
    if (sessionType === SessionType.REST) {
      sessionMaxTime = settings.maxSessionTime * (settings.restPercent / settings.workPercent)
    }

    const duration: number = this.getSessionDuration(sessionType, settings)

    const session: ISession = {
      sessionType: sessionType,
      sessionStatus: SessionStatus.STOPPED,
      duration: duration,
      progress: 0,
      sessionMaxDuration: sessionMaxTime
    }

    console.log(`calculate(): sessionMaxDuration: ${sessionMaxTime}`);

    return session

  }

}
