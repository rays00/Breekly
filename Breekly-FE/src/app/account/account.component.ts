import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2'
import { EditAddressDialogComponent } from '../edit-address-dialog/edit-address-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ManageSubscriptionsDialogComponent } from '../manage-subscriptions-dialog/manage-subscriptions-dialog.component';


@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  userData: any;

  subscriptions: any;
  addresses: any;
  orders: any;

  mainAddress: any;
  showAddresses: any;

  constructor(private http: HttpClient, private router: Router, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.http.get<any>("/api/users/user-data").subscribe(
      data => {
        this.userData = data.userData
      }
    )
    
    this.getMySubscriptions()
    this.getMyAddresses()
    this.getMyOrders()
  }

  getMyOrders() {
    const status: any = []
    status[0] = 'Pending'
    status[1] = 'Processing'
    status[2] = 'Shipped'
    status[3] = 'Complete'

    this.http.get<any>("/api/orders/mine").subscribe(
      data => {
        data.forEach((element: { status: string; }) => {
          element.status = status[element.status]
        });
        this.orders = data
      }
    )
  }

  getMySubscriptions() {
    this.http.get<any>("/api/subscriptions/mine").subscribe(
      data => {
        this.subscriptions = data
      }
    )
  }

  getMyAddresses() {
    this.http.get<any>("api/addresses/mine").subscribe(
      data => {
        let addresses: { userId: any; }[] = []
        data.forEach((element: { userId: any; }) => {
          if (element.userId == this.userData.userId) {
            addresses.push(element)
          }
        });
        this.addresses = addresses
        this.mainAddress = addresses[1]
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

  toggleShowAddresses(): void {
    this.showAddresses = !this.showAddresses
  }

  toggleManageSubscriptions() {
    const dialogRef = this.dialog.open(ManageSubscriptionsDialogComponent, {
      data: {
        subscriptions: this.subscriptions
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getMySubscriptions()
    })
  }

  editAddressDialog(address: any) {
    const dialogRef = this.dialog.open(EditAddressDialogComponent, {
      data: {
        addressId: address._id,
        street: address.street,
        number: address.number,
        details: address.details,
        city: address.city
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.value) {
        const path = "/api/addresses/" + address._id
        this.http.put<any>(path, {
          street: result.value.street,
          number: result.value.number,
          details: result.value.details,
          city: result.value.city
        }).subscribe(
          data => {
            this.getMyAddresses()
          },
          err => {
            Swal.fire({
              title: 'Error!',
              text: '!!!',
              icon: 'error',
              confirmButtonText: 'OK'
            })
          }
        )
      }
    });
  }

}
