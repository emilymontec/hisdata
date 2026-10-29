import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * Marca los códigos de rol autorizados para un endpoint (ej. 'ADMIN', 'MEDICO').
 * Se evalúa en servidor mediante RolesGuard; nunca confiar en controles solo de frontend.
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
