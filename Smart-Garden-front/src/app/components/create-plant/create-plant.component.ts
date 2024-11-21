import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
  @Input() min: number = 0;
  @Input() max: number = 100;

  @Input() startValue_1: number = 0; // Initial start value
  @Input() endValue_1: number = 100; // Initial end value

  @Input() startValue_2: number = 0; // Initial start value
  @Input() endValue_2: number = 100; // Initial end value

  @Output() rangeChange = new EventEmitter<{ start: number; end: number }>();

  get startPercentage_1(): number {
    return ((this.startValue_1 - this.min) / (this.max - this.min)) * 100;
  }

  get startPercentage_2(): number {
    return ((this.startValue_2 - this.min) / (this.max - this.min)) * 100;
  }

  get endPercentage_1(): number {
    return ((this.endValue_1 - this.min) / (this.max - this.min)) * 100;
  }

  get endPercentage_2(): number {
    return ((this.endValue_2 - this.min) / (this.max - this.min)) * 100;
  }

  get rangeWidth_1(): number {
    return this.endPercentage_1 - this.startPercentage_1;
  }

  get rangeWidth_2(): number {
    return this.endPercentage_2 - this.startPercentage_2;
  }

  StartValueSupEndValue_1() : boolean {
    return this.startValue_1 > this.endValue_1;
  }

  StartValueSupEndValue_2() : boolean {
    return this.startValue_2 > this.endValue_2;
  }

  EndValueInfStartValue_1() : boolean {
    return this.endValue_1 < this.startValue_1;
  }

  EndValueInfStartValue_2() : boolean {
    return this.endValue_2 < this.startValue_2;
  }

  onStartValueChange_1(event: Event): void {
    const value = +(event.target as HTMLInputElement).value;

    // Prevent start thumb from going past the end thumb
    if (value <= this.endValue_1) {
      this.startValue_1 = value;

      this.plantForm.get("minHumidity")?.setValue(value);
  
      // Update the DOM element value if needed
      (event.target as HTMLInputElement).value = this.startValue_1.toString();
  
      this.emitRangeChange_1();
    }
  }

  onStartValueChange_2(event: Event): void {
    const value = +(event.target as HTMLInputElement).value;

    // Prevent start thumb from going past the end thumb
    if (value <= this.endValue_2) {
      this.startValue_2 = value;

      this.plantForm.get("minSoilMoisture")?.setValue(value);
  
      // Update the DOM element value if needed
      (event.target as HTMLInputElement).value = this.startValue_2.toString();
  
      this.emitRangeChange_2();
    }
  }

  onEndValueChange_1(event: Event): void {
    const value = +(event.target as HTMLInputElement).value;

    // Prevent end thumb from going below the start thumb
    if (value >= this.startValue_1) {
      this.endValue_1 = value;
      this.plantForm.get("maxHumidity")?.setValue(value);
      this.emitRangeChange_1();
    }
  }

  onEndValueChange_2(event: Event): void {
    const value = +(event.target as HTMLInputElement).value;

    // Prevent end thumb from going below the start thumb
    if (value >= this.startValue_2) {
      this.endValue_2 = value;
      this.plantForm.get("maxSoilMoisture")?.setValue(value);
      this.emitRangeChange_2();
    }
  }

  emitRangeChange_1(): void {
    this.rangeChange.emit({ start: this.startValue_1, end: this.endValue_1});
  }

  emitRangeChange_2(): void {
    this.rangeChange.emit({ start: this.startValue_2, end: this.endValue_2});
  }


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
      minHumidity : [0, []],
      maxHumidity: [100, []],
      Wind : ['', [Validators.required]],
      //maxWind : ['', [Validators.required, Validators.pattern(/^[1-9][0-9]*$/)]],
      minUVIndex : ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      maxUVIndex : ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      minLight : ['', [Validators.required, Validators.pattern(/^[1-9][0-9]*$/)]],
      maxLight : ['', [Validators.required, Validators.pattern(/^[1-9][0-9]*$/)]],
      minSoilMoisture : [0, []],
      maxSoilMoisture : [100, []],
      lastDateOfIrrigation : ['', []],
      lastDateOfFertilizer : ['', []],
      lastDateOfPesticide : ['', []],
      lastDateOfNutrients : ['', []],
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  onSubmit() : void {
    this.loading= true;
    console.log(this.plantForm);
  }

}
