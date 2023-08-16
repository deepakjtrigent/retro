import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
})
export class LandingPageComponent {

  constructor(public userDialog: MatDialog) {}

  public create_retro(): void {}

  public openUserDialog(): void {}
}
