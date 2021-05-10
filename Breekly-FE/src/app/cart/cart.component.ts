import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service'
import Swal from 'sweetalert2'

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  items: any = []
  nextStep: boolean = false

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.getItems()
  }

  toggleShippingInfo() {
    this.nextStep = !this.nextStep
  }

  getItems() {
    this.items = this.cartService.getItems()
  }

  clearCart() {
    Swal.fire({
      title: 'Are you sure?',
      text: "Your cart content will be removed",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.clearCart()
        this.getItems()
      }
    })
  }
}
