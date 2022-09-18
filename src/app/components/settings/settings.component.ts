import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  settingsForm: FormGroup | null = null

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit() {
    console.log("onSubmit()");
  }

  isFormValid() {
    console.log("isFormValid");
    
    return true
  }

}
