import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { CartService } from '../cart.service';
import { switchMap } from 'rxjs/operators';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  product: any

  constructor(private http: HttpClient, private route: ActivatedRoute, private cartService: CartService) { }

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id')
    this.http.get<any>("/api/products/" + productId).subscribe(
      data => {
        this.product = data
      }
    )
  }
  
  addToCart(product: any) {
    this.cartService.addToCart(product);
    Swal.fire({
      title: 'Success!',
      text: product.name +  ' was added to your cart',
      icon: 'success',
      confirmButtonText: 'Cool'
    })
  }

}
