import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { task } from 'src/app/models/task';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlantsService } from 'src/app/services/plants.service';
import { TasksService } from 'src/app/services/tasks.service';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.scss']
})
export class CreateTaskComponent implements OnInit {

  taskForm! : FormGroup;
  loading : boolean = false;
  selectedTaskType : string = '';

  plants : any[] = [];
  selectedPlant : string = "";

  task_types: string[] = ["Pesticide", "Fertilizer", "Watering", "Other"];
  taskTypeControl = new FormControl('');

  constructor(public dialogRef: MatDialogRef<CreateTaskComponent>,
     private fb : FormBuilder,
     private snackBar: MatSnackBar,
     private plantsService : PlantsService,
     private taskService : TasksService
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  getAllPlantsNames() : void {
    this.plantsService.getAllPlantsNames().subscribe( response =>{
      if(response.plants) {
        this.plants = response.plants;
        console.log("Get All plants result : ",this.plants);
      }
      else {
        console.log("error ");
      }

    });
  }

  onSubmit() {
    this.loading= true;
    if (this.taskForm.valid) {
      this.taskService.createTask(this.taskForm.value).subscribe(response => {
        if (response.error) {
          this.snackBar.open(
            'Error occurred while trying to create new task. Try again !',
            'Close',
            {
              duration: 4000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['custom-red-style'],
            }
          );
          setTimeout(() => {
            this.loading = false;
          }, 1000); 
        }
        else {
          this.snackBar.open(
            'Task successfully added.',
            'Close',
            {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['custom-green-style'],
            }
          );
          setTimeout(() => {
            this.loading = false;
          }, 1000); 
        }
  
      })
      
    } else {
      console.log('Task Form is invalid');
    }
  }

  isSelected(name : string) : boolean {
    if (this.selectedPlant === name) return true;
    return false;
  }

  chipChange(plant : any) {
    this.taskForm.get('plant')?.setValue(plant.plant_name, { emitEvent: false });
    this.selectedPlant = plant.plant_name;
  }

  ngOnInit(): void {
    this.getAllPlantsNames();
    this.taskForm = this.fb.group({
      plant : ['', [Validators.required]],
      task_name: ['', [Validators.required,Validators.pattern(/^[a-zA-Z_][a-zA-Z0-9_]*$/)  ]], 
      description: ['', [ Validators.minLength(6)]], 
      task_type : ['Other', [Validators.required]],
      starting_time : ['', []],
      ending_time : ['', []],
      done : [false, []]
    });
  }

}
