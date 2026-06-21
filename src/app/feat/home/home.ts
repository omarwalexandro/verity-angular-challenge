import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export default class Home {
  private router = inject(Router);

  protected start(): void {
    this.router.navigate(['/profile/new']);
  }
}
