import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { ElementRef } from '@angular/core';
import { ViewportScrollService } from './viewport-scroll.service';

describe('ViewportScrollService', () => {
  let service: ViewportScrollService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ViewportScrollService]
    });
    service = TestBed.inject(ViewportScrollService);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.classList.remove('overflow-hidden');
  });

  it('debe crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debe ejecutar window.scrollTo al llamar a scrollToTop()', () => {
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    service.scrollToTop(true);
    expect(scrollToSpy).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  });

  it('debe ejecutar scrollToTop con behavior instant cuando smooth es false', () => {
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    service.scrollToTop(false);
    expect(scrollToSpy).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  });

  it('debe resetear scrollTop del contenedor con resetContainerScroll()', () => {
    const fakeDiv = document.createElement('div');
    fakeDiv.scrollTop = 350;
    service.resetContainerScroll(fakeDiv);
    expect(fakeDiv.scrollTop).toBe(0);

    const elRef = new ElementRef(document.createElement('div'));
    elRef.nativeElement.scrollTop = 500;
    service.resetContainerScroll(elRef);
    expect(elRef.nativeElement.scrollTop).toBe(0);
  });

  it('debe bloquear y desbloquear el scroll del body con setBodyScrollLocked()', () => {
    service.setBodyScrollLocked(true);
    expect(document.body.classList.contains('overflow-hidden')).toBe(true);

    service.setBodyScrollLocked(false);
    expect(document.body.classList.contains('overflow-hidden')).toBe(false);
  });

  it('debe invocar scrollIntoView si el elemento lo soporta', () => {
    const fakeEl = document.createElement('div');
    fakeEl.scrollIntoView = vi.fn();
    service.scrollIntoView(fakeEl, true);
    expect(fakeEl.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start'
    });
  });
});
