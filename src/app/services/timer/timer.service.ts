import { Injectable } from '@angular/core';
import { filter, interval, Observable, takeWhile } from 'rxjs';
import { BroadcastService, EventKeys } from '../broadcast/broadcast.service';
import { DefaultsService } from '../defaults/defaults.service';

@Injectable({
  providedIn: 'root'
})
export class TimerService {

  run = false;

  timeSource = interval(this.defaults.tick)
  timeCounter: Observable<number>

  constructor(
    private defaults:DefaultsService,
    private broadcastService:BroadcastService
  ) {
    this.timeCounter = this.timeSource.pipe(
      takeWhile(() => this.run),
      filter(val => val % 1 === 0)
    )
  }

  start() {
    this.run = true
    this.timeCounter.subscribe((val) => this.broadcastService.broadcast(EventKeys.TIME_TICK, val))
  }
  stop() {
    this.run = false
  }

}
