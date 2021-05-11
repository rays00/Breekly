import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms'; 
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-shipping-info',
  templateUrl: './shipping-info.component.html',
  styleUrls: ['./shipping-info.component.css']
})
export class ShippingInfoComponent implements OnInit {

  loader = false
  addressId: string = ""
  @Output() displayNextStep = new EventEmitter<boolean>();
  @Input() items: any

  billingForm = new FormGroup({
    street: new FormControl(''),
    number: new FormControl(''),
    details: new FormControl(''),
    city: new FormControl(''),
  });

  onSubmit() {
    this.loader = true
    this.items.forEach((element: any) => {
        this.httpClient.post<any>('api/addresses', {street: this.billingForm.value.street, number: this.billingForm.value.number,
           details: this.billingForm.value.details, city: this.billingForm.value.city}).subscribe(
          data => {
            this.addressId = data.address._id
            this.httpClient.post('api/subscriptions', {productId: element._id, period: 1, qty: element.qty, addressId:  this.addressId}).subscribe(
              data => {
                this.loader = false
                this.displayNextStep.emit(false)
              },
              error => {
                this.loader = false
                Swal.fire({
                  title: 'We\'re sorry!',
                  text: 'It seems that you already have an active subscription with the same items. Go to your account to check it.',
                  icon: 'error',
                  confirmButtonText: 'OK'
                })
              }
            )
          },
          error => {
            if (error.status == 401) {
              Swal.fire({
                title: 'We\'re sorry!',
                text: 'You are not logged in!',
                icon: 'error',
                confirmButtonText: 'OK'
              })
            } else {
              if (error.status == 500) {
                Swal.fire({
                  title: 'We\'re sorry!',
                  text: 'You didn\'t complete all the required fields.',
                  icon: 'error',
                  confirmButtonText: 'OK'
                })
              }
            }

            this.loader = false
          }
        )
    });
  }

  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
  }

}
