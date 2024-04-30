import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class FormValidationService {
    validatePassword(password: string): { isValid: boolean; errorMessage: string } {
        if (password.length < 8) {
            return {
                isValid: false,
                errorMessage: `La contrasenya és massa curta (${password.length})`,
            };
        }
        if (password.length > 16) {
            return {
                isValid: false,
                errorMessage: 'La contrasenya és massa llarga (${password.length})',
            };
        }
        if (!/[A-Z]/.test(password)) {
            return {
                isValid: false,
                errorMessage: 'La contrasenya ha de contenir almenys una lletra majúscula.',
            };
        }
        if (!/[a-z]/.test(password)) {
            return {
                isValid: false,
                errorMessage: 'La contrasenya ha de contenir almenys una lletra minúscula.',
            };
        }
        if (!/\d/.test(password)) {
            return {
                isValid: false,
                errorMessage: 'La contrasenya ha de contenir almenys un número.',
            };
        }
        if (!/[!@#$%^&*()-_=+[\]{};:'",.<>/?\\|~]/.test(password)) {
            return {
                isValid: false,
                errorMessage: 'La contrasenya ha de contenir almenys un caràcter especial.',
            };
        }
        return {
            isValid: true,
            errorMessage: '',
        };
    }

    isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isEmpty(value: string): boolean {
        return value.length == 0;
    }

    isValidDni(dni: string): boolean {
        const dniRegex = /^[0-9]{8}[A-Z]$/;
        if (!dniRegex.test(dni)) {
            return false;
        }

        const letter = 'TRWAGMYFPDXBNJZSQVHLCKE';
        const number = parseInt(dni.substr(0, 8), 10);
        const expectedLetter = letter.charAt(number % 23);

        return dni.charAt(8) === expectedLetter;
    }

    isValidTlfn(telefono: string): boolean {
        const telefonoRegex = /^[679][0-9]{8}$/;
        return telefonoRegex.test(telefono);
    }
}
