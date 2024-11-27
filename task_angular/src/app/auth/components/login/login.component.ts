import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StorageService } from '../../services/storage/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  
  loginForm!: FormGroup;
  hidePassword = true;

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private snackbar: MatSnackBar,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
    })
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit() {
    console.log(this.loginForm.value)
    this.authService.login(this.loginForm.value).subscribe((res) => {
      console.log(res)
      if (res.user_id != null) {
        const user = {
          id: res.user_id,
          role: res.user_role
        }
        StorageService.saveUser(user)
        StorageService.saveToken(res.token)
        
        if (StorageService.isAdminLoggedIn()) 
          this.router.navigateByUrl("/admin/dashboard");
        else if (StorageService.isEmployeeLoggedIn())
          this.router.navigateByUrl("/employee/dashboard");

        this.snackbar.open("Login successful", "Close", { duration: 5000});
      }     
    })
    this.snackbar.open("E-mail or Password is incorrect", "Close", { duration: 5000, panelClass: "error-snackbar"})
  }
}