export type ErrorCode =
    | 'NOT_FOUND'
    | 'UNAUTHORIZED'
    | 'FORBIDDEN'
    | 'VALIDATION_ERROR'
    | 'INTERNAL_ERROR';

/**
 * Classe base de erro agnóstica para o domínio.
 * Mantém a consistência entre o que o servidor sabe e o que a UI exibe.
 */
export class AppError extends Error {
    public readonly code: ErrorCode;
    public readonly statusCode: number;

    constructor(message: string, code: ErrorCode = 'INTERNAL_ERROR', statusCode: number = 500) {
        super(message);
        this.name = 'AppError';
        this.code = code;
        this.statusCode = statusCode;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, AppError);
        }
    }

    // Método utilitário para formatar o erro para a UI
    public toResponse() {
        return {
            message: this.message,
            code: this.code,
            status: this.statusCode,
        };
    }
}
