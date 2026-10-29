# Decisiones pendientes de HISDATA

Este documento lista lo que **deliberadamente no se implementó** en el código actual, y qué se necesita para destrabarlo. No son tareas olvidadas: son puntos que requieren una decisión o validación de alguien que no es el equipo de desarrollo.

## Excluidos por completo del código actual

| Módulo/elemento | Por qué está excluido | Qué se necesita para empezar |
|---|---|---|
| Facturación y administración | Requiere reglas tarifarias, contables y tributarias aprobadas | Responsable financiero/administrativo que defina tarifas, impuestos aplicables y flujo de cobro |
| Integraciones e interoperabilidad | Requiere contratos externos definidos (HL7/FHIR u otros) con sistemas reales | Identificar los sistemas externos reales a integrar y sus contratos técnicos |
| Portal del paciente | Depende de que los módulos base (citas, historia clínica) estén estables | Validar qué información exacta puede ver el paciente directamente |
| Reportes y analítica avanzada | Depende de tener datos reales circulando en los módulos operativos | Definir indicadores prioritarios con el área administrativa/clínica |

## Implementado en estructura, pero con reglas de negocio pendientes de validación profesional

| Elemento | Qué sí existe | Qué falta validar |
|---|---|---|
| Diagnósticos (`Diagnosis`) | Campos `code`/`codeSystem` preparados | Adopción formal de CIE-10 u otro estándar, y quién puede registrar/corregir diagnósticos |
| Notas clínicas (`ClinicalNote`) | Registro y lectura auditada | Mecanismo de firma clínica y corrección/enmienda de notas ya firmadas |
| Resultados de laboratorio | Flujo de estados (registrado → validado → publicado) | Quién tiene autoridad clínica para validar/publicar (hoy se reutiliza el rol MEDICO) |
| Prescripciones | Registro, consulta, cancelación | Validación de interacciones medicamentosas, dosis máximas, contraindicaciones — **no implementado a propósito** |
| Certificados/remisiones | Registro de documento con contenido libre | Plantillas formales por tipo de documento y sus requisitos legales |
| Notificaciones por correo | Modelo de datos y registro de la intención | Canal externo de envío (proveedor de correo) configurado y autorizado |

## Perfiles/roles pendientes de refinar

Los roles actuales (`ADMIN`, `MEDICO`, `ENFERMERIA`, `ADMINISTRATIVO`, `PACIENTE`, `AUDITOR`) son un punto de partida razonable, pero algunos módulos (laboratorio, farmacia) probablemente necesiten roles más específicos (ej. "técnico de laboratorio", "farmacéutico") en lugar de reutilizar `MEDICO`/`ENFERMERIA`/`ADMIN`. Se definirá cuando haya claridad sobre la estructura real de personal.

## Infraestructura pendiente

- **Almacenamiento de archivos** (resultados de imagenología, documentos adjuntos): el campo `documentUrl` está preparado en el modelo de datos, pero no hay un ADR ni una solución de almacenamiento (S3-compatible u otra) implementada todavía.
- **Mensajería asíncrona**: no se incluyó en el MVP; se evaluará cuando un módulo concreto (ej. notificaciones, laboratorio) lo justifique por volumen o necesidad de desacoplamiento real.
