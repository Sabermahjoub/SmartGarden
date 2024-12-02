import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';
import { login } from 'src/app/models/login';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  loginForm! : FormGroup;
  hide : boolean = true;
  loading : boolean = false;

  constructor(
    private fb : FormBuilder,
    private loginService : LoginService,
    private snackBar: MatSnackBar,
    private router : Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required,Validators.pattern(/^[A-Za-z][A-Za-z0-9]*$/)  ]], 
      password: ['', [Validators.required, Validators.minLength(6)]],  // Password with min 6 characters
    });
  }

  onSubmit() {
    this.loading= true;
    if (this.loginForm.valid) {
      const logintoSend : login = {username : this.loginForm.value.username , password : this.loginForm.value.password };
      this.loginService.login(logintoSend).subscribe(result => {

        // An error occurred 
        if (result.error) {
          
          setTimeout(() => {
            const snackBarRef = this.snackBar.open(
              result.error?.error || 'An unexpected error occurred', // Dynamically use the error message
              'Close',
              {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: ['custom-red-style'],
              }
            );
            this.loading = false;
          }, 1000); // Dismiss after 1 second (1000 ms)


        }
  
        else {
          setTimeout(() => {
            this.snackBar.open(
              'You are successfully connected to the server !',
              'Close',
              {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: ['custom-style'],
              }
            );  
            localStorage.setItem('auth', 'authenticated');
            this.router.navigate(['/dashboard']);
            this.loading = false;
          }, 1000);

        }
      });
    } 
    else {
      console.log('Form is invalid');
    }

  }

}
