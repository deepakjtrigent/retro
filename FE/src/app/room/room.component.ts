import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css'],
})
export class RoomComponent implements OnInit {
  constructor(
    private dialog: MatDialog
  ) {}
  public clickMessage:string = '';
  public start_doing_Input: boolean = false;
  public stop_doing_Input: boolean = false;
  public continue_doing_Input: boolean = false;

  public isEditingStartTitle:boolean = false;
  public startTitle:string = 'Start Doing';

  public ngOnInit(): void {}

  public start_doing_records = ['Windstorm', 'Bombasto', 'Magneta', 'Tornado'];
  public start_count = this.start_doing_records.length;
  public start_doing_addRecord(newRecord: string) {
    if (newRecord) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent);

      dialogRef.afterClosed().subscribe((result) => {
        if (result === true) {
          this.start_doing_records.unshift(newRecord);
        }
        this.clickMessage = '';
        this.start_doing_Input = false;
      });
    }
  }
  public stop_doing_records = ['Windstorm', 'Bombasto', 'Magneta', 'Tornado'];
  public stop_count = this.stop_doing_records.length;
  public stop_doing_addRecord(newRecord: string) {
    if (newRecord) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent);

      dialogRef.afterClosed().subscribe((result) => {
        if (result === true) {
          this.stop_doing_records.unshift(newRecord);
        }
      });
    }
    this.clickMessage = '';
    this.stop_doing_Input = false;
  }
  public continue_doing_records = [
    'Windstorm',
    'Bombasto',
    'Magneta',
    'Tornado',
    'abc',
  ];
  public continue_count = this.continue_doing_records.length;
  public continue_doing_Record(newRecord: string) {
    if (newRecord) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent);
      dialogRef.afterClosed().subscribe((result) => {
        if (result === true) {
          this.continue_doing_records.unshift(newRecord);
        }
      });
    }
    this.clickMessage = '';
    this.continue_doing_Input = false;
  }


}
