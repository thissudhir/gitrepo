import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Profile } from '../models/profile';
import { Repository } from '../models/repository';
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private githubURL = 'https://api.github.com/users/'

  constructor(
    private httpClient: HttpClient
  ) { }

  getUser(githubUsername: string) : Observable<Profile>{
    return this.httpClient.get<Profile>(this.githubURL + githubUsername)
  }

  getRepos(githubUsername: string, per_page: number, pageNo: number) : Observable<Repository[]> {
    return this.httpClient.get<Repository[]>(`${this.githubURL}${githubUsername}/repos?page=${pageNo}&&per_page=${per_page}`)
  }
}
