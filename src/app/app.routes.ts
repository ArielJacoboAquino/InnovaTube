import { Routes } from '@angular/router';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { RecoverypasswordComponent } from './auth/recoverypassword/recoverypassword.component';
import { HomeComponent } from './home/home.component';
import { FavoritosComponent } from './home/favoritos/favoritos.component';
export const routes: Routes = [
  {path: 'login',  component:SignInComponent },
  {path: 'registro',  component:SignUpComponent },
  {path: 'recoverypassword',  component:RecoverypasswordComponent },
  {path: 'favoritos',  component:FavoritosComponent },
  {path: 'home',  component:HomeComponent },


];
