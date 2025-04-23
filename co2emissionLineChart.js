const csvFileNama = "climate_change_impact_on_agriculture_2024.csv";

window.emissionsData = {};

d3.csv(csvFileNama)
  .then(function (rows) {
    rows.forEach((row) => {
      let country = row["Country"]?.trim();
      let year = row["Year"]?.trim();
      let emissions = +row["CO2_Emissions_MT"]?.trim();

      if (!country || !year || isNaN(emissions)) return;

      if (!window.emissionsData[country]) window.emissionsData[country] = {};
      if (!window.emissionsData[country][year]) window.emissionsData[country][year] = 0;

      window.emissionsData[country][year] += emissions;

      if (!window.emissionsData["Global"]) window.emissionsData["Global"] = {};
      if (!window.emissionsData["Global"][year]) window.emissionsData["Global"][year] = 0;

      window.emissionsData["Global"][year] += emissions;
    });

    window.updateChart("Global", window.emissionsData);
  })
  .catch(function (error) {
    console.error(error);
  });

window.updateChart = function (selectedCountry, emissionsData) {
    const countryData = emissionsData[selectedCountry];
    
    const dataPoints = [];
    for (let year in countryData) {
        dataPoints.push({
            year: parseInt(year),
            emissions: countryData[year]
        });
    }

    dataPoints.sort((a, b) => a.year - b.year);

    const trace = {
        x: dataPoints.map(d => d.year),
        y: dataPoints.map(d => d.emissions),
        type: "scatter",
        mode: "lines+markers",
        name: selectedCountry,
        line: { width: 2 },
        marker: { size: 6 }
    };

    const layout = {
        title: `CO₂ Emissions Over Time (${selectedCountry})`,
        height: 500,
        width: 800,
        xaxis: {
            title: "Year",
            tickmode: "linear",
            dtick: 5
        },
        yaxis: {
            title: "Emissions (MT)",
            rangemode: "tozero"
        },
        font: { size: 16 },
        margin: {
            l: 80,
            r: 50,
            t: 50,
            b: 50
        }
    };

    const config = { 
        responsive: true,
        displayModeBar: false
    };

    Plotly.newPlot("line-chart", [trace], layout, config);
};
