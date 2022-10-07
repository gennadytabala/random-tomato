import { Injectable } from '@angular/core';
import { Subject, Observable, filter, map } from 'rxjs';

export enum EventKeys {
  ALL,
  SETTINGS_BUTTON_CLICKED,
  SETTINGS_SAVE_CLICKED,
  SETTINGS_CHANGED,
  TIME_TICK,
  PROGRESS_INCREASED,
  PROGRESS_DONE,
  SESSION_CHANGED,
  TIMER_START,
  TIMER_STOP,
  TIMER_PAUSE 
}

export interface IBroadcastEvent {
  key: EventKeys
  data?: any
}

@Injectable({
  providedIn: 'root'
})
export class BroadcastService {

  private eventBus = new Subject<IBroadcastEvent>()
  
  on(key:EventKeys): Observable<any>{
    return this.eventBus.asObservable().pipe(
      filter(event => event.key === EventKeys.ALL || event.key === key),
      map(event => event.data)
    )
  }
  
  broadcast(key:EventKeys, data: any){
    this.eventBus.next({key, data})
  }

}
