import { Component, OnInit, AfterViewInit, ViewChild, ElementRef  } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import {Chart} from 'chart.js';
import { ChartConfiguration } from 'chart.js';
import { MatSnackBar } from '@angular/material/snack-bar';

import { DateHourTempService } from 'src/app/services/date-hour-temp.service';
import { PlantsService } from 'src/app/services/plants.service';
import { plant } from 'src/app/models/plant';

import { WeatherApiData, backendData } from 'src/app/models/weather_data';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CreateTaskComponent } from '../create-task/create-task.component';
import { CreatePlantComponent } from '../create-plant/create-plant.component';
import { ConfirmDialogueComponent } from '../confirm-dialogue/confirm-dialogue.component';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss'],
  providers: [DatePipe]
})
export class DashboardHomeComponent implements OnInit {

  @ViewChild('drawer') drawer!: MatDrawer; // Access drawer using the #drawer template reference
  constructor(
    private snackBar: MatSnackBar,
    private dateService : DateHourTempService,
    private plantsService : PlantsService,
    private datePipe : DatePipe,
    private dialog : MatDialog
  ) { 
  }

  @ViewChild('canvas', { static: false }) canvas!: ElementRef<HTMLCanvasElement>;
  chart!: Chart;


  selectedPlant : plant = {
    plant_name : "",
    minTemp_day : -100,
    maxTemp_day : -100,    
    minTemp_night : -100,
    maxTemp_night : -100,
    minHumidity : -100,
    maxHumidity: -100,
    Wind : "",
    minUVIndex : -100,
    maxUVIndex : -100,
    minLight : -100,
    maxLight : -100,
    minSoilMoisture : -100,
    maxSoilMoisture : -100,
    lastDateOfIrrigation : "",
    lastDateOfFertilizer : "",
    lastDateOfPesticide : "",
    lastDateOfNutrients : "",
  };

  allPlants : plant[] = [] ;

  
  // Current Date info 
  formattedTime : string = '';
  formattedDate : string = '';

  private intervalId: any;

  backendData : backendData = {
    temperature : null,
    humidity : null,
    light_percentage : null
  }
  weatherApiData: WeatherApiData = {
    sunrise : null,
    sunset : null,
    minTemperature: null,
    maxTemperature: null,
    description: null,
    uvindex: null,
    windspeed: null,
    risk : null
  };

  getAllPlants() : void {
    this.plantsService.getAllPlants().subscribe( response =>{
      if(response.plants) {
        this.allPlants = response.plants;
        console.log("Get All plants result : ",this.allPlants);
      }
      else {
        console.log("error ");
      }

    });
  }

  ngOnInit(): void {

    this.getAllPlants();

    this.formattedDate = this.datePipe.transform(new Date(), 'EEE, MMMM dd, yyyy') || '';
    this.formattedTime = this.datePipe.transform(new Date(), 'HH:mm') || '';

    const time_param = this.formattedTime.substring(0,2)+":00:00";

    this.intervalId = setInterval(() => {
      this.formattedTime = this.datePipe.transform(new Date(), 'HH:mm') || '';
    }, 1000); // Update every 1 second

    this.dateService.getWeatherData(time_param).subscribe(response => {   
      this.weatherApiData = response;
      if (response.risk === 'H') {
        this.snackBar.open(
          'DANGER : a severe risk of convective storms (thunderstorms/hail/tornadoes) predicted soon !',
          'Close',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['custom-red-style'],
          }
        );
      }
      else if (response.risk === 'M'){
        this.snackBar.open(
          'Warning : a moderate risk of convective storms (thunderstorms/hail/tornadoes) predicted !',
          'Close',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['custom-orange-style'],
          }
        );
      }
    });

    this.dateService.getDataFromBack().subscribe(response => {
      this.backendData = response;
    });
    
  }

  selectPlant(selectedPlant : any): void {
    this.selectedPlant = selectedPlant;
  }

  isDay() : boolean {
    if (this.weatherApiData.sunrise === null ) return false;
    return !this.isTimeEarlier(this.weatherApiData.sunrise);
  }

  isNight() : boolean {
    if (this.weatherApiData.sunset === null ) return false;
    return this.isTimeEarlier(this.weatherApiData.sunset);
  }

  isTimeEarlier(time: string): boolean {
    // Split the time strings into hours and minutes
    const [hours1, minutes1] = time.split(":").map(Number);
    const [hours2, minutes2] = this.formattedTime.split(":").map(Number);

    // Compare hours first
    if (hours1 < hours2) {
        return true;
    } else if (hours1 > hours2) {
        return false;
    }

    // If hours are equal, compare minutes
    return minutes1 < minutes2;
  }

  ngOnDestroy(): void {
    // Clear the interval when the component is destroyed to prevent memory leaks
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  getPercentageOfDoneTasks() : number {
    const percentage = this.getAllDoneTasks() * 100 / this.getTasksLength();
    return Math.trunc(percentage);
  }

  getTasksLength() : number {
    return this.tasks.length;
  }

  getAllDoneTasks(): number {
    return this.tasks.filter(task => task.done).length;
  }

  tasks = [
    { name: 'Watering', description: 'Water plants with 1 inch of water in the morning', starting_time : "23:00", ending_time:"23:30", done: true },
    { name: 'Fertilizing', description: 'Apply organic fertilizer at base of plants. Quantity: 50g per plant', starting_time : "07:00", ending_time:"10:00", done: false },
    { name: 'Pest Inspection', description: 'Check leaves for any signs of aphids or other pests', starting_time : "08:00", ending_time:"08:30", done: false }
  ];

  completeTask(task :any) {
    task.done = !task.done;
    this.snackBar.open(
      'Great Job. You have finished a task.',
      'Close',
      {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['custom-style'],
      }
    );
  }

  openCreatePlantComponent() {
    const dialogRef = this.dialog.open(CreatePlantComponent, {
      maxHeight: '90vh', 
      height: '90%',
      minHeight: '450px',
      minWidth: '750px',
      width: '50%',
      panelClass: 'custom-dialog-container',
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getAllPlants();
    });
  };

  openCreateTaskComponent() {
    this.dialog.open(CreateTaskComponent, {
      // data: row,
      height: '90%',
      minHeight: '450px',
      minWidth: '750px',
      width: '50%',
      data: 'create-task',
      panelClass: 'custom-dialog-container',
      // minHeight: '180px',
    });
  };

  verifyWindRange() : string {

    let windspeed = -100;
    if(this.weatherApiData.windspeed !== null){
      windspeed = this.weatherApiData.windspeed
    }
    else return '';

    if (this.selectedPlant.Wind === 'Light') {

      if (windspeed >= 0 && windspeed <= 11) return 'N' ; 
      if (windspeed > 11 && windspeed <= 28) return 'H' ; 
      if (windspeed > 28) return 'VH';
    }
    if (this.selectedPlant.Wind === 'Moderate') {

      //if (windspeed >= 0 && windspeed < 10) return 'VL' ; 
      if (windspeed >= 0 && windspeed < 11) return 'L' ; 
      if (windspeed >= 11 && windspeed <= 28) return 'N' ; 
      if (windspeed > 28 && windspeed <= 50) return 'H' ; 
      if (windspeed > 50) return 'VH' ; 
    }
    if (this.selectedPlant.Wind === 'High') {

      if (windspeed >= 0 && windspeed <= 5) return 'VL' ;
      if (windspeed > 5 && windspeed < 28) return 'L' ; 
      if (windspeed >= 28) return 'N' ;
    }
    return '';
  }

  verifyTemperatureRange() : string {
    let min = -100;
    let max = -100;

    if(this.isDay()) {
      max = this.selectedPlant.maxTemp_day;
      min = this.selectedPlant.minTemp_day;
    }
    else if (this.isNight()) {
      max = this.selectedPlant.maxTemp_night;
      min = this.selectedPlant.minTemp_night;
    }
    if(min=== -100 || max === -100) return '';
    // console.log("Min : ",min);
    // console.log("Max : ",max);

    if(this.backendData.temperature !== null){
      const temp = this.backendData.temperature;
      if(temp >= min && temp<= max) return 'N'
      else if (temp < min){
        const difference = min - temp;
        if (difference >= 10) return 'VL';
        else return 'L';
      }
      else if (temp > max){
        const difference = temp - max;
        if (difference >= 10) return 'VH';
        else return 'H';
      }
    }
    return '';

  }

  verifyHumidityRange() : string {
    const max = this.selectedPlant.maxHumidity;
    const min = this.selectedPlant.minHumidity;
    if(min=== -100 || max === -100) return '';
    // console.log("Min : ",min);
    // console.log("Max : ",max);


    if(this.backendData.humidity !== null){
      const hum = this.backendData.humidity;
      if(hum >= min && hum<= max) return 'N'
      else if (hum < min){
        const difference = min - hum;
        if (difference >= 10) return 'VL';
        else return 'L';
      }
      else if (hum > max){
        const difference = hum - max;
        if (difference >= 10) return 'VH';
        else return 'H';
      }
    }
    return '';

  }

  verifyLightRange() : string {
    const max = this.selectedPlant.maxLight;
    const min = this.selectedPlant.minLight;
    if(min=== -100 || max === -100) return '';
    // console.log("Min : ",min);
    // console.log("Max : ",max);


    if(this.backendData.light_percentage !== null){
      const light = this.backendData.light_percentage;
      if(light >= min && light<= max) return 'N'
      else if (light < min){
        const difference = min - light;
        if (difference >= 10) return 'VL';
        else return 'L';
      }
      else if (light > max){
        const difference = light - max;
        if (difference >= 10) return 'VH';
        else return 'H';
      }
    }
    return '';

  }

  verifyUVRange() : string {
    const max = this.selectedPlant.maxUVIndex;
    const min = this.selectedPlant.minUVIndex;
    if(min=== -100 || max === -100) return '';


    if(this.weatherApiData.uvindex !== null){
      const uv = this.weatherApiData.uvindex;
      if(uv >= min && uv<= max) return 'N'
      else if (uv < min){
        const difference = min - uv;
        if (difference >= 3) return 'VL';
        else return 'L';
      }
      else if (uv > max){
        const difference = uv - max;
        if (difference >= 3) return 'VH';
        else return 'H';
      }
    }
    return '';

  }

  onDelete(plantName : string) : void {

    const deleteDialog = this.dialog.open(ConfirmDialogueComponent, {
      width: '500px',
      panelClass: 'custom-confirm-dialog-container',
      data: { 
        title: 'Confirm deletion', 
        message: 'Are you sure you want to delete this plant?' 
      }
    });

    deleteDialog.afterClosed().subscribe(result => {
      // User confirmed the action 
      if (result) {
        this.plantsService.deletePlant(plantName).subscribe(response => {
          console.log("RESPONSE DELETE / ",response);
          if (response.error) {
            this.snackBar.open(
              'Error occurred while trying to delete plant. Try again !',
              'Close',
              {
                duration: 3000,
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: ['custom-red-style'],
              }
            );
          }
          else {
            this.snackBar.open(
              'Plant successfully deleted.',
              'Close',
              {
                duration: 3000,
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: ['custom-style'],
              }
            );
            this.getAllPlants();
            this.selectedPlant = {
              plant_name : "",
              minTemp_day : -100,
              maxTemp_day : -100,    
              minTemp_night : -100,
              maxTemp_night : -100,
              minHumidity : -100,
              maxHumidity: -100,
              Wind : "",
              minUVIndex : -100,
              maxUVIndex : -100,
              minLight : -100,
              maxLight : -100,
              minSoilMoisture : -100,
              maxSoilMoisture : -100,
              lastDateOfIrrigation : "",
              lastDateOfFertilizer : "",
              lastDateOfPesticide : "",
              lastDateOfNutrients : "",
            };

          }
        });
      } else {
        console.log('User canceled the deletion');
      }
    });

  }
  
  public doughnutChartLabels: string[] = [];
  public doughnutChartDatasets: ChartConfiguration<'doughnut'>['data']['datasets'] = [
    {
      data: [7, 3], // Actual value and remaining to max
      backgroundColor: ['#FF6384', '#E0E0E0'], // Color for each section
      borderWidth: 0,
    }
    ];

}
