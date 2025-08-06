import { inject, Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PWAService {
  private readonly swUpdate = inject(SwUpdate);

  private isOnline = new BehaviorSubject<boolean>(navigator.onLine);
  public isOnline$ = this.isOnline.asObservable();

  private installPromptEvent: any;
  private canInstall = new BehaviorSubject<boolean>(false);
  public canInstall$ = this.canInstall.asObservable();

  constructor() {
    this.initializeNetworkStatus();
    this.initializeInstallPrompt();
    this.checkForUpdates();
  }

  private initializeNetworkStatus(): void {
    window.addEventListener('online', () => this.isOnline.next(true));
    window.addEventListener('offline', () => this.isOnline.next(false));
  }

  private initializeInstallPrompt(): void {
    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      this.installPromptEvent = event;
      this.canInstall.next(true);
    });
  }

  public async installApp(): Promise<void> {
    if (this.installPromptEvent) {
      this.installPromptEvent.prompt();
      const result = await this.installPromptEvent.userChoice;
      if (result.outcome === 'accepted') {
        this.canInstall.next(false);
      }
    }
  }

  private checkForUpdates(): void {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates.subscribe(() => {
        if (confirm('New version available. Load new version?')) {
          window.location.reload();
        }
      });
    }
  }
}
