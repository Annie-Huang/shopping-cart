# ShoppingCart

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.7.0.
 
Technology stack:
- Angular 5, typescript 2.5, rxjs 5.5.
- Bootstrap for styling.
- Other libraries like lodash.

## Before you run the application for the first time.

Do 'npm install'. You may need to install angular-cli in the global level.

## Development server

Run `ng serve -o` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

Note:
- User is configured to be user-ford.json in \src\app\store\service\user.service.ts. There are 5 stub users you can change in \src\resources\fixtures\ folder (with the name user-**.json)
- Product is configured to be product.json in \src\app\store\service\product.service.ts. There are 3 products available.


## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

Before you run the unit test, make sure:
\src\app\store\service\user.service.ts and \src\app\store\service\product.service.ts are set back to invoke the http calls.
 

## Running unit tests

Run `ng coverage` to execute the coverage on unit tests via [Karma](https://karma-runner.github.io). 

Note:
- Coveragae test is currently configured to be single run. Then the test report is in \coverage\index.html 
- Before you run the unit test, make sure \src\app\store\service\user.service.ts and \src\app\store\service\product.service.ts are set back to invoke the http calls.

Integration test against the requriement is in \src\app\shopping-cart\service\shopping-cart.service.integration.spec.ts file.

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Running ESLint

Run `ng lint` to execute the style check on files. Exclusion list is in .angular-cli.json 

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
