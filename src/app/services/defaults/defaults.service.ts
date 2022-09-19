import { Injectable } from '@angular/core';
import { ISettings } from 'src/app/modules/interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class DefaultsService {

  public settings: ISettings = {
    maxSessionTime:30,
    restPercent:20,
    workPercent:80
  } 

  constructor() { }
}
