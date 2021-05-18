import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-edit-address-dialog',
  templateUrl: './edit-address-dialog.component.html',
  styleUrls: ['./edit-address-dialog.component.css']
})
export class EditAddressDialogComponent implements OnInit {

  editAddressForm = new FormGroup ({
    street: new FormControl(this.data.street),
    number: new FormControl(this.data.number),
    details: new FormControl(this.data.details),
    city: new FormControl(this.data.city),
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

}
