import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-plant',
  templateUrl: './create-plant.component.html',
  styleUrls: ['./create-plant.component.scss']
})
export class CreatePlantComponent implements OnInit {

  plantForm! : FormGroup;
  loading : boolean = false;

  wind_types: string[] = ["Low", "Moderate", "High"];


  constructor(public dialogRef: MatDialogRef<CreatePlantComponent>,
    private fb : FormBuilder  ) { }

  ngOnInit(): void {
    
    this.plantForm = this.fb.group({

      plant_name : ['', [Validators.required ]],
      minTemp_day : ['', [Validators.required, Validators.pattern(/^[1-9][0-9]*$/)]],
      maxTemp_day : ['', [Validators.required, Validators.pattern(/^[1-9][0-9]*$/)]],    
      minTemp_night : ['', [Validators.pattern(/^[1-9][0-9]*$/)]],
      maxTemp_night : ['', [Validators.pattern(/^[1-9][0-9]*$/)]],
      minHumidity : ['', [Validators.required, Validators.pattern(/^[1-9][0-9]*$/)]],
      maxHumidity: ['', [Validators.required, Validators.pattern(/^[1-9][0-9]*$/)]],
      Wind : ['', [Validators.required]],
      //maxWind : ['', [Validators.required, Validators.pattern(/^[1-9][0-9]*$/)]],
      minUVIndex : ['', [Validators.required, Validators.pattern(/^[1-9][0-9]*$/)]],
      maxUvIndex : ['', [Validators.required, Validators.pattern(/^[1-9][0-9]*$/)]],
      minLight : ['', [Validators.required, Validators.pattern(/^[1-9][0-9]*$/)]],
      maxLight : ['', [Validators.required, Validators.pattern(/^[1-9][0-9]*$/)]],
      minSoilMoisture : ['', [Validators.required, Validators.pattern(/^[1-9][0-9]*$/)]],
      maxSoilMoisture : ['', [Validators.required, Validators.pattern(/^[1-9][0-9]*$/)]]
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

}
