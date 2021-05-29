import { TestBed } from '@angular/core/testing';

import { SupaService } from './supa.service';

describe('SupaService', () => {
  let service: SupaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
