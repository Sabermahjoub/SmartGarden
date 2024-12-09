import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { backendData } from 'src/app/models/weather_data';
import { DateHourTempService } from 'src/app/services/date-hour-temp.service';
import { PredictionService } from 'src/app/services/prediction.service';


@Component({
  selector: 'app-prediction',
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.scss']
})
export class PredictionComponent implements OnInit {

  //imageURL : string = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS490zh_FBef-1c-XUQM9MmCTrSj_7wY-wwWA&s";

  soil_type = [
    { name: "Loam", value: 0 },
    { name: "Sandy", value: 1 },
    { name: "Clay", value: 2 }
  ];
  
  watering_frequency = [
    {name : "weekly", value : 2},
    {name : "biweekly", value:0},
    {name:"daily", value:1}
  ];

  fertilizer_type = [
    {name:"chemical",value:0},
    {name:"organic",value:2},
    {name:"none",value:1}
  ];

  
  predictionForm! : FormGroup;
  loading_ML : boolean = false;
  loading_DL : boolean = false;

  constructor(private fb : FormBuilder, private service : DateHourTempService,
    private predictionService : PredictionService,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    
    this.predictionForm = this.fb.group({

      soil_type : ['', [Validators.required, Validators.pattern(/^[0-2]$/) ]],
      light_intensity : [0, [Validators.required]],
      watering_frequency : ['', [Validators.required,Validators.required, Validators.pattern(/^[0-2]$/)]],    
      fertilizer_type : ['', [Validators.required,Validators.pattern(/^[0-2]$/)]],
      temperature : [0, [Validators.required]],
      humidity : [0, [Validators.required ]]

    });
  };

  onSubmit_DL() : void {
    console.log("IMAGE SRC ", this.imageName)
    this.loading_DL = true;

    if (this.imageSrc){
      const DL_request = {"image_name" : this.imageName}; 
      this.predictionService.DL_predict(DL_request).subscribe(response => {
        if ('predicted_label' in response) {
          if(response.predicted_label === 'healthy'){
            this.snackBar.open(
              `The plant is predicted to be  : ${response.predicted_label}`,
              'Close',
              {
                duration: 3000,
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: ['custom-style'],
              }
            );  
          }
          if(response.predicted_label === 'Early_blight'){
            this.snackBar.open(
              `The plant is predicted to be in : ${response.predicted_label}`,
              'Close',
              {
                duration: 3000,
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: ['custom-orange-style'],
              }
            );  
          }
          if(response.predicted_label === 'Late_blight'){
            this.snackBar.open(
              `The plant is predicted to be in : ${response.predicted_label}`,
              'Close',
              {
                duration: 3000,
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: ['custom-red-style'],
              }
            );  
          }
          
        } 
        else if (response.error) {
          this.snackBar.open(
            'Error occurred while trying to predict. Try again !',
            'Close',
            {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['custom-red-style'],
            }
          );
        }
      });
    }

  };

  onSubmit_ML() : void {
    this.loading_ML = true;
    this.service.getDataFromBack().subscribe((response : backendData) => {
      //const light_intensity = response.light_percentage? response.light_percentage*100 : 0 ;
      const light_intensity = response.light_percentage? response.light_percentage: 0 ;
      this.predictionForm.get('temperature')?.setValue(response.temperature);
      this.predictionForm.get('humidity')?.setValue(response.humidity);
      this.predictionForm.get('light_intensity')?.setValue(light_intensity);

      console.log("Prediction form : ", this.predictionForm.value);

      this.predictionService.ML_predict(this.predictionForm.value).subscribe(response => {
        if ('prediction' in response) {
          const convertedProbabilities: { [key: string]: string } = {};

          for (const key in response.probabilities) {
            if (response.probabilities.hasOwnProperty(key)) {
              const probability = parseFloat(response.probabilities[key]).toFixed(2);
              convertedProbabilities[key] = probability;            }
          }
          
          // Combine the updated probabilities with the original response
          const convertedResponse = {
            ...response,
            probabilities: convertedProbabilities,
          };
            // Create a string to display probabilities
          const probabilitiesMessage = Object.entries(convertedResponse.probabilities)
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ');
          if (response.prediction == 0) {
            this.snackBar.open(
              `The plant is predicted to be healthy . Probabilities :${probabilitiesMessage}`,
              'Close',
              {
                duration: 3000,
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: ['custom-style'],
              }
            );
          }
          else {
            this.snackBar.open(
              `The plant is predicted to not be healthy . Probabilities :${probabilitiesMessage}`,
              'Close',
              {
                duration: 3000,
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: ['custom-red-style'],
              }
            );

          }
        } 
        else if (response.error) {
          this.snackBar.open(
            'Error occurred while trying to predict. Try again !',
            'Close',
            {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['custom-red-style'],
            }
          );
        }
      });

    });
    setTimeout(() => {
      this.loading_ML = false;
    }, 1000);

  };

  imageSrc: string | ArrayBuffer | null = null;
  imageName : string = "";

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.imageSrc = reader.result; // Base64 image data
      };

      this.imageName = file.name
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  }

}
