import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class LoadingService {
    private _loading = new BehaviorSubject<boolean>(false);
    public loading$ = this._loading.asObservable();
    private requestCount = 0;

    start() {
        this.requestCount++;
        setTimeout(() => {
            this._loading.next(true);
        });
    }

    stop() {
        this.requestCount = Math.max(this.requestCount - 1, 0);
        if (this.requestCount === 0) {
            setTimeout(() => {
                this._loading.next(false);
            });
        }
    }

}
