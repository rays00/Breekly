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
  displayedColumnsOrders: string[] = ['id', 'product', 'qty', 'address', 'status', 'action', 'cancel-action'];
  ordersDataSource: any;
  subscriptionsDataSource: any;
  productsDataSource: any;

  constructor(private http: HttpClient, private dialog: MatDialog) { 
    this.status[0] = 'Pending'
    this.status[1] = 'Processing'
    this.status[2] = 'Shipping'
    this.status[3] = 'Complete'
    this.status[4] = 'Canceled'
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
    Swal.fire({
      title: 'Are you sure?',
      html: "This order will have this status:</br>" + this.status[newStatus],
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!'
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

  editProductDialog(product: any) {
    const dialogRef = this.dialog.open(EditProductDialogComponent, {
      data: {
       product: product
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.put<any>('/api/products/' + product._id, 
          { name: result.value.name, description: result.value.description, price: result.value.price, availability: result.value.availability }).subscribe(
            data => {
              Swal.fire(
                'Succes!',
                'Produsul a fost actualizat cu succes.',
                'success'
              )
              this.getProducts()
            },
            error => {
              Swal.fire(
                'Eroare!',
                'Produsul nu a fost actualizat. Verificati campurile.',
                'error'
              )
            }
          )
      }
    });
  }

}
