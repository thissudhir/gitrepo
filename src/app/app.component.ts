import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';
import { Profile } from './models/profile';
import { Repository } from './models/repository';
import {FormBuilder, FormGroup ,Validators} from '@angular/forms'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  profile: Profile = {
    name : "",
    avatar_url : "",
    bio : "",
    location : "",
    public_repos : 0,
    login : "",
    html_url : ""
  }
  repositories: Repository[] = []
  searchGroup: FormGroup = new FormGroup({})
  errorMessage: string = ""
  ProfileLoaded: boolean = false
  pageNumber: number = 1
  totalPages: number = 0
  perPage: number = 10

  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.searchGroup = this.formBuilder.group({
      login: ['',Validators.required]
    })

  }

  search() : void {
    if(this.searchGroup.valid) {
      this.ProfileLoaded = true
      this.repositories = []
      this.profile.login = ""
      //load github profile
      this.apiService.getUser(this.searchGroup.value.login).subscribe({
        next: (profile) => {
          this.profile = profile
          this.profile.login = profile.login
        },
        error: (e) => {
          this.errorMessage = e.error.message
          this.ProfileLoaded = false
        },
        complete: () => {
          this.totalPages = Math.ceil(this.profile.public_repos/this.perPage)
          
          this.loadRepos()    //load repositories if profile exists
          this.ProfileLoaded = false
        }
      });

      this.searchGroup.reset();
      setTimeout(() => {
        this.errorMessage = ""
      }, 4000);
    }
  }

  loadRepos() : void {
    this.apiService.getRepos(this.profile.login,this.perPage,this.pageNumber).subscribe((repositories) => {
        this.repositories = repositories
      }
    );
  }

  onClickNext() : void {
    this.pageNumber++
    this.loadRepos()
  }

  onnClickPrevious() : void {
    this.pageNumber--
    this.loadRepos()
  }

  onChange(event: any){
    this.perPage = event.target.value
    this.pageNumber = 1
    this.totalPages = Math.ceil(this.profile.public_repos/this.perPage)
    this.loadRepos()
  }
}
