# creai-smoke-test

Creai Homepage - Smoke Test Suite 🚀

Este proyecto contiene una suite de pruebas automatizadas (Smoke Tests) diseñada para validar las funciones críticas y básicas de la aplicación Creai. El objetivo principal es determinar que la versión actual del software es lo suficientemente estable y que los cambios recientes no han perjudicado las funcionalidades existentes.

Framework: Cypress 15.18.0
Autor: Lizeth Garcia - QA Engineer
Fecha de creación: 2026-06-24

# Estructura del proyecto

creai-smoke-tests/
├── cypress/
│   ├── e2e/
│   │   └── smoke/
│   │       ├── 01_page_load.cy.js        # Carga y estabilidad inicial
│   │       ├── 02_key_elements.cy.js     # UI y componentes core
│   │       ├── 03_navigation.cy.js       # Flujos y enlaces
│   │       └── 04_mobile_viewport.cy.js  # Responsive Design
│   └── support/
├── cypress.config.js
├── package.json
└── README.md


