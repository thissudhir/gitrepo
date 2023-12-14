import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { Profile } from '../models/profile';
import { Repository } from '../models/repository';
import { HttpErrorResponse } from '@angular/common/http';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get user data', () => {
    const mockUserData: Profile = { 
      name : "John Papa",
      avatar_url : "https://avatars.githubusercontent.com/u/1202528?v=4",
      bio : "Winter is Coming",
      location : "Orlando, FL",
      public_repos : 143,
      login : "johnpapa",
      html_url : "https://github.com/johnpapa"
     };
    const githubUsername = 'johnpapa';

    service.getUser(githubUsername).subscribe((userData) => {
      expect(userData).toEqual(mockUserData);
    });

    const req = httpMock.expectOne(`https://api.github.com/users/${githubUsername}`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockUserData);
  });

  it('should get repositories data', () => {
    const mockReposData: Repository[] = [{ 
      name : ".github",
      description : "",
      topics : [],
      html_url: "https://github.com/johnpapa/.github"
     },{ 
      name : "aggregator-app",
      description : "serverless function with api aggregator with azure",
      topics : [],
      html_url: "https://github.com/johnpapa/aggregator-app"
     },{ 
      name : "all-contributors",
      description : "✨ Recognize all contributors, not just the ones who push code ✨",
      topics : [],
      html_url: "https://github.com/johnpapa/all-contributors"
     },{ 
      name : "analyze-and-generate-images-with-Azure-AI",
      description : "https://github.com/johnpapa/analyze-and-generate-images-with-Azure-AI",
      topics : [],
      html_url: "https://github.com/johnpapa/analyze-and-generate-images-with-Azure-AI"
     }];
    const githubUsername = 'johnpapa';
    const perPage = 4;
    const pageNo = 1;

    service.getRepos(githubUsername, perPage, pageNo).subscribe((reposData) => {
      expect(reposData).toEqual(mockReposData);
    });

    const req = httpMock.expectOne(`https://api.github.com/users/${githubUsername}/repos?page=${pageNo}&&per_page=${perPage}`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockReposData);
  });

  it('should handle errors in getUser', () => {
    const githubUsername = 'examplesuser';

    service.getUser(githubUsername).subscribe(
      () => fail('Expected an error, but received no error'),
      (error: HttpErrorResponse) => {
        console.log(error)
        expect(error.ok).toBe(false); 
      }
    );

    const req = httpMock.expectOne(`https://api.github.com/users/${githubUsername}`);
    expect(req.request.method).toEqual('GET');
    req.error(new ErrorEvent('error', { error: new Error('User not found'), message: 'User not found' }));
  });


});
