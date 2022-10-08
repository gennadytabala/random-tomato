import { Component, OnInit } from '@angular/core';
import { interval, Observable, Subscription } from 'rxjs';
import { ISession, SessionStatus, SessionType } from 'src/app/modules/interfaces/interfaces';
import { BroadcastService, EventKeys } from 'src/app/services/broadcast/broadcast.service';
import { ControllerService } from 'src/app/services/controller/controller.service';
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
    private controller: ControllerService,
    private broadcastService: BroadcastService,
    private storage: StorageService
  ) {

    const session = this.controller.getCurrentSession()
    this.currentSession = new CurrentSession(session)

    this.increaseProgress = this.increaseProgress.bind(this)
    
    this.setSession = this.setSession.bind(this)
    this.broadcastService.on(EventKeys.SESSION_CHANGED).subscribe(this.setSession)

  }

  setSession(session:ISession){
    this.currentSession = new CurrentSession(session)
  }

  increaseProgress(val:any) {
    console.log(`val ${val}`)
    const progress = this.currentSession.progress + 100/this.currentSession.duration
    const elapsed = Math.min(this.currentSession.elapsed + 1, this.currentSession.duration)
    if(progress >= 100) {
      this.currentSession.progress = 100
      this.currentSession.elapsed = this.currentSession.duration
      this.stopTime()
    } else {
      this.currentSession.progress = progress
      this.currentSession.elapsed = elapsed
      this.broadcastService.broadcast(EventKeys.PROGRESS_INCREASED, this.currentSession)
    }
  }

  ngOnInit(): void {

  }

  startTime() {

    const tickSize = this.storage.getSettings().tickSize
    this.timeSubscription = interval(tickSize * 1000).subscribe(this.increaseProgress)

    // this.currentSession.sessionStatus = SessionStatus.STARTED
    
    // this.timeSubscription = this.broadcastService.on(EventKeys.TIME_TICK).subscribe(this.increaseProgress)
    // this.broadcastService.broadcast(EventKeys.TIMER_START, "")

    // //this.controller.startTime()
  }

  stopTime() {
    this.currentSession.sessionStatus = SessionStatus.STOPPED
    this.timeSubscription?.unsubscribe()
    //this.broadcastService.broadcast(EventKeys.TIMER_STOP,"")
    this.broadcastService.broadcast(EventKeys.PROGRESS_DONE, this.currentSession)
    //this.controller.stopTime()
  }

  pauseTime() {
    this.currentSession.sessionStatus = SessionStatus.PAUSED
    this.timeSubscription?.unsubscribe()
    //this.controller.pauseTime()
  }

  get progressBarColor(): string { //TODO: color do not change 
    return this.currentSession.sessionType === SessionType.WORK ? "warn" : "accent"
  }

  get progressBarWidth(): string {
    const progressBarWidth = 100 / this.currentSession.sessionMaxDuration * Math.min(this.currentSession.duration,this.currentSession.sessionMaxDuration);
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
