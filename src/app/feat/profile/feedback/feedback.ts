import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.html',
  styleUrl: './feedback.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export default class Feedback {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isSuccess: boolean;
  message: string;

  constructor() {
    const success = this.route.snapshot.queryParamMap.get('success');
    const message = this.route.snapshot.queryParamMap.get('message');
    
    this.isSuccess = success === 'true';
    this.message = message ?? (this.isSuccess ? 'Perfil salvo com sucesso!' : 'Erro ao salvar perfil. Tente novamente.');
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}
