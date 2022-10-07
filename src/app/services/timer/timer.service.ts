import { Injectable } from '@angular/core';
import { filter, interval, Observable, Subscription, takeWhile } from 'rxjs';
import { BroadcastService, EventKeys } from '../broadcast/broadcast.service';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class TimerService {

  run = false;

  timeSource = interval(1000)
  //timeCounter: Observable<number> | null = null
  timeCounter: Subscription | null = null

  constructor(
    private broadcastService: BroadcastService,
    private storage: StorageService
  ) {
    this.setTickSize = this.setTickSize.bind(this)
    this.broadcastService.on(EventKeys.SETTINGS_CHANGED).subscribe(this.setTickSize)

    this.start = this.start.bind(this)
    this.broadcastService.on(EventKeys.TIMER_START).subscribe(this.start)
    
    this.stop = this.stop.bind(this)
    this.broadcastService.on(EventKeys.TIMER_STOP).subscribe(this.stop)
    
  }

  setTickSize() {
    this.stop()
    this.start()
  }

  start() {
    const that = this //TODO
    this.run = true
    const tickSize = this.storage.getSettings().tickSize
    this.timeCounter = interval(tickSize * 1000).subscribe({
      next(val) {
        that.broadcastService.broadcast(EventKeys.TIME_TICK, val)
      }
    })
  }
  stop() {
    this.run = false
    this.timeCounter?.unsubscribe()
  }

}
