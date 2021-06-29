import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-manage-subscriptions-dialog',
  templateUrl: './manage-subscriptions-dialog.component.html',
  styleUrls: ['./manage-subscriptions-dialog.component.css']
})
export class ManageSubscriptionsDialogComponent implements OnInit {

  constructor(private http: HttpClient, @Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialog) { }

  ngOnInit(): void {

  }

  removeSubscription(id: any): any {
    Swal.fire({
      title: 'Esti sigur?',
      text: 'Actiunea nu poate fi anulata',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Nu',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Da!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete<any>('api/subscriptions/' + id).subscribe(
          data => {
            this.dialog.closeAll()
            Swal.fire({
              title: 'Success!',
              text: 'You removed your subscription!',
              icon: 'success',
              confirmButtonText: 'OK'
            })
          }
        )
      }
    })
  }
}
