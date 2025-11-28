import { Component } from '@angular/core';
import {LogoutComponent} from "@wit/shared/log-out/logout.component";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    LogoutComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

}
