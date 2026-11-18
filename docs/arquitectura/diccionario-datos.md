# Diccionario de datos — HISDATA

Generado a partir de `apps/api/prisma/schema.prisma`. Esta es la fuente de verdad técnica; este documento es su versión legible para quien no lee Prisma directamente. Si el esquema cambia, este documento debe regenerarse/actualizarse en el mismo cambio.

## Enumeraciones

**`UserStatus`**: ACTIVE, SUSPENDED, LOCKED

**`DocumentType`**: CC, TI, CE, PASAPORTE, REGISTRO_CIVIL, OTRO

**`AppointmentStatus`**: SCHEDULED, CONFIRMED, CANCELLED, COMPLETED, NO_SHOW, RESCHEDULED

**`AdmissionStatus`**: ADMITTED, TRANSFERRED, DISCHARGED

**`MedicalOrderType`**: LABORATORY, IMAGING, PROCEDURE

**`MedicalOrderStatus`**: REQUESTED, IN_PROGRESS, COMPLETED, CANCELLED

**`LabRequestStatus`**: PENDING, SAMPLE_COLLECTED, RESULT_REGISTERED, VALIDATED, PUBLISHED

**`ImagingRequestStatus`**: PENDING, IN_PROGRESS, REPORTED

**`PrescriptionStatus`**: ACTIVE, DISPENSED, CANCELLED, EXPIRED

**`InventoryMovementType`**: IN, OUT, ADJUSTMENT

**`CertificateType`**: CONSTANCIA_ATENCION, REMISION, INCAPACIDAD, OTRO

**`NotificationChannel`**: IN_APP, EMAIL


## Entidades

### `Role`

| Campo | Tipo | Notas |
|---|---|---|
| id | String | PK, default: uuid() |
| code | String | único, ADMIN, MEDICO, ENFERMERIA, ADMINISTRATIVO, PACIENTE, AUDITOR |
| name | String |  |
| permissions | Permission[] |  |
| users | User[] |  |
| createdAt | DateTime | default: now() |

### `Permission`

| Campo | Tipo | Notas |
|---|---|---|
| id | String | PK, default: uuid() |
| code | String | único, ej: patients.read, patients.write, clinical_record.read |
| roles | Role[] |  |

### `User`

| Campo | Tipo | Notas |
|---|---|---|
| id | String | PK, default: uuid() |
| email | String | único |
| passwordHash | String |  |
| firstName | String |  |
| lastName | String |  |
| status | UserStatus | default: ACTIVE |
| roleId | String |  |
| role | Role | FK → roleId |
| mustChangePassword | Boolean | default: false |
| failedLoginAttempts | Int | default: 0 |
| lastLoginAt | DateTime? |  |
| refreshTokens | RefreshToken[] |  |
| resetTokens | PasswordResetToken[] |  |
| patient | Patient? |  |
| createdAt | DateTime | default: now() |
| updatedAt | DateTime |  |
| appointmentsAsPractitioner | Appointment[] |  |
| clinicalNotesAuthored | ClinicalNote[] |  |
| diagnosesRegistered | Diagnosis[] |  |
| consultationsAsPractitioner | Consultation[] |  |
| nursingNotesAuthored | NursingNote[] |  |
| medicalOrdersRequested | MedicalOrder[] |  |
| labResultsValidated | LabResult[] |  |
| imagingReportsAuthored | ImagingReport[] |  |
| prescriptionsIssued | Prescription[] |  |
| dispensationsPerformed | DispensationRecord[] |  |
| inventoryMovementsRegistered | InventoryMovement[] |  |
| certificatesIssued | Certificate[] |  |
| notificationsReceived | Notification[] |  |
| auditLogsAsActor | AuditLog[] |  |

### `RefreshToken`

| Campo | Tipo | Notas |
|---|---|---|
| id | String | PK, default: uuid() |
| tokenHash | String | único |
| userId | String |  |
| user | User | FK → userId |
| expiresAt | DateTime |  |
| revokedAt | DateTime? |  |
| createdAt | DateTime | default: now() |

### `PasswordResetToken`

| Campo | Tipo | Notas |
|---|---|---|
| id | String | PK, default: uuid() |
| tokenHash | String | único |
| userId | String |  |
| user | User | FK → userId |
| expiresAt | DateTime |  |
| usedAt | DateTime? |  |
| createdAt | DateTime | default: now() |

### `Patient`

| Campo | Tipo | Notas |
|---|---|---|
| id | String | PK, default: uuid() |
| documentType | DocumentType |  |
| documentNumber | String |  |
| firstName | String |  |
| lastName | String |  |
| dateOfBirth | DateTime |  |
| sex | String |  |
| phone | String? |  |
| email | String? |  |
| address | String? |  |
| linkedUserId | String? | único |
| linkedUser | User? | FK → linkedUserId |
| duplicateOfId | String? | referencia sugerida por el detector de duplicados, pendiente de confirmación manual |
| appointments | Appointment[] |  |
| clinicalRecord | ClinicalRecord? |  |
| admissions | Admission[] |  |
| medicalOrders | MedicalOrder[] |  |
| prescriptions | Prescription[] |  |
| certificates | Certificate[] |  |
| notifications | Notification[] |  |
| createdAt | DateTime | default: now() |
| updatedAt | DateTime |  |

### `Appointment`

| Campo | Tipo | Notas |
|---|---|---|
| id | String | PK, default: uuid() |
| patientId | String |  |
| patient | Patient | FK → patientId |
| practitionerId | String |  |
| practitioner | User | FK → practitionerId |
| startsAt | DateTime |  |
| endsAt | DateTime |  |
| status | AppointmentStatus | default: SCHEDULED |
| reason | String? |  |
| rescheduledFromId | String? |  |
| consultation | Consultation? |  |
| createdAt | DateTime | default: now() |
| updatedAt | DateTime |  |

### `ClinicalRecord`

| Campo | Tipo | Notas |
|---|---|---|
| id | String | PK, default: uuid() |
| patientId | String | único |
| patient | Patient | FK → patientId |
| notes | ClinicalNote[] |  |
| diagnoses | Diagnosis[] |  |
| consultations | Consultation[] |  |
| createdAt | DateTime | default: now() |

### `ClinicalNote`

| Campo | Tipo | Notas |
|---|---|---|
| id | String | PK, default: uuid() |
| clinicalRecordId | String |  |
| clinicalRecord | ClinicalRecord | FK → clinicalRecordId |
| authorId | String |  |
| author | User | FK → authorId |
| content | String |  |
| signedAt | DateTime? |  |
| createdAt | DateTime | default: now() |

### `Diagnosis`

| Campo | Tipo | Notas |
|---|---|---|
| id | String | PK, default: uuid() |
| clinicalRecordId | String |  |
| clinicalRecord | ClinicalRecord | FK → clinicalRecordId |
| code | String? |  |
| codeSystem | String? |  |
| description | String |  |
| registeredById | String |  |
| registeredBy | User | FK → registeredById |
| createdAt | DateTime | default: now() |

### `Consultation`

| Campo | Tipo | Notas |
|---|---|---|
| id | String | PK, default: uuid() |
| appointmentId | String? | único |
| appointment | Appointment? | FK → appointmentId |
| clinicalRecordId | String |  |
| clinicalRecord | ClinicalRecord | FK → clinicalRecordId |
| practitionerId | String |  |
| practitioner | User | FK → practitionerId |
| reason | String |  |
| findings | String? |  |
| plan | String? |  |
| orders | MedicalOrder[] |  |
| prescriptions | Prescription[] |  |
| createdAt | DateTime | default: now() |

### `NursingNote`

| Campo | Tipo | Notas |
|---|---|---|
| id | String | PK, default: uuid() |
| admissionId | String? |  |
| admission | Admission? | FK → admissionId |
| authorId | String |  |
| author | User | FK → authorId |
| observation | String |  |
| vitalSigns | Json? |  |
| createdAt | DateTime | default: now() |

### `Ward`

| Campo | Tipo | Notas |
|---|---|---|
| id | String | PK, default: uuid() |
| name | String | único |
| beds | Bed[] |  |

### `Bed`

| Campo | Tipo | Notas |
|---|---|---|
| id | String | PK, default: uuid() |
| wardId | String |  |
| ward | Ward | FK → wardId |
| code | String |  |
| isOccupied | Boolean | default: false |
| admissions | Admission[] |  |

### `Admission`

| Campo | Tipo | Notas |
|---|---|---|
| id | String | PK, default: uuid() |
| patientId | String |  |
| patient | Patient | FK → patientId |
| bedId | String? |  |
| bed | Bed? | FK → bedId |
| status | AdmissionStatus | default: ADMITTED |
| admittedAt | DateTime | default: now() |
| dischargedAt | DateTime? |  |
| transfers | Transfer[] |  |
| nursingNotes | NursingNote[] |  |

### `Transfer`

| Campo | Tipo | Notas |
|---|---|---|
| id | String | PK, default: uuid() |
| admissionId | String |  |
| admission | Admission | FK → admissionId |
| fromBedId | String? |  |
| toBedId | String |  |
| reason | String? |  |
| createdAt | DateTime | default: now() |

### `MedicalOrder`

| Campo | Tipo | Notas |
|---|---|---|
| id | String | PK, default: uuid() |
| patientId | String |  |
| patient | Patient | FK → patientId |
| consultationId | String? |  |
| consultation | Consultation? | FK → consultationId |
| requestedById | String |  |
| requestedBy | User | FK → requestedById |
| type | MedicalOrderType |  |
| description | String |  |
| status | MedicalOrderStatus | default: REQUESTED |
| labRequest | LabRequest? |  |
| imagingRequest | ImagingRequest? |  |
| createdAt | DateTime | default: now() |
| updatedAt | DateTime |  |

### `LabRequest`

| Campo | Tipo | Notas |
|---|---|---|
| id | String | PK, default: uuid() |
| medicalOrderId | String | único |
| medicalOrder | MedicalOrder | FK → medicalOrderId |
| status | LabRequestStatus | default: PENDING |
| sampleCollectedAt | DateTime? |  |
| results | LabResult[] |  |
| createdAt | DateTime | default: now() |

### `LabResult`

| Campo | Tipo | Notas |
|---|---|---|
| id | String | PK, default: uuid() |
| labRequestId | String |  |
| labRequest | LabRequest | FK → labRequestId |
| parameter | String |  |
| value | String |  |
| unit | String? |  |
| referenceRange | String? |  |
| validatedById | String? |  |
| validatedBy | User? | FK → validatedById |
| validatedAt | DateTime? |  |
| createdAt | DateTime | default: now() |

### `ImagingRequest`

| Campo | Tipo | Notas |
|---|---|---|
| id | String | PK, default: uuid() |
| medicalOrderId | String | único |
| medicalOrder | MedicalOrder | FK → medicalOrderId |
| modality | String | RX, TAC, RM, ECO, etc. |
| status | ImagingRequestStatus | default: PENDING |
| report | ImagingReport? |  |
| createdAt | DateTime | default: now() |

### `ImagingReport`

| Campo | Tipo | Notas |
|---|---|---|
| id | String | PK, default: uuid() |
| imagingRequestId | String | único |
| imagingRequest | ImagingRequest | FK → imagingRequestId |
| reportedById | String |  |
| reportedBy | User | FK → reportedById |
| findings | String |  |
| documentUrl | String? |  |
| createdAt | DateTime | default: now() |

### `Prescription`

| Campo | Tipo | Notas |
|---|---|---|
| id | String | PK, default: uuid() |
| patientId | String |  |
| patient | Patient | FK → patientId |
| consultationId | String? |  |
| consultation | Consultation? | FK → consultationId |
| prescribedById | String |  |
| prescribedBy | User | FK → prescribedById |
| status | PrescriptionStatus | default: ACTIVE |
| items | PrescriptionItem[] |  |
| createdAt | DateTime | default: now() |

### `PrescriptionItem`

| Campo | Tipo | Notas |
|---|---|---|
| id | String | PK, default: uuid() |
| prescriptionId | String |  |
| prescription | Prescription | FK → prescriptionId |
| medicationId | String? |  |
| medication | Medication? | FK → medicationId |
| freeTextDrug | String? | usado si el medicamento no está en catálogo todavía |
| dosageInstructions | String |  |
| dispensations | DispensationRecord[] |  |

### `Medication`

| Campo | Tipo | Notas |
|---|---|---|
| id | String | PK, default: uuid() |
| name | String | único |
| presentation | String |  |
| stock | PharmacyStock[] |  |
| items | PrescriptionItem[] |  |

### `PharmacyStock`

| Campo | Tipo | Notas |
|---|---|---|
| id | String | PK, default: uuid() |
| medicationId | String |  |
| medication | Medication | FK → medicationId |
| batchNumber | String |  |
| quantity | Int |  |
| expiresAt | DateTime? |  |

### `DispensationRecord`

| Campo | Tipo | Notas |
|---|---|---|
| id | String | PK, default: uuid() |
| prescriptionItemId | String |  |
| prescriptionItem | PrescriptionItem | FK → prescriptionItemId |
| dispensedById | String |  |
| dispensedBy | User | FK → dispensedById |
| quantity | Int |  |
| dispensedAt | DateTime | default: now() |

### `InventoryItem`

| Campo | Tipo | Notas |
|---|---|---|
| id | String | PK, default: uuid() |
| name | String |  |
| category | String |  |
| quantity | Int | default: 0 |
| movements | InventoryMovement[] |  |

### `InventoryMovement`

| Campo | Tipo | Notas |
|---|---|---|
| id | String | PK, default: uuid() |
| inventoryItemId | String |  |
| inventoryItem | InventoryItem | FK → inventoryItemId |
| type | InventoryMovementType |  |
| quantity | Int |  |
| registeredById | String |  |
| registeredBy | User | FK → registeredById |
| createdAt | DateTime | default: now() |

### `Certificate`

| Campo | Tipo | Notas |
|---|---|---|
| id | String | PK, default: uuid() |
| patientId | String |  |
| patient | Patient | FK → patientId |
| type | CertificateType |  |
| issuedById | String |  |
| issuedBy | User | FK → issuedById |
| content | String |  |
| documentUrl | String? |  |
| createdAt | DateTime | default: now() |

### `Notification`

| Campo | Tipo | Notas |
|---|---|---|
| id | String | PK, default: uuid() |
| recipientPatientId | String? |  |
| recipientPatient | Patient? | FK → recipientPatientId |
| recipientUserId | String? |  |
| recipientUser | User? | FK → recipientUserId |
| channel | NotificationChannel | default: IN_APP |
| title | String |  |
| body | String |  |
| readAt | DateTime? |  |
| createdAt | DateTime | default: now() |

### `AuditLog`

| Campo | Tipo | Notas |
|---|---|---|
| id | String | PK, default: uuid() |
| actorUserId | String? |  |
| actorUser | User? | FK → actorUserId |
| action | String | ej: PATIENT_CREATE, CLINICAL_NOTE_READ, LOGIN_FAILED |
| entityType | String? |  |
| entityId | String? |  |
| ipAddress | String? |  |
| metadata | Json? |  |
| createdAt | DateTime | default: now() |
