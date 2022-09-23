import { Injectable } from '@angular/core';
import { ISettings } from 'src/app/modules/interfaces/interfaces';
import { BroadcastService, EventKeys } from '../broadcast/broadcast.service';
import { DefaultsService } from '../defaults/defaults.service';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class ControllerService {

  constructor(
    private defaults:DefaultsService,
    private storage:StorageService,
    private broadcastService: BroadcastService
  ) {
    this.saveSettings = this.saveSettings.bind(this)
    this.broadcastService.on(EventKeys.SETTINGS_SAVE_CLICKED).subscribe(this.saveSettings)

  }

  saveSettings(settings: ISettings) {
    this.storage.saveSettings(settings)
  }

  getSettings() : ISettings{
    return this.storage.getSettings() || this.defaults.settings
  }


}
