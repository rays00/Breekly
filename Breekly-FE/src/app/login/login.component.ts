import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms'; 
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  resetPasswordForm = new FormGroup({
    email: new FormControl(''),
    code: new FormControl(''),
    newPassword: new FormControl('')
  });

  registerForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
    lastName: new FormControl(''),
    firstName: new FormControl(''),
  });

  showLogin = true;
  showRegister = false;
  showResetPassword = false;

  resetPasswordEmailSent = false

  constructor(private http: HttpClient, private router: Router) { }

  resetPasswordOnSubmit() {
    let email = this.resetPasswordForm.value.email
    if (!this.resetPasswordForm.value.code) {
      this.http.post<any>('/api/users/reset', {email: email}).subscribe(
        data => {
          this.resetPasswordEmailSent = true
          Swal.fire({
            title: 'Trimis!',
            text: 'Emailul cu codul pentru resetarea parolei a fost trimis.',
            icon: 'success',
            confirmButtonText: 'OK'
          })
        },
        err => {
          Swal.fire({
            title: 'Eroare!',
            text: 'Nu am gasit un cont asociat cu acest email.',
            icon: 'error',
            confirmButtonText: 'OK'
          })
        }
      )
    } else {
      let newPassword = this.resetPasswordForm.value.newPassword
      let code = this.resetPasswordForm.value.code
      let classInstance = this
      this.http.get<any>('/api/users').subscribe(
        data => {
          console.log(data)
          data.forEach(function(item: any, index: any) {
            if (item.email == email) {
              if (item.resetPasswordCode == code) {
                classInstance.http.put<any>('/api/users', {email: email, password: newPassword}).subscribe(
                  data => {
                    Swal.fire({
                      title: 'Salvat!',
                      text: 'Parola a fost actualizata cu succes',
                      icon: 'success',
                      confirmButtonText: 'OK'
                    })
                  },
                  err => {
                    Swal.fire({
                      title: 'Eroare!',
                      text: 'A intervenit o eroare.',
                      icon: 'error',
                      confirmButtonText: 'OK'
                    })
                  }
                )
              }
              return
            }
          })
        }
      )
    }
  }

  loginOnSubmit() {
    this.http.post<any>("/api/users/login", {email: this.loginForm.value.email, password: this.loginForm.value.password}).subscribe(
      data => {
        this.router.navigateByUrl('/account')
        localStorage.setItem("AUTH", data.token)
      },
      err => {
        this.toggleForms(true, false, false)
        Swal.fire({
          title: 'Error!',
          text: 'Wrong username or password',
          icon: 'error',
          confirmButtonText: 'OK'
        })
      }
    )
  }

  registerOnSubmit() {
    this.http.post<any>("/api/users", {
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      lastName: this.registerForm.value.lastName,
      firstName: this.registerForm.value.firstName,
      isAdmin: false
    }).subscribe(
      data => {
        this.router.navigateByUrl('/account')
        localStorage.setItem("AUTH", data.token)
      },
      err => {
        if (err.status === 409) {
          Swal.fire({
            title: 'Eroare!',
            text: 'Se pare ca exista un cont cu aceasta adresa de email.',
            icon: 'error',
            confirmButtonText: 'OK'
          })
        } else {
          Swal.fire({
            title: 'Eroare!',
            text: 'Verifica datele si incearca din nou!',
            icon: 'error',
            confirmButtonText: 'OK'
          })
        }
      }
    )
  }

  ngOnInit(): void {
  }

  toggleForms(showLoginForm: any, showRegisterForm: any, showResetPasswordForm: any) {
    this.showLogin = showLoginForm
    this.showRegister = showRegisterForm
    this.showResetPassword = showResetPasswordForm
  }
}
