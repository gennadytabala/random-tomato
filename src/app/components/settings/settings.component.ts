import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  settingsForm: FormGroup | null = null

  constructor(
    private formBuilder:FormBuilder
  ) { }

  ngOnInit(): void {
    this.buildForm()
  }

  onSubmit() {
    console.log("onSubmit()");
  }

  isFormValid() {
    console.log("isFormValid");
    return true
  }

  buildForm() {
    const form = {
      workTimePercent: new FormControl({},Validators.required),
      restTimePercent: new FormControl({},Validators.required),
      maxSessionTime: new FormControl({},Validators.required), 
    }
    const formState = {
      workTimePercent: {
        value: 80,
        disabled:false
      },
      restTimePercent: {
        value: 20,
        disabled:false
      },
      maxSessionTime: {
        value: 30,
        disabled:false
      },
    }
    this.settingsForm = this.formBuilder.group(form)
    this.settingsForm.reset()
  }

}
