import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BroadcastService, EventKeys } from './services/broadcast.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'random-tomato';

  @ViewChild("sidenav") sidenav: MatSidenav | null = null

  constructor(private broadcastService: BroadcastService) {
    this.settingsClicked = this.settingsClicked.bind(this)
    this.broadcastService.on(EventKeys.SETTINGS_BUTTON_CLICKED).subscribe(this.settingsClicked)
  }

  settingsClicked() {
    if (this.sidenav?.opened) {
      this.sidenav?.close()
    } else {
      this.sidenav?.open()
    }
  }

}
