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

  filters: any = []

  reloadProducts(e: any) {
    let filterName = e.target.value.split('=')[0]
    let filterValue = e.target.value.split('=')[1]
    this.filters[filterName] = filterValue
    console.log(this.filters)
  }

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
      title: 'Succes!',
      text: product.name +  ' a fost adaugat in cos',
      icon: 'success',
      confirmButtonText: 'OK'
    })
  }

}
