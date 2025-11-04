import { TestBed } from '@angular/core/testing';

import { SPokemon } from './pokemon';

describe('SPokemon', () => {
  let service: SPokemon;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SPokemon);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
