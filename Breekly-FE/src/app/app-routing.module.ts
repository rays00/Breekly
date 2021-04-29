import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RedirectComponent } from './redirect/redirect.component';  
import { LoginComponent } from './login/login.component';  
import {AuthGuard} from './auth.guard';

const routes: Routes = [
  { path: 'redirect', component: RedirectComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
