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
        if (!/[A-Z]/g.test(password)) {
            return {
                isValid: false,
                errorMessage: 'La contrasenya ha de contenir almenys una lletra majúscula.',
            };
        }
        if (!/[a-z]/g.test(password)) {
            return {
                isValid: false,
                errorMessage: 'La contrasenya ha de contenir almenys una lletra minúscula.',
            };
        }
        if (!/\d/g.test(password)) {
            return {
                isValid: false,
                errorMessage: 'La contrasenya ha de contenir almenys un número.',
            };
        }
        if (!/[!@#$%^&*()-_=+[\]{};:'",.<>/?\\|~]/g.test(password)) {
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

    isValidIsbn(isbn: string) {
        // Eliminar guiones o espacios en blanco del ISBN
        isbn = isbn.replace(/[-\s]/g, '');

        // Verificar si el ISBN tiene 10 o 13 dígitos
        if (isbn.length !== 10 && isbn.length !== 13) {
            return false;
        }

        // Verificar si todos los caracteres son dígitos o el último carácter es 'X' (solo en ISBN-10)
        if (isbn.length === 10 && !/^\d{9}(\d|X)$/.test(isbn)) {
            return false;
        } else if (isbn.length === 13 && !/^\d{12}(\d|X)$/.test(isbn)) {
            return false;
        }

        // Calcular la suma ponderada de los dígitos
        let suma = 0;
        for (let i = 0; i < isbn.length - 1; i++) {
            suma += parseInt(isbn[i]) * (i % 2 === 0 ? 1 : 3);
        }

        // Calcular el dígito de verificación
        let digitoVerificador = (10 - (suma % 10)) % 10;

        // Verificar si el dígito de verificación coincide con el último dígito del ISBN (solo en ISBN-10)
        if (isbn.length === 10) {
            return digitoVerificador === (isbn[9] === 'X' ? 10 : parseInt(isbn[9]));
        }

        // Verificar si el dígito de verificación coincide con el último dígito del ISBN (solo en ISBN-13)
        return digitoVerificador === parseInt(isbn[12]);
    }
}
