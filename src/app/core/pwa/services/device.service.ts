import { Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent, map, startWith } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private screenSize = new BehaviorSubject<string>('mobile');
  public screenSize$ = this.screenSize.asObservable();

  private orientation = new BehaviorSubject<string>('portrait');
  public orientation$ = this.orientation.asObservable();

  constructor() {
    this.initializeScreenSize();
    this.initializeOrientation();
  }

  private initializeScreenSize(): void {
    fromEvent(window, 'resize')
      .pipe(
        startWith(null),
        map(() => this.getScreenSize())
      )
      .subscribe(size => this.screenSize.next(size));
  }

  private initializeOrientation(): void {
    fromEvent(window, 'orientationchange')
      .pipe(
        startWith(null),
        map(() => window.innerWidth > window.innerHeight ? 'landscape' : 'portrait')
      )
      .subscribe(orientation => this.orientation.next(orientation));
  }

  private getScreenSize(): string {
    const width = window.innerWidth;
    if (width < 640) return 'mobile';
    if (width < 768) return 'tablet';
    if (width < 1024) return 'laptop';
    return 'desktop';
  }

  public isMobile(): boolean {
    return this.screenSize.value === 'mobile';
  }

  public isTablet(): boolean {
    return this.screenSize.value === 'tablet';
  }

  public isTouchDevice(): boolean {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }
}
