import { Component, OnInit } from '@angular/core';
import { ISession, SessionStatus, SessionType } from 'src/app/modules/interfaces/interfaces';
import { BroadcastService, EventKeys } from 'src/app/services/broadcast/broadcast.service';
import { ControllerService } from 'src/app/services/controller/controller.service';

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

  constructor(
    private controller: ControllerService,
    private broadcastService: BroadcastService
  ) {

    const session = this.controller.getCurrentSession()
    this.currentSession = new CurrentSession(session)

    this.increaseProgress = this.increaseProgress.bind(this)
    this.broadcastService.on(EventKeys.TIME_TICK).subscribe(this.increaseProgress)
    

  }

  increaseProgress() {
    this.currentSession.progress += 100/this.currentSession.duration
    this.currentSession.elapsed++
    if(this.currentSession.progress > 100) {
      this.broadcastService.broadcast(EventKeys.PROGRESS_DONE, this.currentSession)
      this.controller.stopTime()    
    } else {
      this.broadcastService.broadcast(EventKeys.PROGRESS_INCREASED, this.currentSession)
    }
  }

  ngOnInit(): void {

  }

  startTime() {
    this.currentSession.sessionStatus = SessionStatus.STARTED
    this.controller.startTime()
  }

  stopTime() {
    this.currentSession.sessionStatus = SessionStatus.STOPPED
    this.broadcastService.broadcast(EventKeys.PROGRESS_DONE, this.currentSession)
    this.controller.stopTime()
  }

  pauseTime() {
    this.currentSession.sessionStatus = SessionStatus.PAUSED
    this.controller.pauseTime()
  }

  get progressBarColor(): string {
    return this.currentSession.sessionType === SessionType.WORK ? "warn" : "accent"
  }

  get progressBarWidth(): string {
    const progressBarWidth = 100 / this.currentSession.sessionMaxDuration * this.currentSession.duration;
    return progressBarWidth.toString()
  }
}
