import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.scss']
})
export class CreateTaskComponent implements OnInit {

  plants : string[] = ["Tomato", "Pea", "Chickpea"];
  task_types: string[] = ["Pesticide", "Fertilizer", "Watering", "Other"];

  constructor(public dialogRef: MatDialogRef<CreateTaskComponent>) {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

}
