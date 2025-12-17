import { Component } from '@angular/core';
import { SpinnerService } from './services/spinner.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],


})
export class SpinnerComponent {
  constructor(public loader: SpinnerService) {}
}
