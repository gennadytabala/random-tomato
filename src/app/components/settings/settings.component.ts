import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ISettings } from 'src/app/modules/interfaces/interfaces';
import { BroadcastService, EventKeys } from 'src/app/services/broadcast/broadcast.service';
import { ControllerService } from 'src/app/services/controller/controller.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  settingsForm: FormGroup | null = null

  constructor(
    private formBuilder:FormBuilder,
    private controller:ControllerService,
    private broadcastService:BroadcastService
  ) { }

  ngOnInit(): void {
    this.buildForm()
  }

  onSubmit() {
    console.log("onSubmit()");
    const settings: ISettings = {
      workPercent: +(this.settingsForm?.value.workPercent),
      restPercent: +(this.settingsForm?.value.restPercent),
      maxSessionTime:  +(this.settingsForm?.value.maxSessionTime)
    }
    this.broadcastService.broadcast(EventKeys.SETTINGS_SAVE_CLICKED, settings)
    this.broadcastService.broadcast(EventKeys.SETTINGS_BUTTON_CLICKED, "")
  }

  isFormValid() {
    return this.settingsForm?.valid
  }

  buildForm() {

    const form = {
      workPercent: new FormControl({},Validators.required),
      restPercent: new FormControl({},Validators.required),
      maxSessionTime: new FormControl({},Validators.required), 
    }

    const settings = this.controller.settings
    
    const formState = {
      workPercent: {
        value: settings.workPercent,
        disabled:false
      },
      restPercent: {
        value: settings.restPercent,
        disabled:false
      },
      maxSessionTime: {
        value: settings.maxSessionTime,
        disabled:false
      },
    }
    this.settingsForm = this.formBuilder.group(form)
    this.settingsForm.reset(formState)
  }

}
