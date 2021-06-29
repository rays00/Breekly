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
        title: 'Succes!',
        text: 'Subscriptie adaugata!',
        icon: 'success',
        confirmButtonText: 'OK'
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
      title: 'Esti sigur?',
      text: "Articolul va fi sters.",
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Da!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.removeById(product._id)
        this.getItems()
      }
    })
  }

  clearCart() {
    Swal.fire({
      title: 'Esti sigur?',
      text: "Continutul cosului va fi sters.",
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Da!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.clearCart()
        this.getItems()
      }
    })
  }
}
