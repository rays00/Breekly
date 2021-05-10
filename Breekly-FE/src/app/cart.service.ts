import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  items: any = []

  constructor() {
    this.loadItems()
  }

  loadItems() {
    let cartItems = localStorage.getItem('cart')
    if (cartItems) {
      this.items = JSON.parse(cartItems)
    }
  }

  addToCart(product: any) {
    var result = this.items.find((obj: { _id: string; }) => {
      return obj._id === product._id
    })

    if (result) {
      result.qty++
    } else {
      product.qty = 1
      this.items.push(product)
    }
    localStorage.setItem('cart', JSON.stringify(this.items))
  }

  getItems() {
    if (this.items.length) {
      return this.items
    }
    return null
  }

  clearCart() {
    this.items = [];
    localStorage.removeItem('cart')
    return this.items;
  }
}
