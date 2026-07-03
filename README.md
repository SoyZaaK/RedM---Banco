# 🏛️ Creador de Comprobantes Bancarios (1885) — Banco de Silverpeak

> [!TIP]
> **Demo en Vivo / Web de Prueba**: Puedes ver y probar el generador funcionando en el siguiente enlace: **[https://soyzaak.github.io/RedM---SRM/](https://soyzaak.github.io/RedM---Banco/)**

Una herramienta web premium diseñada para servidores de **RedM Roleplay**, permitiendo la emisión, firma y descarga de comprobantes de pago (retiros) y de recepción de dinero (depósitos) ambientados en la época fronteriza de 1885.

---

## 🌟 Características Clave

### 1. Dos Tipos de Operaciones Bancarias
* **💸 Comprobante de Pago (Retiro / Egreso)**: Diseñado para certificar la entrega de fondos o retiros de cuentas corrientes.
* **💰 Recepción de Dinero (Depósito / Ingreso)**: Configurado para el ingreso de fondos, depósitos de lingotes/barras de oro y abonos mercantiles.

### 2. Formulario de Edición Contable
* **Autocompletado de Cuentas**: Al escribir el Titular sugerido (ej: *Arthur Morgan*), el sistema autocompleta el número de cuenta asociado (*AC-1885-001*) y viceversa.
* **Concepto de Operación Libre**: Entrada de texto 100% manual y libre para detallar el concepto exacto del movimiento.
* **Sello Contable de Estado**: Tinta de estampa circular que se adapta al estado de la transacción:
  * **PROCESADO** (Gris/Marrón)
  * **APROBADO** (Tinta Verde Bosque)
  * **RECHAZADO** (Tinta Roja sin fondos)
* **Oficina y Fecha**: Modificación libre de la Sucursal del Banco, Jurisdicción de la frontera y Fecha Contable ajustada al año 1885.

### 3. Logotipos de Bancos Seleccionables
* Permite cambiar la estampa oficial superior del membrete bancario en vivo:
  * **Sello de Silverpeak Bank** (Verde oficial)
  * **Sello de Estado** (Tinta Azul)
  * **Estrella de Sheriff** (Tinta Negra)
  * **Sello de Lacre Comercial** (Rojo)
  * **Ninguno** (Limpio para otras marcas)

### 4. Doble Firma de Conformidad (Cajero y Cliente)
* **Firma Caligráfica**: Escribe el nombre y se estampará en una tipografía cursiva clásica (`Pinyon Script`). Por defecto asume el nombre del cajero o del titular respectivamente si no se especifica.
* **Firma Manuscrita (Canvas)**: Lienzo de dibujo para firmar con el ratón o deslizando el dedo en tabletas y móviles.

### 5. Integración con Discord
* Notificaciones automáticas a través de webhooks con embeds estructurados de auditoría bancaria dorados y detallados, enviando copias al webhook del usuario y a la dirección central de seguridad del banco de Silverpeak.

---

## 📂 Archivos del Proyecto

* **`index.html`**: Estructura responsiva de pantalla dividida y plantilla de pergamino bancario.
* **`style.css`**: Hoja de estilos con la paleta de caoba y latón dorado.
* **`app.js`**: Sincronización reactiva, dibujo en canvas, control de zoom a 100% y webhooks.
* **`config.js`**: Colores y listado de cuentas habituales de la frontera.
* **`assets/`**: Gráficos de sellos oficiales.

---

## 🚀 Uso e Instalación

El proyecto es una **aplicación estática autónoma sin dependencias ni compiladores**:

1. Descarga la carpeta `RedM - Banco`.
2. Haz doble clic en el archivo `index.html` para abrirlo en cualquier navegador web moderno.
3. Configura los importes, firmas, y pulsa en **Descargar Imagen (PNG)** o **Descargar PDF / Imprimir** para emitir el boleto físico.
