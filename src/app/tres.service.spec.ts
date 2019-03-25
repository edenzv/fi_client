import { TestBed } from '@angular/core/testing';

import { TresService } from './tres.service';

describe('TresService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TresService = TestBed.get(TresService);
    expect(service).toBeTruthy();
  });
});
