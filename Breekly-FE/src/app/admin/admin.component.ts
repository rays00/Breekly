import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { EditProductDialogComponent } from '../edit-product-dialog/edit-product-dialog.component';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  displayedColumnsSubscriptions: string[] = ['id', 'product', 'qty', 'address', 'action'];
  displayedColumnsProducts: string[] = ['id', 'name', 'price', 'action'];
  displayedColumnsOrders: string[] = ['id', 'subscription', 'address', 'status', 'action', 'cancel-action'];
  ordersDataSource: any;
  subscriptionsDataSource: any;
  productsDataSource: any;

  constructor(private http: HttpClient, private dialog: MatDialog) { 
    this.status[0] = 'In asteptare'
    this.status[1] = 'In procesare'
    this.status[2] = 'In livrare'
    this.status[3] = 'Completa'
    this.status[4] = 'Anulata'
  }

  status: any = []
  
  ngOnInit(): void {
    this.getOrders()
    this.getSubscriptions()
    this.getProducts()
  }

  getSubscriptions() {
    this.http.get<any>('/api/subscriptions').subscribe(
      data => {
        this.subscriptionsDataSource = data
      }
    )
  }

  getProducts() {
    this.http.get<any>('/api/products').subscribe(
      data => {
        this.productsDataSource = data
      }
    )
  }

  getOrders() {
    this.http.get<any>('/api/orders').subscribe(
      data => {
        this.ordersDataSource = data
      }
    )
  }

  nextStatus(order: any) {
    let newStatusInteger = order.status + 1
    this.updateStatus(order, newStatusInteger)
  }

  updateStatus(order: any, newStatus: any) {
    if (order.status == 4) {
      Swal.fire(
        'Eroare!',
        'Comanda este anulata.',
        'error'
      )
    } else {
      Swal.fire({
        title: 'Esti sigur?',
        html: "Comanda va avea statusul:</br>" + this.status[newStatus],
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Da',
        cancelButtonText: 'Nu',
      }).then((result) => {
        if (result.isConfirmed) {
          this.http.put<any>('/api/orders', {orderId: order._id, status: newStatus}).subscribe(
            data => {
              Swal.fire(
                'Succes!',
                ':)',
                'success'
              )
              this.getOrders()
            }
          )
        }
      })
    }
  }

  cancelOrder(order: any) {
    if (order.status == 4 || order.status == 3) {
      Swal.fire(
        'Eroare!',
        'Comanda nu se poate anula.',
        'error'
      )
    } else {
      this.updateStatus(order, 4)
    } 
  }

  toggleSubscription(subscription: any, newAvailability: any) {
    this.http.put<any>('/api/subscriptions', {subscriptionId: subscription._id, newAvailability: newAvailability}).subscribe(
      data => {
        if (!newAvailability) {
          Swal.fire(
            'Succes!',
            'Subscriptia a fost anulata cu succes.',
            'success'
          )
        } else {
          Swal.fire(
            'Succes!',
            'Subscriptia a fost activata cu succes.',
            'success'
          )
        }
        this.getSubscriptions()
      }
    )
  }

  addNewProduct() {
    this.editProductDialog(null)
  }

  editProductDialog(product: any) {
    const dialogRef = this.dialog.open(EditProductDialogComponent, {
      data: {
       product: product
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getProducts()
    });
  }

}
