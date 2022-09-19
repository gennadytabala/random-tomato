import { Injectable } from '@angular/core';
import { ISettings } from 'src/app/modules/interfaces/interfaces';
import { DefaultsService } from '../defaults/defaults.service';

@Injectable({
  providedIn: 'root'
})
export class ControllerService {

  private _settings: ISettings | null = null
  
  constructor(private defaults:DefaultsService) { }

  get settings() : ISettings {
    return this._settings || this.defaults.settings
  }


}
