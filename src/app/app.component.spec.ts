import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { AppComponent } from './app.component';
import { ApiService } from './services/api.service';
import { Repository } from './models/repository';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ApiService', ['getUser', 'getRepos']);

    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: ApiService, useValue: spy },
        FormBuilder, // Add FormBuilder to the providers
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the search form', () => {
    expect(component.searchGroup).toBeDefined();
    expect(component.searchGroup.get('login')).toBeDefined();
  });

  it('should load repositories on loadRepos', fakeAsync(() => {
    const mockRepos: Repository[] = [{ 
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

    apiServiceSpy.getRepos.and.returnValue(of(mockRepos));

    component.profile.login = 'johnpapa';
    component.loadRepos();

    tick();
    fixture.detectChanges();

    expect(apiServiceSpy.getRepos).toHaveBeenCalledWith('johnpapa', component.perPage, component.pageNumber);
    expect(component.repositories).toEqual(mockRepos);
  }));

  it('should navigate to next page on onClickNext', fakeAsync(() => {
    component.pageNumber = 1;
    spyOn(component, 'loadRepos');

    component.onClickNext();

    expect(component.pageNumber).toBe(2);
    expect(component.loadRepos).toHaveBeenCalled();
  }));

  it('should navigate to previous page on onnClickPrevious', fakeAsync(() => {
    component.pageNumber = 2;
    spyOn(component, 'loadRepos');

    component.onnClickPrevious();

    expect(component.pageNumber).toBe(1);
    expect(component.loadRepos).toHaveBeenCalled();
  }));

  it('should update page and reload repositories on onChange', fakeAsync(() => {
    spyOn(component, 'loadRepos');

    component.onChange({ target: { value: 20 } });

    expect(component.perPage).toBe(20);
    expect(component.pageNumber).toBe(1);
    expect(component.loadRepos).toHaveBeenCalled();
  }));
});
