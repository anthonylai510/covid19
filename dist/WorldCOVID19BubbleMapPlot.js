function getOffsetDate(offset, format) {
	var tday;
	var today = new Date();

	today.setDate(today.getDate() - offset);
	var dd = today.getDate();

	var mm = today.getMonth()+1; 
	var yyyy = today.getFullYear();

	if(dd<10) 
	{
		dd='0'+dd;
	} 

	if(mm<10) 
	{
		mm='0'+mm;
	}
	
	if(format == "yyyy-mm-dd")
		tday = yyyy + '-' + mm + '-' + dd;
	else if (format == "mm-dd-yyyy")
		tday = mm + '-' + dd + '-' + yyyy;
	else
		tday = yyyy + '-' + mm + '-' + dd;

	return tday;
}


//get the date string for today
var tday = getOffsetDate(0, "mm-dd-yyyy");
console.log(tday);

Plotly.d3.csv(
	"https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/" + tday + ".csv",
	function(err, rows) {
		if(err == null)
			makePlot(err, rows, tday);
		else
		{
			//get the date string for yesterday
			tday = getOffsetDate(1, "mm-dd-yyyy");
			console.log(tday);
			Plotly.d3.csv(
				"https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/" + tday + ".csv",
				function(err, rows) {
					makePlot(err, rows, tday);
				}
			);
		}
	}
);


function makePlot(err, rows, tday)
{

		//console.log(err);
		//console.log(rows);

		function unpack(rows, key) {
			return rows.map(function(row) {
				return row[key];
			});
		};
		
		
		function getSum(total, num) {
		  return total + Math.round(num);
		}

		var scl1 = [[0.7,'rgb(102, 0, 0)'],[1,'rgb(90, 0, 0)']];
		var scl2 = [[0.5,'rgb(204, 0, 0)'], [0.6,'rgb(135, 0, 0)']];
		var scl3 = [[0,'rgb(255, 51, 51)'],[0.35,'rgb(255, 0, 0)']];
		var scl4 = [[0,'rgb(255, 51, 51)'],[0.35,'rgb(255, 0, 0)'],[0.5,'rgb(204, 0, 0)'], [0.6,'rgb(135, 0, 0)'],[0.7,'rgb(102, 0, 0)'],[1,'rgb(90, 0, 0)']];
		
		
		var cityName = unpack(rows, 'Province/State'),
			countryName = unpack(rows, 'Country/Region'),
			cityCases = unpack(rows, 'Confirmed'),
			cityLat = unpack(rows, 'Latitude'),
			cityLon = unpack(rows, 'Longitude'),
			color = [,"rgb(255,65,54)","rgb(133,20,75)","rgb(255,133,27)","lightgrey"],
			hoverText = [];
		
		//calculate the Total Confirmed Cases
		const arrcityCasesSum = cityCases.reduce(getSum, 0);
		//console.log(arrcityCasesSum);
		
		//prepare for hover text for each city in a country or just country
		for ( var i = 0 ; i < cityCases.length; i++) {
			var currentText = "";
			if(cityName[i] == "")
				currentText = countryName[i] + "<br>Cases: " + cityCases[i];
			else
				currentText = cityName[i] + ", " + countryName[i] + "<br>Cases: " + cityCases[i];
			hoverText.push(currentText);
		}

		var trace1 = 
			{
				name: 'Confirmed > 10,000',
				type: "scattergeo",
				mode: 'markers',
				hoverinfo: 'text',
				text: hoverText,
				lon: cityLon,
				lat: cityLat,
				
				//marker: { color: "fuchsia", size: 4 },
				marker: {
					//color: "fuchsia",
					color: "rgb(90, 0, 0)",
/* 					colorscale: scl1,
					cmin: 10000,
					color: unpack(rows, 'Cases'),
					colorbar: {
						title: 'COVID-19 Confirmed Cases'
					}, */
					opacity: 0.8,
					autocolorscale: false,
					size: cityCases,
					sizemode: "area",
					sizeref: 10 // size ref for value > 10,000
				},
				transforms: [
				  {	type: 'filter',
					target: cityCases,
					operation: '>',
					value: 10000
				  }
				]
			};


		var trace2 = 
			{
				name: '1,000 < Confirmed <= 10,000',
				type: "scattergeo",
				mode: 'markers',
				hoverinfo: 'text',
				text: hoverText,
				lon: cityLon,
				lat: cityLat,
				//marker: { color: "fuchsia", size: 4 },
				marker: {
					//color: "fuchsia",
					color: "rgb(170, 0, 0)",
/* 					colorscale: scl2,
					cmin: 1000,
					color: unpack(rows, 'Cases'),
					colorbar: {
						title: 'COVID-19 Confirmed Cases'
					},
 */					opacity: 0.8,
					autocolorscale: false,
					size: unpack(rows, 'Confirmed'),
					sizemode: "area",
					sizeref: 6 // size ref for 1,000 < value <= 10,000
				},
				transforms: [
				  {	type: 'filter',
					target: cityCases,
					operation: '<=',
					value: 10000
				  },
				  {	type: 'filter',
					target: cityCases,
					operation: '>',
					value: 1000
				  }

				]
			};


		var trace3 = 
			{
				name: '100 < Confirmed <= 1,000',
				type: "scattergeo",
				mode: 'markers',
				hoverinfo: 'text',
				text: hoverText,
				lon: cityLon,
				lat: cityLat,
				//marker: { color: "fuchsia", size: 4 },
				marker: {
					//color: "fuchsia",
					color: "rgb(255, 0, 0)",
/* 					colorscale: scl2,
					cmin: 1000,
					color: unpack(rows, 'Cases'),
					colorbar: {
						title: 'COVID-19 Confirmed Cases'
					},
 */					opacity: 0.8,
					autocolorscale: false,
					size: unpack(rows, 'Confirmed'),
					sizemode: "area",
					sizeref: 1 // size ref for 100 < value <= 1,000
				},
				transforms: [
				  {	type: 'filter',
					target: cityCases,
					operation: '<=',
					value: 1000
				  },
				  {	type: 'filter',
					target: cityCases,
					operation: '>',
					value: 100
				  }

				]
			};


		var trace4 = 
			{
				name: '1 < Confirmed <= 100',
				type: "scattergeo",
				mode: 'markers',
				hoverinfo: 'text',
				text: hoverText,
				lon: cityLon,
				lat: cityLat,
				//marker: { color: "fuchsia", size: 4 },
				marker: {
					//color: "fuchsia",
					//color: "rgb(255, 192, 204)",
					color: "rgb(204, 51, 192)",
/* 					colorscale: scl2,
					cmin: 1000,
					color: unpack(rows, 'Cases'),
					colorbar: {
						title: 'COVID-19 Confirmed Cases'
					},
 */					opacity: 0.8,
					autocolorscale: false,
					size: unpack(rows, 'Confirmed'),
					sizemode: "area",
					sizeref: 0.6 // size ref for 0 <= value <= 100
				},
				transforms: [
				  {	type: 'filter',
					target: cityCases,
					operation: '<=',
					value: 100
				  },
				  {	type: 'filter',
					target: cityCases,
					operation: '>=',
					value: 1
				  }
				]
			};


		var layout = {
		  geo: {
			showland: true, 
			showlakes: true, 
			showocean: true, 
			//projection: {type: 'orthographic'},
			//projection: {type: 'natural earth'},
			//projection: {type: 'equirectangular'},
			//projection: {type: 'kavrayskiy7'},
			//projection: {type: 'robinson'},
			//projection: {type: 'miller'},
			//projection: {type: 'azimuthal equal area'},
			//projection: {type: 'albers usa'},
			//projection: {type: 'mercator'},
			//scope: 'asia',
			//scope: 'usa',
			//scope: 'europe',
			//scope: 'africa',
			//scope: 'north america',
			//scope: 'south america',
			//scope: 'world',
			showrivers: true, 
			showcountries: true,
			landcolor: 'lightgray',
			oceancolor: '#e8f4f8',
		  },
		  legend: {
			x: 0.5,
			xref: 'paper',
			xanchor: 'center',
			//y: 1,
			//yanchor: 'top',
			orientation: "h"
		  },
		  title: {
					//text: '<b>COVID-19 Global Confirmed Cases on ' + today + ' (by Anthony Lai)<br>Total Confirmed: ' + arrcityCasesSum + '</b>', 
					text: '<b>Total Confirmed: ' + arrcityCasesSum.toLocaleString('en-US') + '</b>', 
					font: {
					  family: 'Courier New, monospace',
					  size: 22,
					  color: 'red'
					},
					xref: 'paper',
					x: 1.05,
				  },
		  hovermode: 'closest',
		  height: 610
		  //height: "auto"

		};
		
		var h2 = document.getElementById('myh2');
		
		h2.innerHTML  = '<b><font size="5">COVID-19 Global Confirmed Cases on ' + tday + ' (by Anthony Lai)</font></b>';
		h2.align = 'center';
		
		var config = {responsive: true, displayModeBar: false}; //hide the plotly menubar
		
		var data = [trace1, trace2, trace3, trace4];

		Plotly.newPlot("myDiv", data, layout, config);
};