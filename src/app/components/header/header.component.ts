import { Component, OnInit } from '@angular/core';
import { BroadcastService, EventKeys } from 'src/app/services/broadcast/broadcast.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private broadcastService:BroadcastService) { }

  ngOnInit(): void {
  }

  onSettingsButtonClick(){
    console.log('onSettingsButtonClick()'); //todo
    this.broadcastService.broadcast(EventKeys.SETTINGS_BUTTON_CLICKED, "")
  }

}
