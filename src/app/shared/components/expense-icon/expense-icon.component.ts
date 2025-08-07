import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, effect, inject,input, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-expense-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="w-8 h-8 flex items-center justify-center transition-colors duration-200"
      [innerHTML]="sanitizedSvg()">
    </div>
  `
})
export class ExpenseIconComponent {
  public iconName = input.required<string>();
  public isSelected = input<boolean>(false);

  public sanitizedSvg = signal<SafeHtml>('');

  private http = inject(HttpClient);
  private sanitizer = inject(DomSanitizer);

  constructor() {
    effect(() => {
      this.loadSvg();
    });
  }

  private async loadSvg(): Promise<void> {
    try {
      const iconPath = `/images/expense-categories/${this.iconName()}`;
      const svgContent = await firstValueFrom(
        this.http.get(iconPath, { responseType: 'text' })
      );

      if (svgContent) {
        // Simply resize the icons - they already use currentColor
        const modifiedSvg = svgContent
          .replace(/width="24"/g, 'width="32"')
          .replace(/height="24"/g, 'height="32"');

        this.sanitizedSvg.set(this.sanitizer.bypassSecurityTrustHtml(modifiedSvg));
      }
    } catch (error) {
      console.error(`Error loading SVG icon: ${this.iconName()}`, error);
      // Fallback to a simple placeholder
      const fallbackSvg = `
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
          <text x="12" y="16" text-anchor="middle" fill="currentColor" font-size="12">?</text>
        </svg>
      `;
      this.sanitizedSvg.set(this.sanitizer.bypassSecurityTrustHtml(fallbackSvg));
    }
  }
}
