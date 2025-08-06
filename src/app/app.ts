import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    Button
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('ai-hackathon-samarkand-2025-sqb_digital_fe');
}

