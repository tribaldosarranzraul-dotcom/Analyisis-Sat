// Datos de ejemplo para simulación
const sampleData = {
    ARKK: {
        name: "ARK Innovation ETF",
        type: "Fondo Satélite",
        color: "#3498db",
        sector: "Tecnología Disruptiva",
        valuation: { pe: 24.5, ps: 8.2, evEbitda: 18.3, pb: 3.1 },
        growth: { revenue: 15.2, earnings: -5.4, cashFlow: 12.8 },
        risk: { volatility: 38.2, beta: 1.45, maxDrawdown: -52 },
        performance: [100, 105, 98, 110, 115, 108, 120, 125, 118, 122, 130, 135],
        catalysts: ["Decisión Fed tasas de interés", "Nuevas regulaciones tech"],
        checklist: [true, false, true, true]
    },
    TSLA: {
        name: "Tesla Inc.",
        type: "Empresa Satélite",
        color: "#27ae60",
        sector: "Vehiculos Eléctricos",
        valuation: { pe: 68.2, ps: 12.5, evEbitda: 42.1, pb: 18.3 },
        growth: { revenue: 45.3, earnings: 120.5, cashFlow: 68.2 },
        risk: { volatility: 52.1, beta: 1.85, maxDrawdown: -42 },
        performance: [100, 110, 115, 120, 125, 130, 135, 140, 138, 145, 150, 155],
        catalysts: ["Lanzamiento Cybertruck", "Expansión fábricas internacionales"],
        checklist: [true, true, true, true]
    },
    MRNA: {
        name: "Moderna Inc.",
        type: "Empresa Satélite",
        color: "#e74c3c",
        sector: "Biotecnología",
        valuation: { pe: 8.5, ps: 3.2, evEbitda: 5.8, pb: 2.1 },
        growth: { revenue: -25.8, earnings: -65.2, cashFlow: -18.5 },
        risk: { volatility: 45.6, beta: 1.25, maxDrawdown: -68 },
        performance: [100, 95, 90, 92, 88, 85, 82, 80, 78, 75, 73, 70],
        catalysts: ["Resultados fase 3 vacuna gripe", "Nuevos partnerships"],
        checklist: [false, false, true, false]
    }
};

// Variables globales
let valuationChart, growthChart, riskChart, performanceChart;
let selectedAssets = [];

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar con datos de ejemplo
    initializeDefaultAssets();
    
    // Configurar eventos
    setupEventListeners();
    
    // Inicializar gráficos
    initCharts();
    
    // Actualizar consejos
    updateQuickTip();
});

// Inicializar con algunos activos por defecto
function initializeDefaultAssets() {
    const defaultAssets = ['ARKK', 'TSLA', 'MRNA'];
    defaultAssets.forEach(ticker => {
        addAssetToUI(ticker);
    });
}

// Configurar todos los event listeners
function setupEventListeners() {
    // Botón de búsqueda
    document.getElementById('searchBtn').addEventListener('click', handleSearch);
    
    // Enter en la búsqueda
    document.getElementById('searchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') handleSearch();
    });
    
    // Botón de limpiar
    document.getElementById('clearBtn').addEventListener('click', clearAllAssets);
    
    // Botones de timeframe
    document.querySelectorAll('.time-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            updatePerformanceChart(this.dataset.time);
        });
    });
    
    // Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            
            // Actualizar botones activos
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Mostrar contenido activo
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Eliminar activos
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-asset')) {
            const assetId = e.target.dataset.id;
            removeAsset(assetId);
        }
    });
    
    // Tipo de análisis
    document.getElementById('analysisType').addEventListener('change', updateQuickTip);
    
    // Botón comparar
    document.getElementById('compareBtn').addEventListener('click', compareAssets);
}

// Manejar búsqueda de activos
function handleSearch() {
    const searchInput = document.getElementById('searchInput').value.trim();
    if (!searchInput) {
        showNotification('Ingresa un ticker o nombre para buscar', 'warning');
        return;
    }
    
    // Extraer ticker (simulación)
    const ticker = extractTicker(searchInput);
    
    // Verificar si ya existe
    if (selectedAssets.includes(ticker)) {
        showNotification(`${ticker} ya está en la lista`, 'warning');
        return;
    }
    
    // Añadir activo
    addAssetToUI(ticker);
    
    // Limpiar búsqueda
    document.getElementById('searchInput').value = '';
}

// Extraer ticker del texto de búsqueda
function extractTicker(searchText) {
    // Simulación simple - en producción usarías una API
    const upperText = searchText.toUpperCase();
    
    // Buscar ticker entre paréntesis
    const match = upperText.match(/\(([A-Z]{1,5})\)/);
    if (match) return match[1];
    
    // Si es solo texto, tomar las primeras 4 letras
    const words = upperText.split(' ');
    if (words.length === 1 && words[0].length <= 5) {
        return words[0];
    }
    
    // Generar ticker aleatorio para demostración
    const randomTickers = ['AAPL', 'GOOGL', 'AMZN', 'NVDA', 'META', 'NFLX', 'AMD', 'SQ'];
    return randomTickers[Math.floor(Math.random() * randomTickers.length)];
}

// Añadir activo a la interfaz
function addAssetToUI(ticker) {
    // Generar datos simulados si no existen
    if (!sampleData[ticker]) {
        sampleData[ticker] = generateRandomAssetData(ticker);
    }
    
    const assetData = sampleData[ticker];
    
    // Añadir a la lista de activos seleccionados
    selectedAssets.push(ticker);
    
    // Crear elemento en la lista
    const assetList = document.getElementById('selectedAssets');
    const newAsset = document.createElement('li');
    newAsset.innerHTML = `
        <div>
            <div class="asset-name">${assetData.name} (${ticker})</div>
            <div class="asset-type">${assetData.type}</div>
        </div>
        <i class="fas fa-times remove-asset" data-id="${ticker}"></i>
    `;
    assetList.appendChild(newAsset);
    
    // Actualizar gráficos
    updateAllCharts();
    
    // Mostrar notificación
    showNotification(`${ticker} añadido al análisis`, 'success');
}

// Generar datos aleatorios para nuevos activos
function generateRandomAssetData(ticker) {
    const colors = ['#9b59b6', '#1abc9c', '#e67e22', '#34495e', '#d35400'];
    const types = ['Empresa Satélite', 'Fondo Satélite', 'ETF Temático'];
    const sectors = ['Tecnología', 'Biotecnología', 'Energías Renovables', 'Fintech'];
    
    return {
        name: `${ticker} Corporation`,
        type: types[Math.floor(Math.random() * types.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        sector: sectors[Math.floor(Math.random() * sectors.length)],
        valuation: { 
            pe: Math.random() * 50 + 5, 
            ps: Math.random() * 15 + 1, 
            evEbitda: Math.random() * 30 + 5, 
            pb: Math.random() * 10 + 1 
        },
        growth: { 
            revenue: (Math.random() * 100 - 30), 
            earnings: (Math.random() * 150 - 50), 
            cashFlow: (Math.random() * 80 - 20) 
        },
        risk: { 
            volatility: Math.random() * 40 + 20, 
            beta: Math.random() * 1.5 + 0.5, 
            maxDrawdown: -(Math.random() * 50 + 20) 
        },
        performance: Array.from({length: 12}, (_, i) => 100 + (Math.random() * 60 - 30) + i * 2),
        catalysts: [
            `Evento próximo ${Math.floor(Math.random() * 12) + 1}/2024`,
            'Resultados trimestrales próximos'
        ],
        checklist: [
            Math.random() > 0.5,
            Math.random() > 0.5,
            Math.random() > 0.5,
            Math.random() > 0.5
        ]
    };
}

// Remover activo
function removeAsset(ticker) {
    selectedAssets = selectedAssets.filter(asset => asset !== ticker);
    
    // Remover de la UI
    const assetItems = document.querySelectorAll('#selectedAssets li');
    assetItems.forEach(item => {
        if (item.querySelector('.remove-asset').dataset.id === ticker) {
            item.remove();
        }
    });
    
    // Actualizar gráficos
    updateAllCharts();
    
    showNotification(`${ticker} eliminado`, 'info');
}

// Limpiar todos los activos
function clearAllAssets() {
    selectedAssets = [];
    document.getElementById('selectedAssets').innerHTML = '';
    updateAllCharts();
    showNotification('Todos los activos eliminados', 'info');
}

// Inicializar gráficos
function initCharts() {
    // Gráfico de valuación
    const ctx1 = document.getElementById('valuationChart').getContext('2d');
    valuationChart = new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: ['P/E', 'P/S', 'EV/EBITDA', 'P/B'],
            datasets: []
        },
        options: getChartOptions('Ratio', 'Valuación')
    });
    
    // Gráfico de crecimiento
    const ctx2 = document.getElementById('growthChart').getContext('2d');
    growthChart = new Chart(ctx2, {
        type: 'radar',
        data: {
            labels: ['Ingresos', 'Beneficios', 'Flujo Caja'],
            datasets: []
        },
        options: getRadarOptions()
    });
    
    // Gráfico de riesgo
    const ctx3 = document.getElementById('riskChart').getContext('2d');
    riskChart = new Chart(ctx3, {
        type: 'doughnut',
        data: {
            labels: ['Volatilidad', 'Beta', 'Drawdown'],
            datasets: []
        },
        options: getDoughnutOptions()
    });
    
    // Gráfico de rendimiento
    const ctx4 = document.getElementById('performanceChart').getContext('2d');
    performanceChart = new Chart(ctx4, {
        type: 'line',
        data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            datasets: []
        },
        options: getLineOptions()
    });
    
    // Actualizar gráficos con datos iniciales
    updateAllCharts();
}

// Configuraciones de gráficos
function getChartOptions(yLabel, title) {
    return {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: yLabel
                }
            }
        },
        plugins: {
            legend: { position: 'top' },
            title: {
                display: true,
                text: title
            }
        }
    };
}

function getRadarOptions() {
    return {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            r: {
                angleLines: { display: true },
                suggestedMin: -70,
                suggestedMax: 130
            }
        }
    };
}

function getDoughnutOptions() {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'right' }
        }
    };
}

function getLineOptions() {
    return {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: false,
                title: {
                    display: true,
                    text: 'Rendimiento (%)'
                }
            }
        },
        plugins: {
            legend: { position: 'top' }
        }
    };
}

// Actualizar todos los gráficos
function updateAllCharts() {
    if (selectedAssets
