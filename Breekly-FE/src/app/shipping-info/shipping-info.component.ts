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
  selected = ''
  addressId: string = ""
  @Output() displayNextStep = new EventEmitter<boolean>();
  @Input() items: any
  addresses: any = []

  billingForm = new FormGroup ({
    street: new FormControl(''),
    number: new FormControl(''),
    details: new FormControl(''),
    city: new FormControl(''),
  });

  saveSubscription(addressId: any, element: any) {
    this.httpClient.post('api/subscriptions', {productId: element._id, period: 1, qty: element.qty, addressId:  addressId}).subscribe(
      data => {
        this.loader = false
        this.displayNextStep.emit(false)
      },
      error => {
        this.loader = false
        switch(error.status) {
          case 401: {
            Swal.fire({
              title: 'Eroare!',
              html:
              'Nu esti logat.',
              icon: 'error',
              confirmButtonText: 'OK'
            })
            break
          }
          case 500: {
            Swal.fire({
              title: 'Eroare!',
              html:
              'Subscriptia cu selectia curenta de produs-cantitate exista deja.',
              icon: 'error',
              confirmButtonText: 'OK'
            })
            break
          }
        }
      }
    )
  }

  onSubmit() {
    if (!this.selected) {
      Swal.fire({
        title: 'Eroare!',
        text: 'Te rugam selecteaza o adresa de livrare!',
        icon: 'error',
        confirmButtonText: 'OK'
      })
      return
    }
    this.loader = true
    this.items.forEach((element: any) => {
      if (this.selected === 'new') {
        this.httpClient.post<any>('api/addresses', {street: this.billingForm.value.street, number: this.billingForm.value.number,
          details: this.billingForm.value.details, city: this.billingForm.value.city}).subscribe(
         data => {
           this.addressId = data.address._id
           this.saveSubscription(this.addressId, element)
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
      } else {
        this.saveSubscription(this.selected, element)
      }
    });
  }

  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.httpClient.get<any>("api/addresses/mine").subscribe(
      data => this.addresses = data,
      error => console.log(error)
    )
  }

}
