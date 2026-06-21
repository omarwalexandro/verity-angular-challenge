import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { jsPDF } from 'jspdf';
import { ProfileStore } from '../profile.store';

@Component({
  selector: 'app-review',
  templateUrl: './review.html',
  styleUrl: './review.css',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [],
})
export default class Review {
  private profileStore = inject(ProfileStore);

  profile = this.profileStore.profileModel;

  protected exportToPdf(): void {
    const data = this.profile();
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });

    const pageWidth = doc.internal.pageSize.getWidth();
    const marginX = 48;
    let y = 64;

    const primary: [number, number, number] = [37, 99, 235];
    const secondary: [number, number, number] = [71, 85, 105];
    const label: [number, number, number] = [107, 114, 128];
    const value: [number, number, number] = [31, 41, 55];

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(...primary);
    doc.text('Dados do Perfil', marginX, y);
    y += 28;

    const addSection = (title: string, rows: [string, string][]): void => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(...secondary);
      doc.text(title, marginX, y);
      y += 8;

      doc.setDrawColor(229, 231, 235);
      doc.line(marginX, y, pageWidth - marginX, y);
      y += 18;

      for (const [key, val] of rows) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(...label);
        doc.text(key, marginX, y);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(...value);
        doc.text(val || '-', marginX, y + 14);
        y += 34;
      }
      y += 12;
    };

    addSection('Dados Pessoais', [
      ['Nome Completo', data.personal.fullName],
      ['Data de Nascimento', data.personal.birthDate],
      ['CPF', data.personal.cpf],
      ['Telefone', data.personal.phone],
      ['E-mail', data.personal.email],
    ]);

    addSection('Dados Residenciais', [
      ['CEP', data.residential.zipCode],
      ['Endereço', data.residential.address],
      ['Bairro', data.residential.district ?? ''],
      ['Cidade', data.residential.city],
      ['Estado', data.residential.state],
    ]);

    addSection('Dados Profissionais', [
      ['Profissão', data.professional.profession],
      ['Empresa', data.professional.company],
      ['Salário', data.professional.salary],
    ]);

    const fileName = data.personal.fullName
      ? `perfil-${data.personal.fullName.trim().toLowerCase().replace(/\s+/g, '-')}.pdf`
      : 'perfil.pdf';
    doc.save(fileName);
  }
}
