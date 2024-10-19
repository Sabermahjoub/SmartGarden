import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  loginForm! : FormGroup;
  hide : boolean = true;
  loading : boolean = false;

  constructor(private fb : FormBuilder) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      serverAddress: ['', [Validators.required,Validators.pattern(/^(https?:\/\/)?([a-zA-Z0-9-_]+\.[a-zA-Z]{2,})(:\d+)?(\/[^\s]*)?$/)  ]], 
      serverPassword: ['', [Validators.required, Validators.minLength(6)]],  // Password with min 6 characters
    });
  }

  onSubmit() {
    this.loading= true;
    if (this.loginForm.valid) {
      // Handle successful form submission
      console.log(this.loginForm.value);
    } else {
      // Handle validation errors
      console.log('Form is invalid');
    }
  }

}
