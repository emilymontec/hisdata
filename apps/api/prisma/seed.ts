import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const BASE_ROLES = ['ADMIN', 'MEDICO', 'ENFERMERIA', 'ADMINISTRATIVO', 'PACIENTE', 'AUDITOR'];

async function main() {
  for (const code of BASE_ROLES) {
    await prisma.role.upsert({
      where: { code },
      update: {},
      create: { code, name: code },
    });
  }

  const adminRole = await prisma.role.findUniqueOrThrow({ where: { code: 'ADMIN' } });

  // Credenciales de arranque SOLO para entorno local/desarrollo.
  // Deben cambiarse inmediatamente en el primer inicio de sesión (mustChangePassword = true)
  // y nunca deben usarse en un entorno real.
  const existingAdmin = await prisma.user.findUnique({ where: { email: 'admin@hisdata.local' } });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('CambiarEsta123!', 12);
    await prisma.user.create({
      data: {
        email: 'admin@hisdata.local',
        firstName: 'Administrador',
        lastName: 'HISDATA',
        passwordHash,
        roleId: adminRole.id,
        mustChangePassword: true,
      },
    });
    // eslint-disable-next-line no-console
    console.log('Usuario administrador de arranque creado: admin@hisdata.local / CambiarEsta123!');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
