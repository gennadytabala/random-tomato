import { Injectable } from '@angular/core';
import { ISession, ISettings } from 'src/app/modules/interfaces/interfaces';
import { BroadcastService, EventKeys } from '../broadcast/broadcast.service';
import { DefaultsService } from '../defaults/defaults.service';

enum StorageKeys {
  SETTINGS = "setttings",
  CURRENT_SESSION = "currentSession"
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    private broadcastService: BroadcastService,
    private defaults: DefaultsService
  ) {
    console.log('stor');
    
    this.setCurrentSession = this.setCurrentSession.bind(this)
    //this.broadcastService.on(EventKeys.PROGRESS_INCREASED).subscribe(this.setCurrentSession)

    this.broadcastService.on(EventKeys.PROGRESS_INCREASED).subscribe(val => console.log(`incr st ${val}`))

  }

  setCurrentSession(session: ISession) {
    localStorage.setItem(StorageKeys.CURRENT_SESSION, JSON.stringify(session))
  }

  deleteCurrentSession(): void {
    localStorage.removeItem(StorageKeys.CURRENT_SESSION)
  }


  getCurrentSession() : ISession{
    const currentSessionStr: string | null = localStorage.getItem(StorageKeys.CURRENT_SESSION)
    if (currentSessionStr) {
      return <ISession>JSON.parse(currentSessionStr)
    }
    return this.defaults.session //TODO avoid default session - calculate each session
  }

  getSettings() {
    const settingsStr: string | null = localStorage.getItem(StorageKeys.SETTINGS)
    if (settingsStr) {
      return <ISettings>JSON.parse(settingsStr)
    }
    return this.defaults.settings
  }

  saveSettings(settings: ISettings) {
    const currentSettings = localStorage.getItem(StorageKeys.SETTINGS)
    const newSettings = JSON.stringify(settings)
    if(currentSettings !== newSettings) {
      localStorage.setItem(StorageKeys.SETTINGS, newSettings)
      this.broadcastService.broadcast(EventKeys.SETTINGS_CHANGED, settings)
    }
  }

}

