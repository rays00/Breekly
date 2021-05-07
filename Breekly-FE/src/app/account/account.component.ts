import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  userData: any;

  constructor(private http: HttpClient, private router: Router) { 
  }

  ngOnInit(): void {
        this.http.get<any>("/api/users/user-data").subscribe(
      data => {
        this.userData = data.userData
      }
    )
  }

  logout(){
    this.router.navigateByUrl('')
    localStorage.setItem("AUTH", "")
  }

}
