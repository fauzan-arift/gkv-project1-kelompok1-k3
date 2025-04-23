const csvFile = "climate_change_impact_on_agriculture_2024.csv";

d3.csv(csvFile)
  .then(function (rows) {
    rows.forEach((row) => {
      let country = row["Country"]?.trim();
      let strategy = row["Adaptation_Strategies"]?.trim();

      if (!country || !strategy) return;

      if (!window.adaptationData[country]) {
        window.adaptationData[country] = {};
      }
      if (!window.adaptationData[country][strategy]) {
        window.adaptationData[country][strategy] = 0;
      }
      window.adaptationData[country][strategy] += 1;

      if (!window.adaptationData["Global"]) {
        window.adaptationData["Global"] = {};
      }
      if (!window.adaptationData["Global"][strategy]) {
        window.adaptationData["Global"][strategy] = 0;
      }
      window.adaptationData["Global"][strategy] += 1;
    });

    const countrySelect = document.getElementById("country-select");

    window.updatePieChart("Global", window.adaptationData);
  })
  .catch(function (err) {
    console.error(err);
  });

window.adaptationData = {};
window.updatePieChart = function (selectedCountry, adaptationData) {
    const data = adaptationData[selectedCountry];
    const strategies = Object.keys(data);
    const values = strategies.map((key) => data[key]);

    const trace = {
        labels: strategies,
        values: values,
        type: "pie",
        textposition: 'outside',
        textinfo: "label+percent",
        hoverinfo: "label+value",
        marker: {
          line: {
            width: 2,
            color: "white"
          }
        }
    };

    const layout = {
        title: `Distribusi Strategi Adaptasi (${selectedCountry})`,
        font: { size: 16 },
        height: 500,
        width: 800,
        showlegend: false,
        margin: {
            l: 50, r: 50,
            t: 50, b: 50
        }
    };

    const config = { 
        responsive: true,
        displayModeBar: false
    };

    Plotly.newPlot("pie-chart", [trace], layout, config);
};