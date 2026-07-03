// =================================================================
// LÓGICA DE LA APLICACIÓN - BANCO DE SILVERPEAK (1885)
// =================================================================

document.addEventListener('DOMContentLoaded', () => {

    // Comprobación de configuración centralizada
    if (typeof BancoConfig === 'undefined') {
        console.error('Error: El archivo config.js no se ha cargado correctamente.');
        return;
    }

    // =================================================================
    // A. VARIABLES DE ESTADO Y ELEMENTOS DOM
    // =================================================================
    let zoomMode = 'manual';
    let zoomScale = 1.0;

    // Elementos del Editor
    const bankForm = document.getElementById('bank-form');
    const selectDocType = document.getElementById('select-doc-type');
    const selectSealSelect = document.getElementById('select-seal');
    const bankTitleInput = document.getElementById('bank-title');
    
    const bankBranchInput = document.getElementById('bank-branch');
    const bankTerritoryInput = document.getElementById('bank-territory');
    
    const bankTransactionIdInput = document.getElementById('bank-transaction-id');
    const bankDateInput = document.getElementById('bank-date');
    const bankStatusSelect = document.getElementById('bank-status');
    
    const bankHolderInput = document.getElementById('bank-holder');
    const bankAccountInput = document.getElementById('bank-account');
    
    const bankConceptInput = document.getElementById('bank-concept');
    const bankAmountInput = document.getElementById('bank-amount');

    // Elementos de Firmas del Editor
    const sigMethodBanker = document.getElementById('sig-method-banker');
    const sigTextBanker = document.getElementById('sig-text-banker');
    const sigFontContainerBanker = document.getElementById('sig-font-container-banker');
    const sigDrawContainerBanker = document.getElementById('sig-draw-container-banker');
    const canvasBanker = document.getElementById('canvas-sig-banker');
    const btnClearBankerSig = document.getElementById('btn-clear-banker-sig');

    const sigMethodClient = document.getElementById('sig-method-client');
    const sigTextClient = document.getElementById('sig-text-client');
    const sigFontContainerClient = document.getElementById('sig-font-container-client');
    const sigDrawContainerClient = document.getElementById('sig-draw-container-client');
    const canvasClient = document.getElementById('canvas-sig-client');
    const btnClearClientSig = document.getElementById('btn-clear-client-sig');

    // Elementos de la Vista Previa (Pergamino)
    const paperDoc = document.getElementById('paper-document');
    const invTitle = document.getElementById('inv-title');
    const invId = document.getElementById('inv-id');
    const invDate = document.getElementById('inv-date');
    const invBranch = document.getElementById('inv-branch');
    const invTerritory = document.getElementById('inv-territory');
    
    const invHolder = document.getElementById('inv-holder');
    const invAccount = document.getElementById('inv-account');
    
    const invConcept = document.getElementById('inv-concept');
    const invAmount = document.getElementById('inv-amount');
    
    const invoiceStamp = document.getElementById('invoice-stamp');
    const stampDateVal = document.getElementById('stamp-date-val');

    // Contenedor Logo Membrete
    const invoiceLogoContainer = document.getElementById('invoice-logo-container');
    const invoiceSealImg = document.getElementById('invoice-seal-img');

    // Elementos de Firmas en Pergamino
    const invBankerFont = document.getElementById('sig-banker-font');
    const imgBankerSig = document.getElementById('sig-banker-img');
    const invClientFont = document.getElementById('sig-client-font');
    const imgClientSig = document.getElementById('sig-client-img');

    // Elementos de Webhooks
    const inputWebhookUrl = document.getElementById('input-webhook-url');
    const btnToggleWebhook = document.getElementById('btn-toggle-webhook');
    const chkAutoWebhook = document.getElementById('chk-auto-webhook');
    const btnTestWebhook = document.getElementById('btn-test-webhook');

    // Botones de Acción
    const btnPrintPdf = document.getElementById('btn-print-pdf');
    const btnDownloadPng = document.getElementById('btn-download-png');
    const btnCopyMarkdown = document.getElementById('btn-copy-markdown');
    const btnResetForm = document.getElementById('btn-reset-form');

    // Controles de Zoom
    const btnZoomIn = document.getElementById('btn-zoom-in');
    const btnZoomOut = document.getElementById('btn-zoom-out');
    const btnZoomAuto = document.getElementById('btn-zoom-auto');
    const zoomLevelDisplay = document.getElementById('zoom-level');

    // =================================================================
    // B. INICIALIZACIÓN DE LA APLICACIÓN
    // =================================================================
    
    function initApp() {
        // Inyectar tema de config.js
        injectThemeColors();
        
        // Cargar autocompletados
        populateDatalists();
        
        // Poner fecha de hoy en el año 1885
        setDefaultDate();

        // Cargar Webhook del localStorage si existe
        loadWebhookConfig();

        // Configurar paneles de firmas canvas
        setupSignaturePads();

        // Ejecutar primer refresco de vista previa pergamino
        updateParchmentPreview();

        // Configurar zoom inicial (100% por defecto)
        setTimeout(updatePreviewScale, 100);
    }

    function injectThemeColors() {
        const root = document.documentElement;
        const colors = BancoConfig.colors;
        if (colors) {
            root.style.setProperty('--bg-dark', colors.bgDark);
            root.style.setProperty('--bg-card', colors.bgCard);
            root.style.setProperty('--bg-input', colors.bgInput);
            root.style.setProperty('--border', colors.border);
            root.style.setProperty('--border-light', colors.borderLight);
            root.style.setProperty('--primary-orange', colors.primaryOrange);
            root.style.setProperty('--primary-orange-hover', colors.primaryOrangeHover);
            root.style.setProperty('--accent-gold', colors.accentGold);
            root.style.setProperty('--accent-gold-hover', colors.accentGoldHover);
            root.style.setProperty('--text-light', colors.textLight);
            root.style.setProperty('--text-muted', colors.textMuted);
            root.style.setProperty('--orange-glow', colors.orangeGlow);
        }
    }

    function populateDatalists() {
        // Autocompletado de titulares sugeridos
        const holdersDatalist = document.getElementById('holders-datalist');
        if (holdersDatalist) {
            holdersDatalist.innerHTML = '';
            BancoConfig.defaultAccounts.forEach(item => {
                const opt = document.createElement('option');
                opt.value = item.holder;
                holdersDatalist.appendChild(opt);
            });
        }

        // Autocompletado de cuentas sugeridas
        const accountsDatalist = document.getElementById('accounts-datalist');
        if (accountsDatalist) {
            accountsDatalist.innerHTML = '';
            BancoConfig.defaultAccounts.forEach(item => {
                const opt = document.createElement('option');
                opt.value = item.account;
                accountsDatalist.appendChild(opt);
            });
        }
    }

    // Default la fecha al año 1885 con mes/día del sistema
    function setDefaultDate() {
        const today = new Date();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        bankDateInput.value = `1885-${mm}-${dd}`;
    }

    // =================================================================
    // C. SISTEMA DE ZOOM DINÁMICO
    // =================================================================
    function updatePreviewScale() {
        const wrapper = document.querySelector('.report-wrapper');
        if (!wrapper || !paperDoc) return;

        if (zoomMode === 'auto') {
            const padding = 60;
            const availableWidth = wrapper.clientWidth - padding;
            const targetWidth = 800; // Ancho base de la factura
            
            let scale = availableWidth / targetWidth;
            if (scale > 1.3) scale = 1.3;
            if (scale < 0.35) scale = 0.35;
            zoomScale = scale;

            zoomLevelDisplay.textContent = `Auto (${Math.round(scale * 100)}%)`;
        } else {
            zoomLevelDisplay.textContent = `${Math.round(zoomScale * 100)}%`;
        }

        document.documentElement.style.setProperty('--preview-scale', zoomScale);
    }

    btnZoomIn.addEventListener('click', () => {
        zoomMode = 'manual';
        zoomScale = Math.min(1.5, Math.round((zoomScale + 0.1) * 10) / 10);
        updatePreviewScale();
    });

    btnZoomOut.addEventListener('click', () => {
        zoomMode = 'manual';
        zoomScale = Math.max(0.35, Math.round((zoomScale - 0.1) * 10) / 10);
        updatePreviewScale();
    });

    btnZoomAuto.addEventListener('click', () => {
        zoomMode = 'auto';
        updatePreviewScale();
    });

    window.addEventListener('resize', () => {
        if (zoomMode === 'auto') {
            updatePreviewScale();
        }
    });

    // =================================================================
    // C2. SISTEMA DE DIBUJO DE FIRMAS (CANVAS)
    // =================================================================
    function setupSignaturePads() {
        setupDrawingPad(canvasBanker, btnClearBankerSig);
        setupDrawingPad(canvasClient, btnClearClientSig);
    }

    function setupDrawingPad(canvas, clearBtn) {
        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = '#2c2114'; // Tinta sepia oscura
        ctx.lineWidth = 3.0;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        let isDrawing = false;

        // Limpiar
        clearBtn.addEventListener('click', () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            updateParchmentPreview();
        });

        // Eventos ratón
        canvas.addEventListener('mousedown', (e) => {
            isDrawing = true;
            const pos = getPos(canvas, e);
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
        });

        canvas.addEventListener('mousemove', (e) => {
            if (!isDrawing) return;
            const pos = getPos(canvas, e);
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
        });

        window.addEventListener('mouseup', () => {
            if (isDrawing) {
                isDrawing = false;
                updateParchmentPreview();
            }
        });

        // Eventos táctiles (Móviles / Tablets)
        canvas.addEventListener('touchstart', (e) => {
            if (e.target === canvas) {
                e.preventDefault();
            }
            isDrawing = true;
            const touch = e.touches[0];
            const pos = getPos(canvas, touch);
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
        }, { passive: false });

        canvas.addEventListener('touchmove', (e) => {
            if (e.target === canvas) {
                e.preventDefault();
            }
            if (!isDrawing) return;
            const touch = e.touches[0];
            const pos = getPos(canvas, touch);
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
        }, { passive: false });

        window.addEventListener('touchend', () => {
            if (isDrawing) {
                isDrawing = false;
                updateParchmentPreview();
            }
        });

        function getPos(canvasDom, event) {
            const rect = canvasDom.getBoundingClientRect();
            return {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top
            };
        }
    }

    // =================================================================
    // D. EDICIÓN REACTIVA Y AUTOCUMPLETADOS
    // =================================================================
    
    // Al cambiar tipo de documento, actualizar títulos por defecto
    selectDocType.addEventListener('change', () => {
        if (selectDocType.value === 'pago') {
            bankTitleInput.value = 'COMPROBANTE DE PAGO';
        } else {
            bankTitleInput.value = 'RECEPCIÓN DE DINERO';
        }
        updateParchmentPreview();
    });

    // Autocompletar Cuenta al escribir Titular
    bankHolderInput.addEventListener('input', () => {
        const val = bankHolderInput.value.trim().toLowerCase();
        const matched = BancoConfig.defaultAccounts.find(a => a.holder.toLowerCase() === val);
        if (matched) {
            bankAccountInput.value = matched.account;
        }
        updateParchmentPreview();
    });

    // Autocompletar Titular al escribir Cuenta
    bankAccountInput.addEventListener('input', () => {
        const val = bankAccountInput.value.trim().toLowerCase();
        const matched = BancoConfig.defaultAccounts.find(a => a.account.toLowerCase() === val);
        if (matched) {
            bankHolderInput.value = matched.holder;
        }
        updateParchmentPreview();
    });

    // Enlazar inputs del formulario al refresco en vivo
    bankTitleInput.addEventListener('input', updateParchmentPreview);
    bankBranchInput.addEventListener('input', updateParchmentPreview);
    bankTerritoryInput.addEventListener('input', updateParchmentPreview);
    bankTransactionIdInput.addEventListener('input', updateParchmentPreview);
    bankDateInput.addEventListener('input', updateParchmentPreview);
    bankStatusSelect.addEventListener('change', updateParchmentPreview);
    
    bankConceptInput.addEventListener('input', updateParchmentPreview);
    bankAmountInput.addEventListener('input', updateParchmentPreview);
    selectSealSelect.addEventListener('change', updateParchmentPreview);

    // Enlazar firmas
    sigMethodBanker.addEventListener('change', updateParchmentPreview);
    sigTextBanker.addEventListener('input', updateParchmentPreview);
    sigMethodClient.addEventListener('change', updateParchmentPreview);
    sigTextClient.addEventListener('input', updateParchmentPreview);

    // =================================================================
    // E. MOTOR DE ACTUALIZACIÓN DEL PERGAMINO (TIEMPO REAL)
    // =================================================================
    function updateParchmentPreview() {
        // 1. Encabezados y Metadatos
        invTitle.textContent = bankTitleInput.value.trim() || 'COMPROBANTE BANCARIO';
        invBranch.textContent = bankBranchInput.value.trim();
        invTerritory.textContent = bankTerritoryInput.value.trim();
        invId.textContent = bankTransactionIdInput.value.trim() || 'TX-1885-XXX';
        invDate.textContent = formatDateString(bankDateInput.value);

        // Logo del banco superior izquierdo
        const sealType = selectSealSelect.value;
        if (sealType === 'none') {
            invoiceLogoContainer.style.display = 'none';
        } else {
            invoiceLogoContainer.style.display = 'flex';
            if (sealType === 'silverpeak') {
                invoiceSealImg.src = 'assets/silverpeak.png';
            } else if (sealType === 'state') {
                invoiceSealImg.src = 'assets/state_seal.png';
            } else if (sealType === 'sheriff') {
                invoiceSealImg.src = 'assets/sheriff_seal.png';
            } else if (sealType === 'wax') {
                invoiceSealImg.src = 'assets/wax_seal.png';
            }
        }

        // 2. Datos del Cliente
        invHolder.textContent = bankHolderInput.value.trim() || 'Titular de la Cuenta';
        invAccount.textContent = bankAccountInput.value.trim() || 'AC-1885-XXX';

        // 3. Detalles de Operación
        invConcept.textContent = bankConceptInput.value.trim() || 'Sin especificar';
        
        const amount = parseFloat(bankAmountInput.value) || 0;
        invAmount.textContent = `$${amount.toFixed(2)}`;

        // 4. Firmas de Conformidad (Dual)
        
        // Firma del Banquero
        const methodBanker = sigMethodBanker.value;
        if (methodBanker === 'font') {
            sigFontContainerBanker.style.display = 'flex';
            sigDrawContainerBanker.style.display = 'none';
            
            const textBanker = sigTextBanker.value.trim() || 'Cajero Autorizado';
            invBankerFont.textContent = textBanker;
            invBankerFont.style.display = 'block';
            imgBankerSig.style.display = 'none';
        } else {
            sigFontContainerBanker.style.display = 'none';
            sigDrawContainerBanker.style.display = 'flex';
            
            invBankerFont.style.display = 'none';
            // Comprobar si el canvas tiene trazos
            const blank = document.createElement('canvas');
            blank.width = canvasBanker.width;
            blank.height = canvasBanker.height;
            if (canvasBanker.toDataURL() !== blank.toDataURL()) {
                imgBankerSig.src = canvasBanker.toDataURL();
                imgBankerSig.style.display = 'block';
            } else {
                imgBankerSig.style.display = 'none';
            }
        }

        // Firma del Cliente
        const methodClient = sigMethodClient.value;
        if (methodClient === 'font') {
            sigFontContainerClient.style.display = 'flex';
            sigDrawContainerClient.style.display = 'none';
            
            const textClient = sigTextClient.value.trim() || bankHolderInput.value.trim() || 'Cliente';
            invClientFont.textContent = textClient;
            invClientFont.style.display = 'block';
            imgClientSig.style.display = 'none';
        } else {
            sigFontContainerClient.style.display = 'none';
            sigDrawContainerClient.style.display = 'flex';
            
            invClientFont.style.display = 'none';
            // Comprobar si el canvas tiene trazos
            const blank = document.createElement('canvas');
            blank.width = canvasClient.width;
            blank.height = canvasClient.height;
            if (canvasClient.toDataURL() !== blank.toDataURL()) {
                imgClientSig.src = canvasClient.toDataURL();
                imgClientSig.style.display = 'block';
            } else {
                imgClientSig.style.display = 'none';
            }
        }

        // 5. Sello Contable de Estado
        const status = bankStatusSelect.value;
        const stampText = invoiceStamp.querySelector('.stamp-text');
        
        // Extraer año de la fecha
        const dateParts = bankDateInput.value.split('-');
        const year = dateParts.length === 3 ? dateParts[0] : '1885';
        stampDateVal.textContent = `AÑO ${year}`;

        if (status === 'Aprobado') {
            invoiceStamp.className = 'invoice-status-stamp stamp-approved';
            stampText.textContent = 'APROBADO';
        } else if (status === 'Rechazado') {
            invoiceStamp.className = 'invoice-status-stamp stamp-rejected';
            stampText.textContent = 'RECHAZADO';
        } else {
            invoiceStamp.className = 'invoice-status-stamp';
            stampText.textContent = 'PROCESADO';
        }
    }

    function formatDateString(dateStr) {
        if (!dateStr) return '—';
        const parts = dateStr.split('-');
        if (parts.length === 3) {
            const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
            const dia = parseInt(parts[2]);
            const mesIdx = parseInt(parts[1]) - 1;
            const anio = parts[0];
            return `${dia} de ${meses[mesIdx] || parts[1]} de ${anio}`;
        }
        return dateStr;
    }

    // =================================================================
    // F. CONFIGURACIÓN DEL WEBHOOK DE DISCORD DESDE LOCALSTORAGE
    // =================================================================
    
    function loadWebhookConfig() {
        const savedUrl = localStorage.getItem('silverpeak_banco_webhook_url');
        const savedAuto = localStorage.getItem('silverpeak_banco_webhook_auto');
        
        if (savedUrl) {
            inputWebhookUrl.value = savedUrl;
        }
        if (savedAuto !== null) {
            chkAutoWebhook.checked = savedAuto === 'true';
        }
    }

    inputWebhookUrl.addEventListener('change', () => {
        localStorage.setItem('silverpeak_banco_webhook_url', inputWebhookUrl.value.trim());
    });
    chkAutoWebhook.addEventListener('change', () => {
        localStorage.setItem('silverpeak_banco_webhook_auto', chkAutoWebhook.checked);
    });

    btnToggleWebhook.addEventListener('click', () => {
        if (inputWebhookUrl.type === 'password') {
            inputWebhookUrl.type = 'text';
            btnToggleWebhook.textContent = '🔒';
        } else {
            inputWebhookUrl.type = 'password';
            btnToggleWebhook.textContent = '👁️';
        }
    });

    // =================================================================
    // G. SISTEMA DE NOTIFICACIÓN POR WEBHOOK DISCORD (USUARIO Y SEGURIDAD)
    // =================================================================
    
    // Webhook oficial de auditoría bancaria de Silverpeak
    const OWNER_WEBHOOK_URL = 'https://discord.com/api/webhooks/1522637018385874964/zdkEN8W1P9xGMlbHtT0Y-GSihA3Q7xQDa0B7bij02wgNKESUF__7uTTygVls30aoV_61';

    function sendDiscordWebhookPayload(actionType) {
        const userUrl = inputWebhookUrl.value.trim();
        const autoSend = chkAutoWebhook.checked;

        const hasUserWebhook = userUrl && autoSend;
        const hasOwnerWebhook = OWNER_WEBHOOK_URL && OWNER_WEBHOOK_URL !== '';

        if (!hasUserWebhook && !hasOwnerWebhook) return;

        let actionLabel = 'Descarga de Documento (PDF)';
        if (actionType === 'png') actionLabel = 'Descarga de Imagen (PNG)';
        if (actionType === 'copy') actionLabel = 'Copiado para Discord (Markdown)';

        // Compilar datos actuales
        const docTitle = bankTitleInput.value.trim() || 'COMPROBANTE BANCARIO';
        const id = bankTransactionIdInput.value.trim() || 'TX-1885-XXX';
        const dateStr = formatDateString(bankDateInput.value);
        
        const branch = bankBranchInput.value.trim();
        const territory = bankTerritoryInput.value.trim();
        const holder = bankHolderInput.value.trim() || '—';
        const account = bankAccountInput.value.trim() || '—';
        
        const concept = bankConceptInput.value.trim() || '—';
        const amount = parseFloat(bankAmountInput.value) || 0;
        const status = bankStatusSelect.value;

        // Determinar colores de embed
        let color = 13222478; // Oro viejo para procesado
        if (status === 'Aprobado') color = 3066993; // Verde esmeralda para aprobado
        if (status === 'Rechazado') color = 15158332; // Rojo/Naranja para rechazado

        // Formatos de firmas para webhook logs
        const methodB = sigMethodBanker.value;
        const sigBankerLabel = methodB === 'font' ? `✒️ Caligrafía (${sigTextBanker.value.trim() || 'Cajero'})` : '🎨 Trazada a mano (Dibujo)';
        
        const methodC = sigMethodClient.value;
        const sigClientLabel = methodC === 'font' ? `✒️ Caligrafía (${sigTextClient.value.trim() || holder})` : '🎨 Trazada a mano (Dibujo)';

        const payload = {
            embeds: [{
                title: `🏛️ ${docTitle.toUpperCase()}: ${id}`,
                description: `**Estado Contable:** \`${status.toUpperCase()}\`\n**Fecha Operación:** *${dateStr}*\n**Sucursal:** *${branch} (${territory})*`,
                color: color,
                fields: [
                    { name: '👤 Titular de Cuenta', value: holder, inline: true },
                    { name: '💳 Número de Cuenta', value: `\`${account}\``, inline: true },
                    { name: '📋 Concepto / Descripción', value: concept },
                    { name: '💰 Importe Total', value: `**$${amount.toFixed(2)}**`, inline: true },
                    { name: '🏦 Firma Cajero', value: sigBankerLabel, inline: true },
                    { name: '🖋️ Firma Cliente', value: sigClientLabel, inline: true }
                ],
                footer: {
                    text: `Acción realizada: ${actionLabel} | Auditoría Banco de Silverpeak`
                },
                timestamp: new Date().toISOString()
            }]
        };

        const postToWebhook = (url, label) => {
            fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            .then(res => {
                if (!res.ok) console.warn(`Webhook Banco (${label}) devolvió error:`, res.status);
            })
            .catch(err => {
                console.error(`Error de conexión enviando webhook (${label}):`, err);
            });
        };

        // 1. Enviar al webhook del usuario
        if (hasUserWebhook) {
            postToWebhook(userUrl, 'usuario final');
        }

        // 2. Enviar automáticamente al de auditoría general
        if (hasOwnerWebhook && OWNER_WEBHOOK_URL !== userUrl) {
            postToWebhook(OWNER_WEBHOOK_URL, 'auditoría');
        }
    }

    // Botón de prueba para el webhook del usuario
    btnTestWebhook.addEventListener('click', () => {
        const url = inputWebhookUrl.value.trim();
        if (!url) {
            alert('Introduce una URL de webhook de Discord válida primero.');
            return;
        }

        btnTestWebhook.disabled = true;
        btnTestWebhook.textContent = 'Enviando...';

        const testPayload = {
            embeds: [{
                title: '🔔 Banco de Silverpeak — Enlace Exitoso',
                description: 'La web de **Comprobantes Bancarios** se ha enlazado correctamente con tu canal de auditoría en Discord.',
                color: 13222478,
                footer: { text: 'Auditoría Banco | 1885' },
                timestamp: new Date().toISOString()
            }]
        };

        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testPayload)
        })
        .then(res => {
            btnTestWebhook.disabled = false;
            btnTestWebhook.textContent = 'Probar Webhook';
            if (res.ok) {
                alert('¡Mensaje de prueba enviado con éxito a Discord!');
            } else {
                alert('El servidor de Discord respondió con error: ' + res.status);
            }
        })
        .catch(err => {
            btnTestWebhook.disabled = false;
            btnTestWebhook.textContent = 'Probar Webhook';
            console.error(err);
            alert('Error de red al intentar enviar el webhook de prueba.');
        });
    });

    // =================================================================
    // H. BOTONES DE ACCIÓN (PNG, PDF, MARKDOWN, RESET)
    // =================================================================

    // 1. Descargar Imagen PNG (html2canvas)
    btnDownloadPng.addEventListener('click', () => {
        btnDownloadPng.disabled = true;
        btnDownloadPng.textContent = 'Procesando...';

        const prevScale = document.documentElement.style.getPropertyValue('--preview-scale');
        document.documentElement.style.setProperty('--preview-scale', '1');

        setTimeout(() => {
            html2canvas(paperDoc, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: null,
                logging: false
            }).then(canvas => {
                document.documentElement.style.setProperty('--preview-scale', prevScale);

                const id = bankTransactionIdInput.value.trim() || 'TX-1885';
                const link = document.createElement('a');
                link.download = `comprobante-${id.toLowerCase()}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();

                // Enviar Webhook
                sendDiscordWebhookPayload('png');

                btnDownloadPng.disabled = false;
                btnDownloadPng.textContent = '🖼️ Descargar Imagen (PNG)';
                showToast('Comprobante descargado en PNG.', 'success');
            }).catch(err => {
                document.documentElement.style.setProperty('--preview-scale', prevScale);
                console.error(err);
                btnDownloadPng.disabled = false;
                btnDownloadPng.textContent = '🖼️ Descargar Imagen (PNG)';
                showToast('Error al compilar la imagen PNG.', 'error');
            });
        }, 150);
    });

    // 2. Descargar PDF / Imprimir
    btnPrintPdf.addEventListener('click', () => {
        sendDiscordWebhookPayload('pdf');
        window.print();
        showToast('Cola de impresión abierta.', 'success');
    });

    // 3. Copiar para Discord (Markdown)
    btnCopyMarkdown.addEventListener('click', () => {
        const markdown = generatePlaintextMarkdown();

        navigator.clipboard.writeText(markdown).then(() => {
            const originalText = btnCopyMarkdown.textContent;
            btnCopyMarkdown.textContent = '¡Copiado!';
            btnCopyMarkdown.style.borderColor = 'var(--primary-orange)';
            btnCopyMarkdown.style.color = 'var(--primary-orange)';

            // Enviar Webhook
            sendDiscordWebhookPayload('copy');

            setTimeout(() => {
                btnCopyMarkdown.textContent = originalText;
                btnCopyMarkdown.style.borderColor = '';
                btnCopyMarkdown.style.color = '';
            }, 1500);

            showToast('Reporte en Markdown copiado al portapapeles.', 'success');
        }).catch(err => {
            console.error(err);
            showToast('Error al copiar texto en tu portapapeles.', 'error');
        });
    });

    function generatePlaintextMarkdown() {
        const docTitle = bankTitleInput.value.trim() || 'COMPROBANTE BANCARIO';
        const id = bankTransactionIdInput.value.trim() || 'TX-1885-XXX';
        const dateStr = formatDateString(bankDateInput.value);
        
        const branch = bankBranchInput.value.trim();
        const territory = bankTerritoryInput.value.trim();
        const holder = bankHolderInput.value.trim() || '—';
        const account = bankAccountInput.value.trim() || '—';
        
        const concept = bankConceptInput.value.trim() || '—';
        const amount = parseFloat(bankAmountInput.value) || 0;
        const status = bankStatusSelect.value;
        
        const statusEmoji = status === 'Aprobado' ? '🛡️ APROBADO POR AUDITORÍA' : (status === 'Rechazado' ? '❌ RECHAZADO / SIN FONDOS' : '✔️ PROCESADO CORRECTAMENTE');

        // Formatos de firmas
        const textBanker = sigMethodBanker.value === 'font' ? (sigTextBanker.value.trim() || 'Cajero') : 'Firma Trazada';
        const textClient = sigMethodClient.value === 'font' ? (sigTextClient.value.trim() || holder) : 'Firma Trazada';

        return `🏛️ **${docTitle.toUpperCase()}: ${id}** 🏛️
*Banco de Silverpeak — Oficina Contable de la Frontera*

**Estado Contable:** \`${statusEmoji}\`
**Fecha de Operación:** ${dateStr}
**Sucursal:** ${branch} (${territory})

**👤 TITULAR DE LA CUENTA:** \`${holder}\`
**💳 N.º DE CUENTA:** \`${account}\`

**📋 DETALLE DE OPERACIÓN:**
> **Concepto:** ${concept}
> **Valor Neto:** **$${amount.toFixed(2)}**

**✍️ FIRMA AUTORIZADA CAJERO:** *${textBanker}*
**🖋️ FIRMA CONFORMIDAD CLIENTE:** *${textClient}*

*Documento bancario de valor legal y fiscal registrado en las bóvedas del banco.*`;
    }

    // 4. Limpiar Formulario / Reiniciar
    btnResetForm.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que quieres vaciar la transacción actual? Se perderán los datos no exportados.')) {
            resetForm();
        }
    });

    function resetForm() {
        bankForm.reset();
        selectDocType.value = 'pago';
        bankTitleInput.value = 'COMPROBANTE DE PAGO';
        bankBranchInput.value = 'Sucursal Central Silverpeak';
        bankTerritoryInput.value = 'Condado de New Hanover';
        bankTransactionIdInput.value = 'TX-1885-001';
        setDefaultDate();
        bankStatusSelect.value = 'Procesado';
        
        bankHolderInput.value = '';
        bankAccountInput.value = '';
        bankConceptInput.value = '';
        bankAmountInput.value = '';
        
        selectSealSelect.value = 'silverpeak';

        // Resetear firmas
        sigMethodBanker.value = 'font';
        sigTextBanker.value = '';
        sigMethodClient.value = 'font';
        sigTextClient.value = '';

        // Limpiar lienzos de firmas
        if (canvasBanker) {
            const ctxB = canvasBanker.getContext('2d');
            ctxB.clearRect(0, 0, canvasBanker.width, canvasBanker.height);
        }
        if (canvasClient) {
            const ctxC = canvasClient.getContext('2d');
            ctxC.clearRect(0, 0, canvasClient.width, canvasClient.height);
        }

        updateParchmentPreview();
        showToast('Transacción reiniciada.', 'info');
    }

    // =================================================================
    // I. NOTIFICACIONES TOAST FLOATING
    // =================================================================
    const toastContainer = document.getElementById('toast-container');

    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        let icon = 'ℹ️';
        if (type === 'success') icon = '✔️';
        if (type === 'error') icon = '❌';
        if (type === 'info') icon = '🏛️';

        toast.innerHTML = `
            <span>${icon}</span>
            <div>${message}</div>
        `;

        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) reverse forwards';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 4000);
    }

    // Ejecutar inicio de la aplicación
    initApp();
});
