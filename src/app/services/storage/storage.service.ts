import { Injectable } from '@angular/core';
import { ISession, ISettings } from 'src/app/modules/interfaces/interfaces';
import { BroadcastService, EventKeys } from '../broadcast/broadcast.service';

enum StorageKeys {
  SETTINGS = "setttings",
  CURRENT_SESSION = "currentSession"  
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    private broadcastService:BroadcastService
  ) {
    this.broadcastService.broadcast(EventKeys.SESSION_CHANGED, {
      workPercent: 1,
      restPercent: 99,
      maxSessionTime: 5
    })
  }

  deleteCurrentSession(): void {
    localStorage.removeItem(StorageKeys.CURRENT_SESSION)
  }


  getCurrentSession() {
    const currentSessionStr: string | null = localStorage.getItem(StorageKeys.CURRENT_SESSION)
    if(currentSessionStr){
      return <ISession>JSON.parse(currentSessionStr)    
  }
  return null
  }
  
  getSettings() {
    const settingsStr: string | null = localStorage.getItem(StorageKeys.SETTINGS)
    if(settingsStr){
        return <ISettings>JSON.parse(settingsStr)    
    }
    return null
  }

  saveSettings(settings:ISettings) {
    localStorage.setItem(StorageKeys.SETTINGS, JSON.stringify(settings))
    this.broadcastService.broadcast(EventKeys.SETTINGS_CHANGED, settings)  
  }

}

