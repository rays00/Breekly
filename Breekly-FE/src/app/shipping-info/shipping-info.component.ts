import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms'; 
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-shipping-info',
  templateUrl: './shipping-info.component.html',
  styleUrls: ['./shipping-info.component.css']
})
export class ShippingInfoComponent implements OnInit {

  loader = false
  @Output() displayNextStep = new EventEmitter<boolean>();
  @Input() items: any

  billingForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    street: new FormControl(''),
    phoneNumber: new FormControl(''),
  });

  onSubmit() {
    this.loader = true
    this.items.forEach((element: any) => {
      this.httpClient.post('api/subscriptions', {productId: element._id, period: 1, qty: element.qty}).subscribe(
        data => {
          this.loader = false
          this.displayNextStep.emit(false)
        },
        error => console.log(error)
      )
    });
  }

  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
  }

}
