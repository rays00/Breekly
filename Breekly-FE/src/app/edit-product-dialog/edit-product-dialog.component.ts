import { Component, OnInit, ViewChild } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2'
import { MatDialog } from '@angular/material/dialog';
import { AngularFireStorage } from '@angular/fire/storage';
import { MatSelectionList } from '@angular/material/list'
import { MatListOption } from '@angular/material/list'

@Component({
  selector: 'app-edit-product-dialog',
  templateUrl: './edit-product-dialog.component.html',
  styleUrls: ['./edit-product-dialog.component.css']
})
export class EditProductDialogComponent implements OnInit {

  files: any = []
  currentMedia: any = []

  @ViewChild('media') selectionList!: MatSelectionList

  editProductForm = new FormGroup ({
    name: this.data.product ? new FormControl(this.data.product.name) : new FormControl(''),
    description: this.data.product ? new FormControl(this.data.product.description) : new FormControl(''),
    price: this.data.product ? new FormControl(this.data.product.price) : new FormControl(''),
    availability: this.data.product ? new FormControl(this.data.product.availability) : new FormControl(''),
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private http: HttpClient, private dialog: MatDialog, private storage: AngularFireStorage) {
  }

  loadCurrentMedia() {
    let that = this
    this.data.product.media.forEach(function(item: any, index: any) {
      const ref = that.storage.ref(item)
      ref.getDownloadURL().subscribe(
        url => {
          if (url) {
            that.currentMedia[item] = url
          }
        }
      )
    })
  }

  ngOnInit(): void {
    if (this.data.product) {
      this.loadCurrentMedia()
    }
  }

  saveProduct(product: any) {
    let media: any = []
    if (product) {
      media = this.data.product.media
    }

    if (this.files) {
      let that = this
      this.files.forEach(function(item: any, index: any) {
        media.push(item.name)
        const ref = that.storage.ref(item.name)
        const task = ref.put(item)
      })
    }
    if (product) {
      this.http.put<any>('/api/products/' + product._id, 
      { name: this.editProductForm.value.name, 
        description: this.editProductForm.value.description, 
        price: this.editProductForm.value.price,
         availability: this.editProductForm.value.availability,
          media: media }).subscribe(
        data => {
          Swal.fire(
            'Succes!',
            'Produsul a fost actualizat cu succes.',
            'success'
          )
        },
        error => {
          Swal.fire(
            'Eroare!',
            'Produsul nu a fost actualizat. Verificati campurile.',
            'error'
          )
        }
      )
    } else {
      this.http.post<any>('/api/products/', 
      { name: this.editProductForm.value.name, 
        description: this.editProductForm.value.description, 
        price: this.editProductForm.value.price,
         availability: this.editProductForm.value.availability,
          media: media }).subscribe(
        data => {
          Swal.fire(
            'Succes!',
            'Produsul a fost salvat cu succes.',
            'success'
          )
        },
        error => {
          Swal.fire(
            'Eroare!',
            'Produsul nu a fost salvat. Verificati campurile.',
            'error'
          )
        }
      )
    }

  }

  onChange(options: MatListOption[]) {
    let leftImages: any = []
    options.map(option => {
      let value = option.value
      leftImages.push(value)
    })
    this.data.product.media = leftImages
    this.loadCurrentMedia()
  }

  onFileSelected(event: any) {
    const files = event.target.files
    if (files) {
      for (let i = 0; i < files.length; i++) {
        this.files.push(files[i])
      }
    }
  }
}
