import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  userData: any;
  subscriptions: any;
  addresses: any;
  mainAddress: any;

  constructor(private http: HttpClient, private router: Router) { 
  }

  ngOnInit(): void {
    this.http.get<any>("/api/users/user-data").subscribe(
      data => {
        this.userData = data.userData
      }
    )
    this.http.get<any>("/api/subscriptions").subscribe(
      data => {
        let subscriptions: { userId: any; }[] = []
        data.forEach((element: { userId: any; }) => {
          if (element.userId == this.userData.userId) {
            subscriptions.push(element)
          }
        })
        this.subscriptions = subscriptions.length
      }
    )
    this.http.get<any>("/api/addresses").subscribe(
      data => {
        let addresses: { userId: any; }[] = []
        data.forEach((element: { userId: any; }) => {
          if (element.userId == this.userData.userId) {
            addresses.push(element)
          }  
        });
        this.addresses = addresses
        this.mainAddress = addresses.shift()
      }
    )
  }

  logout() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You will not be able to manage subscriptions anymore",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigateByUrl('')
        localStorage.setItem("AUTH", "")
        Swal.fire(
          'Log out!',
          'You were disconnected.',
          'success'
        )
      }
    })
  }

}
