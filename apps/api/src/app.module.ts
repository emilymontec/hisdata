import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './common/prisma/prisma.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PatientsModule } from './modules/patients/patients.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { ClinicalRecordModule } from './modules/clinical-record/clinical-record.module';
import { MedicalConsultationModule } from './modules/medical-consultation/medical-consultation.module';
import { NursingModule } from './modules/nursing/nursing.module';
import { AdmissionsModule } from './modules/admissions/admissions.module';
import { OrdersModule } from './modules/orders/orders.module';
import { LaboratoryModule } from './modules/laboratory/laboratory.module';
import { ImagingModule } from './modules/imaging/imaging.module';
import { PrescriptionsModule } from './modules/prescriptions/prescriptions.module';
import { PharmacyModule } from './modules/pharmacy/pharmacy.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { CertificatesModule } from './modules/certificates/certificates.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AuditModule } from './modules/audit/audit.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),
    PrismaModule,

    // Transversal
    AuditModule,

    // Núcleo
    AuthModule,
    UsersModule,
    PatientsModule,

    // Flujo asistencial
    AppointmentsModule,
    ClinicalRecordModule,
    MedicalConsultationModule,
    NursingModule,
    AdmissionsModule,
    OrdersModule,
    LaboratoryModule,
    ImagingModule,
    PrescriptionsModule,
    PharmacyModule,
    InventoryModule,
    CertificatesModule,
    NotificationsModule,

    // Facturación e integraciones: EXCLUIDOS deliberadamente (ver docs/gestion/decisiones-pendientes.md)
  ],
  providers: [
    // Orden de ejecución: Throttler -> Auth (JWT) -> Roles. Todas protegidas por defecto;
    // los endpoints públicos se marcan explícitamente con @Public().
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
  ],
})
export class AppModule {}
