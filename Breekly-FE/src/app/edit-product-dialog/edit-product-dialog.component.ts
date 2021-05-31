import { Component, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-product-dialog',
  templateUrl: './edit-product-dialog.component.html',
  styleUrls: ['./edit-product-dialog.component.css']
})
export class EditProductDialogComponent implements OnInit {

  files: any = []

  editProductForm = new FormGroup ({
    name: new FormControl(this.data.product ? this.data.product.name : null),
    description: new FormControl(this.data.product ? this.data.product.description : null),
    price: new FormControl(this.data.product ? this.data.product.price : null),
    availability: new FormControl(this.data.product ? this.data.product.availability : null),
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialog) {
  }

  ngOnInit(): void {
  }

  handleMediaFiles(event: any) {
    this.files = event.target.files
  }

}
