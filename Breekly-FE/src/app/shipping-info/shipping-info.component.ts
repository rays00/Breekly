import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms'; 

@Component({
  selector: 'app-shipping-info',
  templateUrl: './shipping-info.component.html',
  styleUrls: ['./shipping-info.component.css']
})
export class ShippingInfoComponent implements OnInit {

  billingForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    street: new FormControl(''),
    phoneNumber: new FormControl(''),
  });

  onSubmit() {
    console.log(this.billingForm.value.firstName)
    console.log(this.billingForm.value.lastName)
    console.log(this.billingForm.value.street)
    console.log(this.billingForm.value.phoneNumber)
    console.log(this.items)
  }

  @Input() items: any

  constructor() { }

  ngOnInit(): void {
  }

}
