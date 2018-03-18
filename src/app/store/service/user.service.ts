import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UrlConfig} from '../../../environments/url-config';
import {Observable} from 'rxjs/Observable';
import {User} from './user';

declare var require: any;

@Injectable()
export class UserService {

    constructor(private _http: HttpClient, private _urlConfig: UrlConfig) { }

    getUserById(id: string): Observable<User> {
        const user: User = require('../../../resources/fixtures/user-ford.json');
        return Observable.of(user);
        // let userUrl = this._urlConfig.userUrl;
        // userUrl = userUrl.replace('{id}', id);
        // return this._http.get<User>(userUrl);
    }

}
