import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialogue',
  template: `
    <h1 class="font-extrabold" mat-dialog-title>{{ data.title }}</h1>
    <div class="flex" mat-dialog-content>
      <p>{{ data.message }}</p>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button class="bg-red-700" (click)="onConfirm()">Confirm</button>
    </div>
  `,
  styles: [`
    h1 { margin: 0; }
    mat-dialog-content { font-size: 16px; margin-top: 10px; }
    mat-dialog-actions { justify-content: space-between; }
  `]
})
export class ConfirmDialogueComponent{
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string }
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
