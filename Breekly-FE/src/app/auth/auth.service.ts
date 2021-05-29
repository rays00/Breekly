import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  isAuthenticated() {
    return this.http.get('/api/users/validate-request');
  }

  isAdminAuthenticated() {
    return this.http.get('/api/users/validate-admin-request');
  }
}
