import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {AuthHeaderComponent} from "@app/app-auth/auth-header/auth-header.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AuthHeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'waverly-dovetail';
}
