import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-recoverypassword',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recoverypassword.component.html',
  styleUrl: './recoverypassword.component.css'
})
export class RecoverypasswordComponent {
  validation: boolean = true;
}
