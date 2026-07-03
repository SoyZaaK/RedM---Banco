// =================================================================
// CONFIGURACIÓN CENTRALIZADA - BANCO DE SILVERPEAK (1885)
// =================================================================

const BancoConfig = {
    // 🏷️ Información General de la Web
    appName: "Banco de Silverpeak",
    appSubtitle: "Libro contable y comprobantes de transacciones bancarias - 1885",
    serverLogoText: "Silverpeak Bank",
    discordUrl: "https://discord.gg/silverpeakroleplay",

    // 🎨 Colores del Tema (Inyectados dinámicamente en el CSS :root)
    colors: {
        bgDark: "#0c0a07",             // Fondo principal (Madera muy oscura/Bóveda)
        bgCard: "#17120c",             // Fondo de tarjetas y paneles (Caoba profundo)
        bgInput: "#241b12",            // Fondo de inputs y cajas secundarias
        border: "#33261a",             // Bordes de latón/madera
        borderLight: "rgba(201, 154, 78, 0.25)", // Bordes iluminados en oro envejecido
        
        // 💛 Acentos Dorados / Bronce
        primaryOrange: "#c99a4e",       // Oro de banquero principal
        primaryOrangeHover: "#dec483",  // Oro brillante hover
        accentGold: "#a37e3b",          // Bronce viejo de bóveda
        accentGoldHover: "#b89552",     // Bronce hover
        
        // 💬 Textos
        textLight: "#f5eee0",           // Texto principal (Papel crema bancario)
        textMuted: "#a89582",           // Texto secundario (Tierra/Beige apagado)
        
        // ✨ Brillo y sombras
        orangeGlow: "rgba(201, 154, 78, 0.22)" // Resplandor dorado de latón
    },

    // 📋 Sugerencias para Autocompletar Conceptos de Transacciones
    defaultConcepts: [
        "Depósito de barras de oro",
        "Retiro de fondos corrientes",
        "Pago de licencias comerciales",
        "Depósito de aranceles de importación",
        "Transferencia de capital mercantil",
        "Pago de salarios de la frontera",
        "Depósito de recaudación fiscal",
        "Pago de fianza federal",
        "Compra de bonos del tesoro"
    ],

    // 🏦 Cuentas Frecuentes Sugeridas
    defaultAccounts: [
        { account: "AC-1885-001", holder: "Comisaría de Valentine" },
        { account: "AC-1885-002", holder: "Comisaría de Rhodes" },
        { account: "AC-1885-003", holder: "Comisaría de Saint Denis" },
        { account: "AC-1885-004", holder: "Comisaría de Blackwater" },
        { account: "AC-1885-010", holder: "Destilería Lemoyne S.A." },
        { account: "AC-1885-025", holder: "Cornwall Kerosene & Tar" },
        { account: "AC-1885-080", holder: "Rancho de Emerald" }
    ]
};
