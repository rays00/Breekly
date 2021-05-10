import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  homeProducts: any

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<any>('api/products').subscribe(
      data => {
        this.homeProducts = data.slice(0, 3)
      }
    )
  }

}
