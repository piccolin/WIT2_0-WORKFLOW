import { Component } from '@angular/core';
import {SignoutComponent} from "@wit/shared/sign-out/signout.component";

@Component({
  selector: 'app-header',
  standalone: true,
    imports: [
        SignoutComponent
    ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

}
