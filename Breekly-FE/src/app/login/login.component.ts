import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms'; 
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

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

  constructor(private http: HttpClient, private router: Router) { }

  onSubmit() {
    this.http.post<any>("/api/users/login", {email: this.loginForm.value.email, password: this.loginForm.value.password}).subscribe(
      data => {
        this.router.navigateByUrl('/account')
        localStorage.setItem("AUTH", data.token)
      },
      err => {
      }
    )
  }

  ngOnInit(): void {
  }

}
