
//Global varibales for data paths 
var dataPath2012 = "data2012.json"; 
var dataPath2008 = "data2008.json";
var dataPath2004 = "data2004.json";
var electionTotalsPath = "electiontotals.json"; 


//Function to update Circles position and color 

function updateDataViz(dataPath, totalDataPath){

	
	//remove total panel html


	//Chart variable for scale
	var margins = {top:30, right: 20, bottom: 30, left: 50}
	var chartHeight = 500 - margins.top - margins.bottom;
	var chartWidth = 800 - margins.right - margins.left;
	var padding = 70; 
	var svg = d3.select(".chart svg");

	var pathToTotal; 

	if (dataPath === "data2008.json"){
		pathToTotal = "two_thousand_eight"; 
	} else if (dataPath === "data2012.json"){
		pathToTotal = "two_thousand_twelve";
	} else if (dataPath === "data2004.json"){
		pathToTotal = "two_thousand_four";
	}

	//Set Primary Panel Display from totalDataPath

	d3.json(totalDataPath, function(error, json){
		if(error) return console.warn(error);
		var totals = json; 

		 var obj = totals[pathToTotal]; 
		 console.log(obj);

		d3.select(".dem-candidate").text(obj.dem_candidate); 
		d3.select(".rep-candidate").text(obj.rep_candidate);

		d3.select(".dem-picture").html('<img class="img img-responsive" src="' + obj.dem_media +'">');
		d3.select(".rep-picture").html('<img class="img img-responsive" src="' + obj.rep_media +'">');       


	})

	d3.json(dataPath, function(error, json){
		
		//if(error) return console.warn(error); 
		var data = json; 

		var popularVote = 0;
		var popularDemVote = 0; 
		var popularRepVote = 0;
		var popularThirdVote = 0;
		var popularPieArray;

			// Load Total Variables 
			for (var i = 0; i < data.length; i++){

				popularVote = popularVote + data[i].dem_votes + data[i].rep_votes + data[i].other_votes;
				popularRepVote = popularRepVote + data[i].rep_votes; 
				popularDemVote = popularDemVote + data[i].dem_votes;
				popularThirdVote = popularThirdVote + data[i].other_votes; 
			}	

			popularPieArray = [popularDemVote, popularRepVote, popularThirdVote];

			d3.select(".pie-chart svg").remove("svg");

			// Write Total Variabes and Pie to Display
			d3.select(".total-vote").text(popularVote);
			d3.select(".total-dem-vote").text(popularDemVote);
			d3.select(".total-rep-vote").text(popularRepVote);
			d3.select(".total-third-vote").text(popularThirdVote);

		pie = d3.layout.pie();

		var w = 150;
		var h = 150;
		var outerRadius = w / 2;
		var innerRadius = 0;
		var arc = d3.svg.arc()
		                .innerRadius(innerRadius)
		                .outerRadius(outerRadius);

		var pieChart = d3.select(".pie-chart")
							.append("svg")
							.attr("width", w)
							.attr("height",h);
							//.style("padding-left", 75);

		var arcs = pieChart.selectAll("g.arc")
							.data(pie(popularPieArray))
							.enter()
							.append("g")
							.attr("class","arc")
							.attr("transform",  "translate(" + outerRadius + "," + outerRadius + ")" );                

		var color = d3.scale.linear().domain([0,1,2]).range(["blue", "red", "gray"]);

		arcs.append("path")
		    .attr("fill", function(d, i) {
		        return color(i);
		    })
		    .attr("d", arc);



		// Create Variable for Scale and Domain 
		var yMax = d3.max(data, function(d){
			return d.dem_votes;
		});

		var xMax = d3.max(data, function(d){
			return d.rep_votes;
		});

		var colorDomain = d3.extent(data, function(d){
			return d.dem_votes - d.rep_votes;
		});

		var rDomain = d3.extent(data, function(d){
			return d.electoral_votes;
		});

		var xScale = d3.scale.linear()
			.domain([0, xMax])
			.range([padding, chartWidth-padding]);

		var yScale = d3.scale.linear()
			.domain([0, yMax])
			.range([chartHeight-padding, padding]);

		var rScale = d3.scale.linear()
			.domain(rDomain)
			.range([10, 50]); 	

		var colorScale = d3.scale.linear()
			.domain(colorDomain)
			.range(["red","blue"]);

		var xAxis = d3.svg.axis()
			.scale(xScale)
			.orient("bottom");

		var yAxis = d3.svg.axis()
			.scale(yScale)
			.orient("left");

		// Create SVG Variable ETC 

		//Create Circles and add on click event 

		var circles = svg.selectAll("circle")
			.data(data)
			.transition()
			.duration(1000)
			.attr("fill", function(d){
				return colorScale(d.dem_votes - d.rep_votes);
			})
			.attr("cx", function(d){
				return xScale(d.rep_votes);
			})
			.attr("cy", function(d){
				return yScale(d.dem_votes);
			})
			.attr("r", function(d){
				return rScale(d.electoral_votes);
			});

	});//End JSON Function 
}//End updateDataViz





//Create Initial Data Viz w/ 2012 Data 




function generateDataViz(dataPath, totalDataPath){

d3.select(".chart svg").remove("svg");

		//Set Primary Panel Display from totalDataPath

	d3.json(totalDataPath, function(error, json){
		if(error) return console.warn(error);
		var totals = json; 

		console.log("here"); 
		console.log(totals); 
		console.log(totals.two_thousand_twelve.dem_candidate); 

		d3.select(".dem-candidate").text(totals.two_thousand_twelve.dem_candidate); 
		d3.select(".rep-candidate").text(totals.two_thousand_twelve.rep_candidate);

		d3.select(".dem-picture").html('<img class="img img-responsive" src=' + totals.two_thousand_twelve.dem_media +'>');
		d3.select(".rep-picture").html('<img class="img img-responsive" src=' + totals.two_thousand_twelve.rep_media +'>');   


	})

	d3.json(dataPath, function(error, json){
		if(error) return console.warn(error); 
		var data = json; 


		var margins = {top:30, right: 20, bottom: 30, left: 30}; 
		var chartHeight = 500 - margins.top - margins.bottom;
		var chartWidth = 850 -margins.right - margins.left;
		var padding = 70; 
		var svg = d3.select(".chart").append('svg')
			.attr('width', chartWidth)
			.attr('height', chartHeight);

		var popularVote = 0;
		var popularDemVote = 0; 
		var popularRepVote = 0;
		var popularThirdVote = 0;
		var popularPieArray;

		// Load Total Variables 
		for (var i = 0; i < data.length; i++){

			popularVote = popularVote + data[i].dem_votes + data[i].rep_votes + data[i].other_votes;
			popularRepVote = popularRepVote + data[i].rep_votes; 
			popularDemVote = popularDemVote + data[i].dem_votes;
			popularThirdVote = popularThirdVote + data[i].other_votes; 
		}	

		popularPieArray = [popularDemVote, popularRepVote, popularThirdVote];

		d3.select(".pie-chart svg").remove("svg");

		// Write Total Variabes and Pie to Display
		d3.select(".total-vote").text(popularVote);
		d3.select(".total-dem-vote").text(popularDemVote);
		d3.select(".total-rep-vote").text(popularRepVote);
		d3.select(".total-third-vote").text(popularThirdVote);
		d3.select(".total-year").text(" 2012");
		d3.select(".state-year").text(" 2012");

		pie = d3.layout.pie();

		var w = 150;
		var h = 150;
		var outerRadius = w / 2;
		var innerRadius = 0;
		var arc = d3.svg.arc()
		                .innerRadius(innerRadius)
		                .outerRadius(outerRadius);
		var pieChart = d3.select(".pie-chart")
							.append("svg")
							.attr("width", w)
							.attr("height",h);
							// .style("padding-top", 25);
							// .style("padding-left", 75);

		var arcs = pieChart.selectAll("g.arc")
							.data(pie(popularPieArray))
							.enter()
							.append("g")
							.attr("class","arc")
							.attr("transform",  "translate(" + outerRadius + "," + outerRadius + ")" );                

		var color = d3.scale.linear().domain([0,1,2]).range(["blue", "red", "gray"]);

		arcs.append("path")
		    .attr("fill", function(d, i) {
		        return color(i);
		    })
		    .attr("d", arc);



		// Create Variable for Scale and Domain 
		var yMax = d3.max(data, function(d){
			return d.dem_votes;
		});

		var xMax = d3.max(data, function(d){
			return d.rep_votes;
		});

		var colorDomain = d3.extent(data, function(d){
			return d.dem_votes - d.rep_votes;
		});

		var rDomain = d3.extent(data, function(d){
			return d.electoral_votes;
		});

		var xScale = d3.scale.linear()
			.domain([0, xMax])
			.range([padding, chartWidth-padding]);

		var yScale = d3.scale.linear()
			.domain([0, yMax])
			.range([chartHeight-padding, padding]);

		var rScale = d3.scale.linear()
			.domain(rDomain)
			.range([10, 50]); 	

		var colorScale = d3.scale.linear()
			.domain(colorDomain)
			.range(["red","blue"]);

		var xAxis = d3.svg.axis()
			.scale(xScale)
			.orient("bottom");

		var yAxis = d3.svg.axis()
			.scale(yScale)
			.orient("left");

		// Create SVG Variable ETC 

		//Create Circles and add on click event 

		var circles = svg.selectAll("circle")
			.data(data)
			.enter()
			.append("circle")
			.style("padding", "50px");

			circles
			.attr("fill", function(d){
				return colorScale(d.dem_votes - d.rep_votes);
			})
			.attr("cx", function(d){
				return xScale(d.rep_votes);
			})
			.attr("cy", function(d){
				return yScale(d.dem_votes);
			})
			.attr("r", function(d){
				return rScale(d.electoral_votes);
			})
			.on("click", function(d){

				d3.select(".state-pie-chart svg").remove("svg");
				d3.select(".state-name").text(d.state + ", " + d.postal_code);
				d3.select(".state-total-vote").text((d.dem_votes + d.rep_votes + d.other_votes));
				d3.select(".state-dem-vote").text(d.dem_votes);
				d3.select(".state-rep-vote").text(d.rep_votes);
				d3.select(".state-third-vote").text(d.other_votes);
				d3.select(".state-electoral").text(d.electoral_votes);

				stateTotalArray = [d.dem_votes, d.rep_votes, d.other_votes];
				pie = d3.layout.pie();
				var w = 150;
				var h = 150;
				var outerRadius = w / 2;
				var innerRadius = 0;
				var arc = d3.svg.arc()
				                .innerRadius(innerRadius)
				                .outerRadius(outerRadius);
				var statePieChart = d3.select(".state-pie-chart")
									.append("svg")
									.attr("width", w)
									.attr("height",h); 
									// .style("padding-left", 75);

				var arcs = statePieChart.selectAll("g.arc")
									.data(pie(stateTotalArray))
									.enter()
									.append("g")
									.attr("class","arc")
									.attr("transform",  "translate(" + outerRadius + "," + outerRadius + ")" );                

				var color = d3.scale.linear().domain([0,1,2]).range(["blue", "red", "gray"]);

				arcs.append("path")
				    .attr("fill", function(d, i) {
				        return color(i);
				    })
				    .attr("d", arc);

			}) //End on click function 
			.on("mouseover", function(d) {

				//Get this bar's x/y values, then augment for the tooltip
				var xPosition = parseFloat(d3.select(this).attr("cx")) ;
				var yPosition = parseFloat(d3.select(this).attr("cy"));

				//Update the tooltip position and value
				d3.select("#tooltip")
				  .style("left", xPosition + "px")
				  .style("top", (yPosition + 245) + "px")
				  .select("#value")
				  .text(d.state + ", " + d.postal_code + " (" + d.electoral_votes + ")");

				//Show the tooltip
				d3.select("#tooltip").classed("hidden", false);

			})
			.on("mouseout", function() {

				//Hide the tooltip
				d3.select("#tooltip").classed("hidden", true);

			});//End event handlers 

		//Create Axes

			svg.append("g")
			.attr("class", "axis")
			.attr("transform", "translate(0," + parseInt(chartHeight - padding) + ")")
			.call(xAxis);

			svg.append("g")
			.attr("class", "axis")
			.attr("transform", "translate(" + padding + ", 0)")
			.call(yAxis);

		//Create Axis Labels

		svg.append("text")
			.attr("class", "y label")
			.attr("text-anchor", "end")
			.attr("y", 6)
			.attr("dy", ".75em")
			.text("Democratic Votes"); 

			
			d3.json("us-states.json", function(d){

				
				for (var i = 0; i < d.features.length; i ++){

					var dataState = data[i].state;
					console.log(dataState);  //value from dataXXXX.json
					
					var dataValue = parseInt(data[i].rep_votes - data[i].dem_votes); 
					console.log(dataValue);

					  //Find the corresponding state inside the GeoJSON
			            for (var j = 0; j < d.features.length; j++) {

			            var jsonState = d.features[j].properties.name;

			            if (dataState == jsonState) {

			                //Copy the data value into the JSON
			                d.features[j].properties.value = dataValue;

			                //Stop looking through the JSON
			                break; 
					}
				}

			}

			console.log(d); 	

				var w = 1000; 
				var h = 1000;  

				var mapSVG = d3.select(".chloropleth").append('svg').attr("width", 1000).attr("height", 1000); 
				var projection = d3.geo.albersUsa()
                       .translate([w/2, h/2])
                       .scale([1000]);

				var path = d3.geo.path().projection(projection); 

				mapSVG.selectAll("path")
		           .data(d.features)
		           .enter()
		           .append("path")
		           .attr("d", path);
		           //add style to fill path with dyanmic color 
		           //add onmouseover and onmouseout event handlers here 

			}); 



	});//End JSON Function 


};//End generateDataViz

//Call DataViz
generateDataViz(dataPath2012, electionTotalsPath); 

// Bind DataViz to event handlers

d3.select(".two-thousand-twelve").on("click", function(){
	updateDataViz(dataPath2012, electionTotalsPath);
	d3.select(".total-year").text(" 2012");
	d3.select(".state-year").text(" 2012");

});

d3.select(".two-thousand-eight").on("click", function(){
	updateDataViz(dataPath2008, electionTotalsPath);
	d3.select(".total-year").text(" 2008");
	d3.select(".state-year").text(" 2008");

});

d3.select(".two-thousand-four").on("click", function(){
	updateDataViz(dataPath2004, electionTotalsPath);
	d3.select(".total-year").text(" 2004");
	d3.select(".state-year").text(" 2004");

});

