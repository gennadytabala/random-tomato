import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ISettings } from 'src/app/modules/interfaces/interfaces';
import { BroadcastService, EventKeys } from 'src/app/services/broadcast/broadcast.service';
import { DefaultsService } from 'src/app/services/defaults/defaults.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  //private _settings: ISettings //TODO remove it?
  settingsForm: FormGroup | null = null

  constructor(
    private formBuilder: FormBuilder,
    private storage: StorageService,
    private broadcastService: BroadcastService,
    private defaults: DefaultsService
  ) {
    //this._settings = this.defaults.settings
    this.updateSettings = this.updateSettings.bind(this)
    this.broadcastService.on(EventKeys.SETTINGS_CHANGED).subscribe(this.updateSettings)
  }

  ngOnInit(): void {
    this.buildForm()
  }

  setDefault() {
    this.updateSettings(this.defaults.settings)
  }

  updateSettings(settings: ISettings) {
    const formState = { //TODO twice. extract function
      workPercent: {
        value: settings.workPercent,
        disabled: false
      },
      restPercent: {
        value: settings.restPercent,
        disabled: false
      },
      maxSessionTime: {
        value: settings.maxSessionTime,
        disabled: false
      },
      tickSize: {
        value: settings.tickSize,
        disabled: false
      }
    }
    this.settingsForm?.reset(formState)
  }

  onSubmit() {
    const settings: ISettings = {
      workPercent: +(this.settingsForm?.value.workPercent),
      restPercent: +(this.settingsForm?.value.restPercent),
      maxSessionTime: +(this.settingsForm?.value.maxSessionTime),
      tickSize: +(this.settingsForm?.value.tickSize)
    }
    this.storage.saveSettings(settings)
  }

  isFormValid() {
    return this.settingsForm?.valid
  }

  buildForm() {

    const form = {
      workPercent: new FormControl({}, Validators.required),
      restPercent: new FormControl({}, Validators.required),
      maxSessionTime: new FormControl({}, Validators.required),
      tickSize: new FormControl({}, Validators.required)
    }

    const settings = this.storage.getSettings()

    const formState = {
      workPercent: {
        value: settings.workPercent,
        disabled: false
      },
      restPercent: {
        value: settings.restPercent,
        disabled: false
      },
      maxSessionTime: {
        value: settings.maxSessionTime,
        disabled: false
      },
      tickSize: {
        value: settings.tickSize,
        disabled: false
      }
    }
    this.settingsForm = this.formBuilder.group(form)
    this.settingsForm.reset(formState)
  }
}
