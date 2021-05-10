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
  total: any
  nextStep: boolean = false

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.getItems()
  }

  getNextStep(nextStep: boolean) {
    this.nextStep = nextStep;
    if (this.nextStep === false) {
      Swal.fire({
        title: 'Success!',
        text: 'Subscription added!',
        icon: 'success',
        confirmButtonText: 'Cool'
      })
      this.cartService.clearCart()
      this.getItems()
    }
  }

  toggleShippingInfo() {
    this.nextStep = !this.nextStep
  }

  getItems() {
    this.items = this.cartService.getItems()
    if (this.items) {
      this.total = 0
      this.items.forEach((element: { qty: number; price: number; }) => {
        this.total += Number(element.qty * element.price)
      });
    }
  }

  increaseQuantity(product: any) {
    this.cartService.increaseQty(product._id)
    this.getItems()
  }

  decreaseQuantity(product: any) {
    this.cartService.decreaseQty(product._id)
    this.getItems()
  }

  removeItem(product: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "This item will be removed",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.removeById(product._id)
        this.getItems()
      }
    })
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
