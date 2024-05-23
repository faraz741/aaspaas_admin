import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MainService } from 'src/app/services/main.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  isPasswordVisible: boolean = false;
  loginForm!: FormGroup
  loading: boolean = false;


  constructor(private route: Router, private srevice: MainService) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    })
  }

  loginAndFetchData() {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.valid) {
      this.loading = true;
      const formURlData = new URLSearchParams();
      formURlData.set('email', this.loginForm.value.email);
      formURlData.set('password', this.loginForm.value.password);
      this.srevice.postAPI('loginAdmin',formURlData.toString()).subscribe({
        next: (resp) => {
          if (resp.success == true) {
            this.route.navigateByUrl("/main/dashboard");
            localStorage.setItem('userDetail', JSON.stringify(resp.user_info));
            this.srevice.setToken(resp.token);
            //this.toastr.success(resp.message);
            this.loading = false;
          } else {
            //this.toastr.warning(resp.message);
            this.loading = false;
          }
        },
        error: (error) => {
          this.loading = false;
          //this.toastr.warning('Something went wrong.');
          console.error('Login error:', error.message);
        }
      });
    }
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

}
