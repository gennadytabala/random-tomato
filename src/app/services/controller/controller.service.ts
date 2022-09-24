import { Injectable } from '@angular/core';
import { ISession, ISettings, SessionStatus, SessionType } from 'src/app/modules/interfaces/interfaces';
import { BroadcastService, EventKeys } from '../broadcast/broadcast.service';
import { DefaultsService } from '../defaults/defaults.service';
import { StorageService } from '../storage/storage.service';
import { TimerService } from '../timer/timer.service';

@Injectable({
  providedIn: 'root'
})
export class ControllerService {

  constructor(
    private defaults:DefaultsService,
    private storage:StorageService,
    private broadcastService: BroadcastService,
    private timer: TimerService
  ) {
    this.saveSettings = this.saveSettings.bind(this)
    this.broadcastService.on(EventKeys.SETTINGS_SAVE_CLICKED).subscribe(this.saveSettings)

    this.progressDone = this.progressDone.bind(this)
    this.broadcastService.on(EventKeys.PROGRESS_DONE).subscribe(this.progressDone)

  }

  progressDone(){
    const nextSession = this.getNextSession()
    this.broadcastService.broadcast(EventKeys.SESSION_CHANGED, nextSession)
  }

  getNextSession():ISession{
    return {
      sessionType: SessionType.REST,
      sessionStatus: SessionStatus.STOPPED,
      duration: 15,
      progress: 0,
      sessionMaxDuration: 20
    }
  }

  public startTime(){
    this.timer.start()
  }

  public pauseTime(){
    this.timer.stop()
  }
  
  public stopTime(){
    this.timer.stop()
    this.storage.deleteCurrentSession()
  }

  saveSettings(settings: ISettings) {
    this.storage.saveSettings(settings)
  }

  getSettings() : ISettings{
    return this.storage.getSettings() || this.defaults.settings
  }

  getCurrentSession() {
    return this.storage.getCurrentSession() || this.defaults.session
  }

}
