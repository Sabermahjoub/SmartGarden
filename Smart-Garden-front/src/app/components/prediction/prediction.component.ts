import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { backendData } from 'src/app/models/weather_data';
import { DateHourTempService } from 'src/app/services/date-hour-temp.service';

@Component({
  selector: 'app-prediction',
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.scss']
})
export class PredictionComponent implements OnInit {

  soil_type = [
    { name: "Loam", value: 0 },
    { name: "Sandy", value: 1 },
    { name: "Clay", value: 2 }
  ];
  
  water_frequency = [
    {name : "weekly", value : 1},
    {name : "biweekly", value:0},
    {name:"daily", value:0}
  ];

  fertilizer_type = [
    {name:"chemical",value:0},
    {name:"organic",value:2},
    {name:"none",value:1}
  ];

  
  predictionForm! : FormGroup;
  loading : boolean = false;

  constructor(private fb : FormBuilder, private service : DateHourTempService) { }

  ngOnInit(): void {
    
    this.predictionForm = this.fb.group({

      soil_type : ['', [Validators.required, Validators.pattern(/^[0-2]$/) ]],
      sunlight : [0, [Validators.required]],
      water_frequency : ['', [Validators.required,Validators.required, Validators.pattern(/^[0-2]$/)]],    
      fertilizer_type : ['', [Validators.required,Validators.pattern(/^[0-2]$/)]],
      temperature : [0, [Validators.required]],
      humidity : [0, [Validators.required ]]

    });
  };

  onSubmit() : void {
    this.loading = true;
    this.service.getDataFromBack().subscribe((response : backendData) => {
      const light_intensity = response.light_percentage? response.light_percentage*100 : 0 ;
      this.predictionForm.get('temperature')?.setValue(response.temperature);
      this.predictionForm.get('humidity')?.setValue(response.humidity);
      this.predictionForm.get('sunlight')?.setValue(light_intensity);

      console.log("Prediction form : ", this.predictionForm.value);
      // send to backend to predicct
    });

  }

}
