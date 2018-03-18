import {Injectable} from '@angular/core';

@Injectable()
export class UrlConfig {
    productsUrl = 'http://localhost:8080/v1/getProudcts';
    userUrl = 'http://localhost:8080/v1/getUser/{id}';
}
