import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../core/auth/auth.service';
import { LogService } from '../services/log.service';
import { ProfileService } from '../services/profile.service';

export const JwtGuard: CanActivateFn = async () => {
    const _authService = inject(AuthService);
    const _logService = inject(LogService);
    const _profileService = inject(ProfileService);

    const token = _authService.getToken();
    let email: string = '';
    try {
        email = await _profileService.getUsername();
    } catch (error) {
        email = '';
    }

    if (token) {
        _logService.logInfo('Token verificado', 'Token encontrado en el localStorage', 'JwtGuard', email);
        return true;
    }

    _logService.logError('Token no encontrado', 'No se ha encontrado ningún token en el localStorage', 'JwtGuard', email);
    _profileService.logout();
    return false;
};
