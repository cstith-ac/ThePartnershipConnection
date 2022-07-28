import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PermissionsService } from './permissions.service';
import { Spy } from 'jasmine-auto-spies';
 
describe('PermissionsService', () => {
  let service: PermissionsService;
  let httpSpy: Spy<HttpClient>;

  //let fake

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(PermissionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
