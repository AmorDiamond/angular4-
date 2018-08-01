import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, ActivatedRouteSnapshot, RouterStateSnapshot, Route, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CanAuthProvide implements CanActivate, CanLoad {

    constructor(private Route: Router) {}

    check(): Observable<boolean> {
        return new Observable((observer) => {
            if (sessionStorage.getItem('hasLogin')) {
                observer.next(true);
                observer.complete();
                return;
            }

            observer.next(false);
            this.Route.navigate(['/login']);
            observer.complete();
        });
    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        return this.check();
    }

    canLoad(route: Route): boolean | Observable<boolean> | Promise<boolean> {
        return this.check();
    }

}
