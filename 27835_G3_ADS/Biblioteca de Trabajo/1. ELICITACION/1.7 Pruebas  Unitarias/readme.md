# Informe de Pruebas del Sistema (QA)

Este directorio contiene los documentos que forman parte del Elemento de Configuración del Software (ECS) relacionado con la gestión, ejecución y resultados de las pruebas del sistema **El Granito**, basadas en los flujos de actividades definidos para cada rol del sistema.

## Información del ECS

- **Código del ECS:** QA
- **Nombre del ECS:** Informe de Pruebas del Sistema
- **Autor:** [Nombre del equipo / estudiante]
- **Proyecto:** El Granito – Plataforma Financiera
- **Línea base:** QA – Gestión de Pruebas del Software

## Alcance del Documento
El informe de pruebas documenta la validación funcional del sistema a partir de los diagramas de flujo de actividades, cubriendo los procesos correspondientes a los siguientes usuarios:

Usuario General: Encargado de realizar la autenticación, recuperación de contraseña, y gestionar sus pagos y consultas de créditos.
Cliente: Responsable de realizar el registro, pagos, certificados y consultas de créditos.
Asistente: Encargado de la consulta de clientes y generación de reportes de morosidad.
Gerente: Responsable de la gestión de créditos, administración de usuarios, generación de reportes y auditoría del sistema.
Herramientas de Pruebas
Para llevar a cabo las pruebas del sistema, se utilizarán JMeter y k6, cada uno por sus características específicas:

## JMeter
Descripción: JMeter es una herramienta de código abierto diseñada para realizar pruebas de carga y rendimiento. Es especialmente útil para probar aplicaciones web y servicios.
Razón de uso: Se selecciona JMeter debido a su capacidad para simular múltiples usuarios concurrentes y generar informes detallados sobre el rendimiento del sistema. Su interfaz gráfica facilita la creación y configuración de pruebas complejas, lo que es ideal para validar la funcionalidad y el rendimiento de los flujos críticos del sistema El Granito.

## k6
Descripción: k6 es una herramienta moderna de pruebas de carga que se enfoca en la simplicidad y la facilidad de uso, permitiendo a los desarrolladores escribir pruebas en JavaScript.
Razón de uso: Se opta por k6 para aprovechar su integración con entornos de desarrollo y su capacidad para realizar pruebas de carga de forma rápida y eficiente. Su enfoque en el rendimiento y la facilidad para generar métricas en tiempo real lo hace adecuado para evaluar el comportamiento del sistema bajo condiciones de carga variable.
## Historial de Versiones del Informe de Pruebas

| Versión | Fecha | Responsable | Aprobado por |
|-------|------|-------------|--------------|
| QA_V1.0 | 22/01/2026 | [Simoné Medina] | [Oswaldo Tipán] |

