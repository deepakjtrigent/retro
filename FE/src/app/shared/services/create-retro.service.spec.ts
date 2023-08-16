import { TestBed } from '@angular/core/testing';

import { CreateRetroService } from './create-retro.service';

describe('CreateRetroService', () => {
  let service: CreateRetroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateRetroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
