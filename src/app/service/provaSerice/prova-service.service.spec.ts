import { TestBed } from '@angular/core/testing';

import { ProvaServiceService } from './prova-service.service';

describe('ProvaServiceService', () => {
  let service: ProvaServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProvaServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
