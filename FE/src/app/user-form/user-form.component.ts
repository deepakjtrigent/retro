import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
})
export class UserFormComponent {
  public displayName: FormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(15),
  ]);

  constructor(public dialogRef: MatDialogRef<UserFormComponent>) {}

  public getErrorMessage(): string {
    if (
      this.displayName.hasError('required') ||
      this.displayName.hasError('minlength')
    ) {
      return 'Come on. Your name should have at least two characters.';
    }

    return this.displayName.hasError('maxlength') ? 'Your name should not be greater than 15 characters' : '';
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }
}
