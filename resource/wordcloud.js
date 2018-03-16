/**
 * Appends and draws a word cloud to the selected HTML object. 
 *
 * @param {string} selector - The id of the HTML object to append the word cloud.
 * @return {function} update - A function that updates the word cloud based on the filtered
 * descriptions.
 */
function wordCloud(selector) {
	
	var fill = d3.scale.category20();
		  
	var svg = d3.select(selector).append("svg")
		.attr("width", cwidth)
		.attr("height", cheight)
		.append("g")
		.attr("transform", "translate(200,150)");

	function draw(words) {

		var cloud = svg.selectAll("g text")
					.data(words, function(d) { return d.text; });

		cloud
			.enter().append("text")
			.style("font-size", function(d) { return d.size + "px"; })
			.style("font-family", "Impact")
			.style("fill", function(d, i) { return fill(i); })
			.attr("text-anchor", "middle")
			.attr("transform", function(d) {
				return "translate(" + [d.x, d.y] + ")";
				})
			.text(function(d) { return d.text; });
		
		cloud
			.transition()
			.duration(600)
			.style("font-size", function(d) { return d.size + "px"; })
			.attr("transform", function(d) {
				return "translate(" + [d.x, d.y] + ")";
			})
			.style("fill-opacity", 1);
	
		cloud
			.exit()
			.transition()
				.duration(200)
				.style('fill-opacity', 1e-6)
				.attr('font-size', 1)
				.remove();

  }
	return {

		update: function(words) {
			d3.layout.cloud().size([cwidth, cheight])
				.words(words)
				.padding(2)
				.spiral("rectangular")
				.text(function(d) { return d.text; })
				.rotate(function(d) { return 0; })
				.font("Arial")
				.fontSize(function(d) { return d.size; })
				.on("end", draw)
				.start();
		}
	}

}

/**
 * 
 *
 * @param {array} tags - An array of words and word counts from descriptions.
 * @return {array} tags - The updated array with text converted to lowercase and word count
 * converted to a font size for the visualization.
 */
function getWords(tags) {
	if(tags.length==0){
		
	
	}
	max = tags[0].size;
	min = tags[tags.length - 1].size;
	var linearScale = d3.scale.sqrt()
		.domain([min, max])
		.range([11, 40]);
	return tags
			.map(function(d) {
				return {text: d.text.toLowerCase(), size: linearScale(d.size)};
			})
}

/**
 * Calls update function for word cloud.
 *
 * @param {array} tags - An array of words and word counts from descriptions.
 * @param {function} vis - The named function for the word cloud.
 */
function showNewWords(tags, vis) {
	if(tags){
		vis.update(getWords(tags));
	} else {
		vis.update();
	}
}
