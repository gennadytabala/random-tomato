import { Component, OnInit } from '@angular/core';
import { interval, Observable, Subscription } from 'rxjs';
import { ISession, ISettings, SessionStatus, SessionType } from 'src/app/modules/interfaces/interfaces';
import { BroadcastService, EventKeys } from 'src/app/services/broadcast/broadcast.service';
import { CalculatorService } from 'src/app/services/calculator/calculator.service';
import { StorageService } from 'src/app/services/storage/storage.service';

interface ICurrentSession extends ISession {
  elapsed: number,
  remaining: number
}

class CurrentSession implements ICurrentSession {

  sessionType: SessionType
  sessionStatus: SessionStatus
  sessionMaxDuration: number
  duration: number
  progress: number
  elapsed: number
  remaining: number

  constructor(session: ISession) {

    this.sessionType = session.sessionType
    this.sessionStatus = session.sessionStatus
    this.duration = session.duration
    this.progress = session.progress
    this.elapsed = 0
    this.remaining = this.duration - this.elapsed
    this.sessionMaxDuration = session.sessionMaxDuration

  }
}

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  currentSession: ICurrentSession
  timeSubscription: Subscription | null = null

  constructor(
    private broadcastService: BroadcastService,
    private calculator: CalculatorService,
    private storage: StorageService
  ) {

    const session = this.storage.getCurrentSession()
    this.currentSession = new CurrentSession(session)

    this.increaseProgress = this.increaseProgress.bind(this)
    
    this.setSettings = this.setSettings.bind(this)
    this.broadcastService.on(EventKeys.SETTINGS_CHANGED).subscribe(this.setSettings)

  }

  setSettings(settings:ISettings) {
    
    this.currentSession.sessionStatus = SessionStatus.STOPPED
    this.timeSubscription?.unsubscribe()
    
    const newSession = this.calculator.calculate(settings, this.currentSession)
    
    const newCurrentSession = new CurrentSession(newSession) // TODO add currSess propperties to ISess, kill currSess 
    newCurrentSession.sessionType = this.currentSession.sessionType
    newCurrentSession.elapsed = this.currentSession.elapsed
    newCurrentSession.progress = newCurrentSession.duration/100 * newCurrentSession.elapsed
    
    this.currentSession = newCurrentSession
    this.storage.setCurrentSession(this.currentSession)
    
    this.currentSession.sessionStatus = SessionStatus.STARTED
    const tickSize = this.storage.getSettings().tickSize
    this.timeSubscription = interval(tickSize * 1000).subscribe(this.increaseProgress)
    
  }

  setSession(session: ISession) {
    this.currentSession = new CurrentSession(session)
    this.pauseTime()
    this.startTime()
  }

  increaseProgress() {
    
    const progress = this.currentSession.progress + 100 / this.currentSession.duration
    const elapsed = Math.min(this.currentSession.elapsed + 1, this.currentSession.duration)
    if (progress >= 100) {
      this.currentSession.progress = 100
      this.currentSession.elapsed = this.currentSession.duration
      this.stopTime()
      //this.broadcastService.broadcast(EventKeys.PROGRESS_DONE, this.currentSession)
    } else {
      this.currentSession.progress = progress
      this.currentSession.elapsed = elapsed
      this.broadcastService.broadcast(EventKeys.PROGRESS_INCREASED, this.currentSession)
    }
  
  }

  ngOnInit(): void {

  }

  startTime() {
    this.currentSession = new CurrentSession(this.storage.getCurrentSession())
    this.currentSession.sessionStatus = SessionStatus.STARTED
    const tickSize = this.storage.getSettings().tickSize
    this.timeSubscription = interval(tickSize * 1000).subscribe(this.increaseProgress)
  }

  stopTime() {
    
    this.currentSession.sessionStatus = SessionStatus.STOPPED
    this.timeSubscription?.unsubscribe()
    
    const newSession = this.calculator.calculate(this.storage.getSettings(), this.currentSession)
    this.currentSession = new CurrentSession(newSession)
    this.storage.setCurrentSession(this.currentSession)
    
  }

  pauseTime() {
    this.currentSession.sessionStatus = SessionStatus.PAUSED
    this.storage.setCurrentSession(this.currentSession)
    this.timeSubscription?.unsubscribe()
  }

  get progressBarColor(): string { //TODO: color do not change 
    return this.currentSession.sessionType === SessionType.WORK ? "warn" : "accent"
  }

  get progressBarWidth(): string {
    const progressBarWidth = 100 / this.currentSession.sessionMaxDuration * Math.min(this.currentSession.duration, this.currentSession.sessionMaxDuration);
    return progressBarWidth.toString()
  }

  buttonStartDisabled(): boolean {
    return this.currentSession.sessionStatus === SessionStatus.STARTED
  }
  buttonStopDisabled(): boolean {
    return this.currentSession.sessionStatus === SessionStatus.STOPPED
  }
  buttonPauseDisabled(): boolean {
    return this.currentSession.sessionStatus === SessionStatus.PAUSED
      ||
      this.currentSession.sessionStatus === SessionStatus.STOPPED
  }

}
