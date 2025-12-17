import { Component } from '@angular/core';
import {SignOutComponent} from "@app/app-auth/sign-out/sign-out.component";

@Component({
  selector: 'app-headers-and-footers',
  standalone: true,
  imports: [
    SignOutComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './headers-and-footers.component.css'
})
export class HeaderComponent {

}
