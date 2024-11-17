import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { task } from 'src/app/models/task';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.scss']
})
export class CreateTaskComponent implements OnInit {

  taskForm! : FormGroup;
  loading : boolean = false;
  selectedTaskType : string = '';

  plants : any[] = [ {'id' : 1, 'name' :"Tomato"},
    {'id' : 2, 'name' :"Pea"},
    {'id' : 3, 'name' :"Chickpea"},
    {'id' : 0, 'name' :"All"}

  ];
  selectedPlant : string = "All";

  task_types: string[] = ["Pesticide", "Fertilizer", "Watering", "Other"];
  taskTypeControl = new FormControl('');

  constructor(public dialogRef: MatDialogRef<CreateTaskComponent>,
     private fb : FormBuilder,
     private snackBar: MatSnackBar,
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    this.loading= true;
    if (this.taskForm.valid) {
      console.log(this.taskForm.value);
      this.snackBar.open(
        'New task successfully created !',
        'Close',
        {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['custom-style'],
        }
      );
    } else {
      //console.log(this.taskForm.get('task_type'));
      console.log('Task Form is invalid');
    }
  }

  isSelected(name : string) : boolean {
    if (this.selectedPlant === name) return true;
    return false;
  }

  chipChange(plant : any) {
    this.taskForm.get('plant')?.setValue(plant.name);
    this.selectedPlant = plant.name;
  }

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      plant : ['All', [Validators.required]],
      task_name: ['', [Validators.required,Validators.pattern(/^[a-zA-Z_][a-zA-Z0-9_]*$/)  ]], 
      description: ['', [ Validators.minLength(6)]], 
      task_type : ['Other', [Validators.required]],
      starting_time : ['', []],
      ending_time : ['', []],
      done : [false, []]
    });
  }

}
