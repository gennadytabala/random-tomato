import { Injectable } from '@angular/core';
import { filter, interval, Observable, takeWhile } from 'rxjs';
import { BroadcastService, EventKeys } from '../broadcast/broadcast.service';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class TimerService {

  run = false;

  timeSource = interval(1000)
  timeCounter: Observable<number>

  constructor(
    private broadcastService:BroadcastService,
    private storage: StorageService    
  ) {
    
    const tickSize = this.storage.getSettings().tickSize 
    this.timeCounter = this.timeSource.pipe( //TODO how to avoid doubling?
    takeWhile(() => this.run),
    filter(val => val % tickSize === 0)
    )
    
    this.setTickSize = this.setTickSize.bind(this)
    this.broadcastService.on(EventKeys.SETTINGS_CHANGED).subscribe(this.setTickSize)
    
  }

  setTickSize(){
    const tickSize = this.storage.getSettings().tickSize 
    this.timeCounter = this.timeSource.pipe(
      takeWhile(() => this.run),
      filter(val => val % tickSize === 0)
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
