import {
  Directive,
  ElementRef,
  Input,
  OnInit,
  OnDestroy,
  Renderer2,
  inject,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appScrollReveal]',
  standalone: true
})
export class ScrollRevealDirective implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly platformId = inject(PLATFORM_ID);

  @Input('revealDelay') delay = 0;

  private observer?: IntersectionObserver;

  ngOnInit(): void {
    const nativeEl = this.el.nativeElement as HTMLElement;

    // Set initial unrevealed styles
    this.renderer.addClass(nativeEl, 'scroll-reveal-item');
    if (this.delay > 0) {
      this.renderer.setStyle(nativeEl, 'transition-delay', `${this.delay}ms`);
    }

    if (!isPlatformBrowser(this.platformId) || typeof IntersectionObserver === 'undefined') {
      // Fallback for SSR or environments without IntersectionObserver
      this.renderer.addClass(nativeEl, 'is-revealed');
      return;
    }

    // Check if element is already in the visible viewport on init
    const rect = nativeEl.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      // Delay slightly for initial stagger appearance
      setTimeout(() => {
        this.renderer.addClass(nativeEl, 'is-revealed');
      }, Math.min(this.delay, 300));
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.renderer.addClass(nativeEl, 'is-revealed');
            this.observer?.unobserve(nativeEl);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.18
      }
    );

    this.observer.observe(nativeEl);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}

