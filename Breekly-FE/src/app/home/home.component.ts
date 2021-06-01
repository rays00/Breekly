import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms'; 
import { ViewportScroller } from '@angular/common';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  homeProducts: any

  allFrontProducts: any

  productMedia: any = []

  noSearchResults = false

  searchForm = new FormGroup({
    searchInput: new FormControl('')
  });

  constructor(private http: HttpClient, private viewportScroller: ViewportScroller, private storage: AngularFireStorage) { }

  search() {
    this.noSearchResults = false
    let searchedValue = this.searchForm.value.searchInput
    this.homeProducts = this.allFrontProducts.filter((product: any) => {
      return product.name.toLowerCase().includes(searchedValue.toLowerCase())
    })
    if (!this.homeProducts.length) {
      this.noSearchResults = true
    }
    this.viewportScroller.scrollToAnchor("products")
  }

  ngOnInit(): void {
    this.http.get<any>('api/products').subscribe(
      data => {
        this.allFrontProducts = data.slice(0, 4)
        this.homeProducts = this.allFrontProducts
        let that = this
        this.allFrontProducts.forEach(function(product: any, index: any) {
          product.media.forEach(function(item: any, index: any) {
            const ref = that.storage.ref(item)
            ref.getDownloadURL().subscribe(
              url => {
                if (url) {
                  that.productMedia[product._id] = url
                }
              }
            )
            return
          })
        })
      }
    )
  } 
}
