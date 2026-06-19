(function () {
  'use strict';


  /*--------- 1. LEAFLET MAP --------*/

  // Tile layer definitions  { url, attribution }
  const TILE_LAYERS = {
    map: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    },
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles © Esri — Source: Esri, DigitalGlobe, USDA'
    },
    terrain: {
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      attribution: '© <a href="https://opentopomap.org">OpenTopoMap</a>'
    }
  };

  // Initialise map centred on East Khasi Hills
  const map = L.map('map', {
    center: [25.55, 91.85],
    zoom: 10,
    zoomControl: false   // we provide our own zoom buttons
  });

  // Add default tile layer
  let activeTileLayer = L.tileLayer(
    TILE_LAYERS.map.url,
    { attribution: TILE_LAYERS.map.attribution }
  ).addTo(map);


  // ── Map tab switcher (Map / Satellite / Terrain) ──
  const mapTabs = document.querySelectorAll('.map-tab');

  mapTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      // Update active state
      mapTabs.forEach(function (t) { t.classList.remove('map-tab--active'); });
      tab.classList.add('map-tab--active');

      // Swap tile layer
      const key = tab.id.replace('tab-', '');
      map.removeLayer(activeTileLayer);
      activeTileLayer = L.tileLayer(
        TILE_LAYERS[key].url,
        { attribution: TILE_LAYERS[key].attribution }
      ).addTo(map);
    });
  });


  // ── Custom zoom buttons ──
  document.getElementById('btn-zoom-in').addEventListener('click', function () {
    map.zoomIn();
  });

  document.getElementById('btn-zoom-out').addEventListener('click', function () {
    map.zoomOut();
  });


  /*-------- 2. LAYER CHECKBOXES ---------*/

  const layerCheckboxIds = [
    'chk-critical', 'chk-drying', 'chk-working', 'chk-phe',   // Spring Data
    'chk-block', 'chk-pilot', 'chk-springshed',                 // Spatial Overlays
    'chk-recharge', 'chk-ahp',
    'chk-lulc', 'chk-forest', 'chk-geology',                    // Base Data
    'chk-dem', 'chk-drainage', 'chk-rainfall',
    'chk-plantation', 'chk-survival', 'chk-species'             // Agroforestry
  ];

  layerCheckboxIds.forEach(function (id) {
    const checkbox = document.getElementById(id);
    if (checkbox) {
      checkbox.addEventListener('change', function () {
        // Placeholder: toggle real map layers here
        console.log('Layer toggled:', id, this.checked ? 'ON' : 'OFF');
      });
    }
  });


  /*-------- 3. CHART.JS — SPARKLINE  ---------*/

  const sparkCtx = document.getElementById('sparkline');

  let sparklineChart = new Chart(sparkCtx, {
    type: 'line',
    data: {
      labels: ['', '', '', '', '', '', '', '', '', '', '', ''],
      datasets: [{
        data: [3.1, 3.2, 3.0, 3.3, 3.4, 3.2, 3.5, 3.4, 3.6, 3.5, 3.7, 3.5],
        borderColor: '#2980b9',
        backgroundColor: 'rgba(41, 128, 185, 0.15)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 0,        // hides all dots
        pointHoverRadius: 0    // hides dots on hover too
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false }
      },
      scales: {
        x: { display: false },
        y: { display: false }
      },
      animation: { duration: 400 }
    }
  });


  /*-------- 4. CHART.JS — Discharge Trend (line) ---------*/

  const dischargeTrendCtx = document.getElementById('chart-discharge-trend');

  if (dischargeTrendCtx) {
    let dischargeTrendChart = new Chart(dischargeTrendCtx, {
      type: 'line',
      data: {
        labels: ['Pre-Monsoon', 'Monsoon', 'Post-Monsoon', 'Lean Season'],
        datasets: [
          {
            label: 'Observed (LPM)',
            data: [5.5, 12.5, 10.2, 8.0],
            borderColor: '#27ae60',
            backgroundColor: 'rgba(39, 174, 96, 0.10)',
            borderWidth: 2.5,
            pointRadius: 5,
            pointBackgroundColor: '#27ae60',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            tension: 0.35,
            fill: true
          },
          {
            label: 'Target',
            data: [6.0, 11.0, 11.0, 9.5],
            borderColor: '#95a5a6',
            borderWidth: 1.5,
            borderDash: [5, 4],
            pointRadius: 4,
            pointBackgroundColor: '#95a5a6',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            tension: 0.35,
            fill: false
          },
          {
            label: 'Post-Intervention (Pilot)',
            data: [6.2, 13.2, 10.8, 8.4],
            borderColor: 'rgba(41, 128, 185, 0.75)',
            backgroundColor: 'rgba(41, 128, 185, 0.06)',
            borderWidth: 2,
            pointRadius: 4,
            pointBackgroundColor: 'rgba(41, 128, 185, 0.75)',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            tension: 0.35,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1a3d4f',
            titleColor: '#ffffff',
            bodyColor: 'rgba(255, 255, 255, 0.8)',
            padding: 10,
            cornerRadius: 7,
            callbacks: {
              label: function (ctx) {
                return '  ' + ctx.dataset.label + ': ' + ctx.parsed.y.toFixed(1) + ' LPM';
              }
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(0, 0, 0, 0.04)' },
            ticks: { font: { size: 11, family: 'Inter' }, color: '#6b7f8e' }
          },
          y: {
            min: 0,
            title: {
              display: true,
              text: 'LPM',
              font: { size: 10 },
              color: '#9aaab6'
            },
            grid: { color: 'rgba(0, 0, 0, 0.05)' },
            ticks: { font: { size: 11, family: 'Inter' }, color: '#6b7f8e' }
          }
        }
      }
    });
  }


  /*-------- 5. CHART.JS — Block-wise Distribution (stacked bar) ---------*/

  const blockDistCtx = document.getElementById('chart-block-dist');

  if (blockDistCtx) {
    let blockDistChart = new Chart(blockDistCtx, {
      type: 'bar',
      data: {
        labels: ['Thadiaskein', 'Mawkynrew', 'Baghmara', 'Gambegre'],
        datasets: [
          {
            label: 'Working',
            data: [90, 62, 68, 46],
            backgroundColor: 'rgba(39, 174, 96, 0.82)',
            borderRadius: 1,
            borderSkipped: false,
            barThickness: 30
          },
          {
            label: 'Drying',
            data: [12, 8, 14, 8],
            backgroundColor: 'rgba(230, 126, 34, 0.82)',
            borderRadius: 1,
            borderSkipped: false,
            barThickness: 30
          },
          {
            label: 'Critical',
            data: [8, 10, 14, 6],
            backgroundColor: 'rgba(231, 76, 60, 0.82)',
            borderRadius: 1,
            borderSkipped: false,
            barThickness: 30
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1a3d4f',
            titleColor: '#ffffff',
            bodyColor: 'rgba(255, 255, 255, 0.8)',
            padding: 10,
            cornerRadius: 7
          }
        },
        scales: {
          x: {
            stacked: true,
            grid: { display: false },
            ticks: { font: { size: 11, family: 'Inter' }, color: '#6b7f8e' }
          },
          y: {
            stacked: true,
            min: 0,
            title: {
              display: true,
              text: 'No. of Springs',
              font: { size: 10 },
              color: '#9aaab6'
            },
            grid: { color: 'rgba(0, 0, 0, 0.05)' },
            ticks: { font: { size: 11, family: 'Inter' }, color: '#6b7f8e' }
          }
        }
      }
    });
  }

  /*-------- 6. KPI CARDS — press feedback ---------*/

  document.querySelectorAll('.kpi-card').forEach(function (card) {
    card.addEventListener('click', function () {
      card.style.transform = 'scale(0.97)';
      setTimeout(function () {
        card.style.transform = '';
      }, 120);
    });
  });


})();