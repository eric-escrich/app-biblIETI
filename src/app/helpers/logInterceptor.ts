import { Injectable, Injector, inject } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LogService } from '../services/log.service';
import { environment } from '../../environments/environment';

@Injectable()
export class LogInterceptor implements HttpInterceptor {
    _logService = inject(LogService);

    baseUrl: string = environment.apiUrl;

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.url.includes('/logs/save')) {
            return next.handle(req);
        } else {
            this._logService.sendLogs();
            return next.handle(req);
        }
    }
}
