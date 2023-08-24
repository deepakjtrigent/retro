import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { JoinUser } from 'src/app/shared/model/user';
import { CreateRetroService } from 'src/app/shared/services/create-retro.service';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-join-room-form',
  templateUrl: './join-room-form.component.html',
  styleUrls: ['./join-room-form.component.css'],
})
export class JoinRoomFormComponent {
  
  joinUser: JoinUser = {
    noteId:'',
    note:'',
    userId: '',
    displayName: '',
   
  };
  retroId!: string;
  retro_id!: string;

  constructor(
    public createRetroService: CreateRetroService,
    public dialogRef: MatDialogRef<JoinRoomFormComponent>,
  ) {}

  public displayName: FormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(15),
  ]);

  public getErrorMessage(): string {
    if (
      this.displayName.hasError('required') ||
      this.displayName.hasError('minlength')
    ) {
      return 'Come on. Your name should have at least three characters.';
    }

    return this.displayName.hasError('maxlength')
      ? 'Your name should not be greater than 15 characters': '';
  }

  public closeDialog(): void { 
    this.dialogRef.close()
  }
}