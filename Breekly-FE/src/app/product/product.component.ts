import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { CartService } from '../cart.service';
import { switchMap } from 'rxjs/operators';
import Swal from 'sweetalert2'
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  product: any
  productMedia: any = []
  mainMedia: any

  constructor(
    private http: HttpClient, 
    private route: ActivatedRoute, 
    private cartService: CartService,
    private storage: AngularFireStorage) { }

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id')
    let that = this
    this.http.get<any>("/api/products/" + productId).subscribe(
      data => {
        this.product = data
        data.media.forEach(function(item: any, index: any) {
          const ref = that.storage.ref(item)
          ref.getDownloadURL().subscribe(
            url => {
              if (url) {
                that.productMedia.push(url)
                if (!that.mainMedia) {
                  that.mainMedia = that.productMedia.pop()
                }
              }
            }
          )
        })
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
