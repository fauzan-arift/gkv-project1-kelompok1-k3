const csvFileName = "climate_change_impact_on_agriculture_2024.csv";

window.cropImpactData = {};

d3.csv(csvFileName)
  .then(function (rows) {
    rows.forEach((row) => {
      let country = row["Country"]?.trim();
      let cropType = row["Crop_Type"]?.trim();
      let impact = +row["Economic_Impact_Million_USD"]?.trim();

      if (!country || !cropType || isNaN(impact)) return;

      if (!window.cropImpactData[country]) window.cropImpactData[country] = {};
      if (!window.cropImpactData[country][cropType]) window.cropImpactData[country][cropType] = 0;

      window.cropImpactData[country][cropType] += impact;

      if (!window.cropImpactData["Global"]) window.cropImpactData["Global"] = {};
      if (!window.cropImpactData["Global"][cropType]) window.cropImpactData["Global"][cropType] = 0;

      window.cropImpactData["Global"][cropType] += impact;
    });

    const countrySelect = document.getElementById("country-select");

    window.updateBarChart("Global", window.cropImpactData);
  })
  .catch(function (error) {
    console.error(error);
  });

window.updateBarChart = function(selectedCountry, cropImpactData) {
  const cropData = cropImpactData[selectedCountry];

  const sortedData = Object.entries(cropData)
    .map(([crop, value]) => ({ crop, value }))
    .sort((a, b) => b.value - a.value); 

  const cropTypes = sortedData.map(item => item.crop);
  const values = sortedData.map(item => item.value);

  const colors = [
    '#2ca02c', // hijau
    '#1f77b4', // biru
    '#ff7f0e', // oranye
    '#d62728', // merah
    '#9467bd', // ungu
    '#8c564b', // coklat
    '#e377c2', // pink
    '#7f7f7f', // abu-abu
    '#bcbd22', // kuning kehijauan
    '#17becf'  // biru muda
  ];

  let trace = {
    x: cropTypes,
    y: values,
    type: "bar",
    marker: {
      color: colors.slice(0, cropTypes.length) 
    }
  };

  let layout = {
    title: `Dampak Ekonomi Berdasarkan Jenis Tanaman (${selectedCountry})`,
    height: 500,
    width: 800,
    xaxis: { 
      title: "Jenis Tanaman",
      tickangle: -45
    },
    yaxis: { 
      title: "Dampak Ekonomi (Juta USD)",
      automargin: true
    },
    font: { size: 16 },
    margin: {
      l: 80,
      r: 50,
      t: 50,
      b: 120
    },
    showlegend: false
  };

  const config = { 
    responsive: true,
    displayModeBar: false
  };

  Plotly.newPlot("bar-chart", [trace], layout, config);
};
