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

  registerForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
    lastName: new FormControl(''),
    firstName: new FormControl(''),
  });

  showLogin = false;
  constructor(private http: HttpClient, private router: Router) { }

  loginOnSubmit() {
    this.http.post<any>("/api/users/login", {email: this.loginForm.value.email, password: this.loginForm.value.password}).subscribe(
      data => {
        this.router.navigateByUrl('/account')
        localStorage.setItem("AUTH", data.token)
      },
      err => {
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

  toggleForms() {
    this.showLogin = !this.showLogin
  }

}
