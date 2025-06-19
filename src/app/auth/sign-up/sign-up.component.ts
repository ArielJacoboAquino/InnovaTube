import { Component } from '@angular/core';
import { RecaptchaModule } from 'ng-recaptcha';
@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [RecaptchaModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  resolved(token:any){
    console.log(token);

  }
}
