import { Injectable, ElementRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ViewportScrollService {
  /**
   * Resetea el scroll de la ventana principal y del documento al tope inmediato o suave.
   */
  scrollToTop(smooth: boolean = true): void {
    if (typeof window !== 'undefined') {
      try {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: smooth ? 'smooth' : 'instant'
        });
      } catch {
        window.scrollTo(0, 0);
      }

      if (typeof document !== 'undefined') {
        if (document.documentElement) document.documentElement.scrollTop = 0;
        if (document.body) document.body.scrollTop = 0;
      }
    }
  }

  /**
   * Ejecuta scrollIntoView sobre un elemento objetivo o selector para enfocar la cabecera o wrapper del panel.
   */
  scrollIntoView(target: HTMLElement | ElementRef | string | null | undefined, smooth: boolean = true): void {
    if (typeof window === 'undefined') return;

    let element: HTMLElement | null = null;
    if (typeof target === 'string') {
      element = document.querySelector(target) as HTMLElement;
    } else if (target instanceof ElementRef) {
      element = target.nativeElement;
    } else if (target instanceof HTMLElement) {
      element = target;
    }

    if (element && typeof element.scrollIntoView === 'function') {
      try {
        element.scrollIntoView({
          behavior: smooth ? 'smooth' : 'instant',
          block: 'start'
        });
      } catch {
        element.scrollIntoView();
      }
    }
  }

  /**
   * Resetea el scroll interno de contenedores con overflow (formularios, listados de paneles).
   */
  resetContainerScroll(container: HTMLElement | ElementRef | null | undefined): void {
    if (!container) return;
    const el = container instanceof ElementRef ? container.nativeElement : container;
    if (el) {
      el.scrollTop = 0;
    }
  }

  /**
   * Bloquea o desbloquea el scroll del fondo del body mientras un modal o panel se encuentre abierto.
   */
  setBodyScrollLocked(locked: boolean): void {
    if (typeof document !== 'undefined' && document.body) {
      if (locked) {
        document.body.classList.add('overflow-hidden');
      } else {
        document.body.classList.remove('overflow-hidden');
      }
    }
  }
}
