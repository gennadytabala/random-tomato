import { Injectable } from '@angular/core';
import { ISession, ISettings, SessionStatus, SessionType } from 'src/app/modules/interfaces/interfaces';
import { BroadcastService, EventKeys } from '../broadcast/broadcast.service';
import { CalculatorService } from '../calculator/calculator.service';
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
    private timer: TimerService,
    private calculator: CalculatorService
  ) {
    this.saveSettings = this.saveSettings.bind(this)
    this.broadcastService.on(EventKeys.SETTINGS_SAVE_CLICKED).subscribe(this.saveSettings)

    this.progressDone = this.progressDone.bind(this)
    this.broadcastService.on(EventKeys.PROGRESS_DONE).subscribe(this.progressDone)

    this.progressIncreased = this.progressIncreased.bind(this)
    this.broadcastService.on(EventKeys.PROGRESS_INCREASED).subscribe(this.progressIncreased)

  }

  private progressIncreased(session:ISession){
    this.storage.setCurrentSession(session)
  }

  progressDone(){
    console.log(`contrpller progress done`);
    
    const nextSession = this.getNextSession()
    this.broadcastService.broadcast(EventKeys.SESSION_CHANGED, nextSession)
  }

  getNextSession():ISession{
    return this.calculator.calculate(
      this.getSettings(),
      this.getCurrentTimeSession())
  }

  getCurrentTimeSession():ISession {
    return this.storage.getCurrentSession() || this.getDefaultTimeSession()
  }

  private getDefaultTimeSession():ISession{
    return {
      sessionType: SessionType.WORK,
      sessionStatus: SessionStatus.STOPPED,
      duration: 30,
      progress:0,
      sessionMaxDuration: 30
    }
  }

  public startTime(){
    //this.timer.start()
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

  getSettings() : ISettings{ //TODO move to storage because of circular deps in timer
    return this.storage.getSettings()
  }

  getCurrentSession() {
    return this.storage.getCurrentSession() || this.defaults.session
  }

}
