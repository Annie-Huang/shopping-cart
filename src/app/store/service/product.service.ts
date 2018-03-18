import { Injectable } from '@angular/core';
import {Product} from './product';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {UrlConfig} from '../../../environments/url-config';
import 'rxjs/add/observable/of';

declare var require: any;

@Injectable()
export class ProductService {

    constructor(private _http: HttpClient, private _urlConfig: UrlConfig) { }

    getAll(): Observable<Product[]> {
        const products: Product[] = require('../../../resources/fixtures/products.json');
        return Observable.of(products);
        // return this._http.get<Product[]>(this._urlConfig.productsUrl);
    }
}
