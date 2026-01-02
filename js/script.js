// VERSIÓN SIMPLIFICADA - PEGA ESTO EN js/script.js
console.log('Script cargado - SatelliteAnalyzer');

// Datos de ejemplo
const sampleData = {
    ARKK: { name: "ARK Innovation ETF", color: "#3498db" },
    TSLA: { name: "Tesla Inc.", color: "#27ae60" },
    MRNA: { name: "Moderna Inc.", color: "#e74c3c" }
};

let selectedAssets = ['ARKK', 'TSLA', 'MRNA'];

// Cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado, Chart disponible:', typeof Chart);
    
    // Mostrar activos
    showAssets();
    
    // Configurar botones
    setupButtons();
    
    // Inicializar gráficos simples
    initSimpleCharts();
});

function showAssets() {
    const list = document.getElementById('selectedAssets');
    if (!list) {
        console.error('No se encuentra la lista de activos');
        return;
    }
    
    list.innerHTML = '';
    
    selectedAssets.forEach(ticker => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div>
                <div class="asset-name">${sampleData[ticker].name} (${ticker})</div>
                <div class="asset-type">${ticker === 'ARKK' ? 'Fondo Satélite' : 'Empresa Satélite'}</div>
            </div>
            <i class="fas fa-times remove-asset" data-id="${ticker}"></i>
        `;
        list.appendChild(li);
    });
}

function setupButtons() {
    // Botón de búsqueda
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const input = document.getElementById('searchInput').value;
            alert(`Buscando: ${input}`);
        });
    }
    
    // Botón de limpiar
    const clearBtn = document.getElementById('clearBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            alert('Limpiando activos');
        });
    }
}

function initSimpleCharts() {
    // Verificar si Chart.js está cargado
    if (typeof Chart === 'undefined') {
        console.error('ERROR: Chart.js no está cargado');
        document.getElementById('valuationChart').innerHTML = 
            '<p style="color:red; text-align:center;">Error: Chart.js no se cargó</p>';
        return;
    }
    
    console.log('Chart.js está cargado, creando gráficos...');
    
    // Gráfico simple de barras
    try {
        const ctx = document.getElementById('valuationChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['ARKK', 'TSLA', 'MRNA'],
                datasets: [{
                    label: 'P/E Ratio',
                    data: [24.5, 68.2, 8.5],
                    backgroundColor: ['#3498db', '#27ae60', '#e74c3c']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Valuación Comparativa'
                    }
                }
            }
        });
        console.log('Gráfico creado exitosamente');
    } catch (error) {
        console.error('Error creando gráfico:', error);
    }
}
