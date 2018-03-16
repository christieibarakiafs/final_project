var movieData = data.movieList;

for(var movieIndex=700 ; movieIndex < 1300; movieIndex++){

    // create article
    var dom_article = document.createElement("ARTICLE");
    dom_article.className = "movie";

    var dom_sectionImage = document.createElement("SECTION");
    dom_sectionImage.className = "featuredImage";

    var dom_img = document.createElement("img");
    dom_img.src = 'https://image.tmdb.org/t/p/w1280/' + movieData[movieIndex].posterUrl;

    dom_sectionImage.appendChild(dom_img);

    var movieYear = document.createElement("h4");
    var year = movieData[movieIndex].releaseDate === undefined? "" : movieData[movieIndex].releaseDate.substring(0,4);
    var yearText = document.createTextNode(year);
    yearText.className = "year";
    movieYear.appendChild(yearText);
    dom_sectionImage.appendChild(movieYear);

    dom_article.appendChild(dom_sectionImage);

    var movieTitle = document.createElement("h3");
    var titleText = document.createTextNode(movieData[movieIndex].title);
    movieTitle.appendChild(titleText);
    dom_article.appendChild(movieTitle);

    var textNode = document.createTextNode(movieData[movieIndex].overview);
    dom_article.appendChild(textNode);

    var src = document.getElementsByClassName("data")[0];
    dom_article.movie = movieData[movieIndex];
    src.appendChild(dom_article);

}

$("#closeDetail").on('click', function () {
    console.log('byee');
    $("#movieDetail").hide();

});


$(".data").on('click', '.movie', function () {

    $("#movieDetail").show();

    var genres = "";
    if(this.movie.genres !== undefined){
        var genreList = this.movie.genres;
        for(var genreIndex in genreList){
            genres = genres + genreList[genreIndex] + " ";
        }
    }

    genres = genres + " , " + this.movie.releaseDate.substring(0,4);


    // "personSet": [
    //     "KRETON",
    //     "JERRY LEWIS",
    //     "ALESSIO QUIRINO"
    // ],
    //     "organizationSet": [
    //     "U.F.O"
    // ],
    //     "locationSet": [
    //     {
    //         "name": "EARTH"
    //     }
    // ]

    var entityString = "";
    if(this.movie.locationSet !== undefined) {
        var locationSet = this.movie.locationSet;
        for(var locationIndex in locationSet){
            if(entityString!==""){
                entityString = entityString + ", ";
            }else{
                entityString = "Places: ";
            }
            entityString = entityString + locationSet[locationIndex].name;
        }
    }

    var peopleString = "";
    if(this.movie.personSet !== undefined) {
        var personSet = this.movie.personSet;
        for(var personIndex in personSet){


            if(peopleString!==""){
                peopleString = peopleString + ", ";
            }else{
                peopleString = "People: ";
            }
            peopleString = peopleString + personSet[personIndex];
        }
    }

    var orgString = "";
    if(this.movie.organizationSet !== undefined) {
        var orgSet = this.movie.organizationSet;
        for(var orgIndex in orgSet){


            if(orgString!==""){
                orgString = orgString + ", ";
            }else{
                orgString = "Organizations: ";
            }
            orgString = orgString + orgSet[orgIndex];
        }
    }





    var container = document.getElementById('content');
    container.innerHTML = "";

    var title = document.createElement("h1");
    title.className = "content-detail";
    title.appendChild(document.createTextNode(this.movie.title));
    container.appendChild(title);

    var dom_sectionImage = document.createElement("SECTION");
    dom_sectionImage.className = "bigImage";

    var dom_img = document.createElement("img");
    dom_img.src = 'https://image.tmdb.org/t/p/w1280/' + this.movie.posterUrl;

    dom_sectionImage.appendChild(dom_img);
    container.appendChild(dom_sectionImage);

    var textSection = document.createElement("SECTION");
    textSection.className = "text";
    var testText = document.createElement("p");
    testText.innerHTML = this.movie.overview;
    textSection.appendChild(testText);

    var genreSection = document.createElement("SECTION");
    genreSection.className  ="genre";
    var testGenres = document.createElement("h5");
    testGenres.innerHTML = genres;
    genreSection.appendChild(testGenres);

    // entities
    var entitySection = document.createElement("SECTION");
    entitySection.className = "entities";

    var peopleText = document.createElement("h2");
    peopleText.innerHTML = peopleString;
    entitySection.appendChild(peopleText);

    var orgText = document.createElement("h2");
    orgText.innerHTML = orgString;
    entitySection.appendChild(orgText);

    var entityText = document.createElement("h2");
    entityText.innerHTML = entityString;
    entitySection.appendChild(entityText);

    container.appendChild(textSection);
    container.appendChild(genreSection);
    container.appendChild(entitySection);


    //
    // // add the content from the clicked article
    // // title
    // var section = document.createElement("SECTION");
    // var title = document.createElement("H2");
    // var titleText = document.createTextNode(this.dataArticle.title);
    // title.appendChild(titleText);
    // section.appendChild(title);
    //
    // // author
    // var author = document.createElement("H3");
    // var authorText = document.createTextNode(this.dataArticle.byline);
    // author.appendChild(authorText);
    // section.appendChild(author);
    //
    // //d ate
    // var date = document.createTextNode(this.dataArticle.date);
    // date.className = "dateText";
    // section.appendChild(date);
    // section.appendChild(document.createElement("div"));
    //
    // // image
    // var dom_img = document.createElement("img");
    // dom_img.src = this.dataArticle.imageUrl;
    // dom_img.className = "featuredImage";
    // section.appendChild(dom_img);
    //
    // container.appendChild(section);
    //
    // // summary/abstract
    // var snippetPar = document.createElement("P");
    // snippetPar.className = "summary";
    // snippetPar.innerHTML = this.dataArticle.summary;
    // section.appendChild(snippetPar);
    //
    // // button to view original article in new tab
    // var link = document.createElement('a');
    // link.setAttribute('class', 'popUpAction');
    // link.setAttribute('href', this.dataArticle.url);
    // link.setAttribute('target', '_blank');
    // var linkText = document.createTextNode("Read more from source");
    // link.appendChild(linkText);
    // section.appendChild(link);
    //
    // $("#popUp").attr('class', 'popUpAction');

});


movieData.forEach(function(d){


    var title  = "'" + d.title + "'";


    if(d.locationSet !== undefined) {
        var locationSet = d.locationSet;
        if(locationSet[0].coords !== undefined) {

            d["geo"] = locationSet[0].coords.x + "," + locationSet[0].coords.y + "," + locationSet[0].name;

        }
    }


});

$(document).ready(function () {

    var ndx = crossfilter(movieData);

    var mapGeo = ndx.dimension(function(d){
        return d.geo;
    });
    var mapGeoGroup = mapGeo.group().reduceCount();

    var markerMap = dc.leafletMarkerChart("#marker-map")
        .dimension(mapGeo)
        .group(mapGeoGroup)
        .width(500)
        .height(300)
        .fitOnRender(true)
        .fitOnRedraw(true)
        .popupOnHover(true)
        .popup(function (d){
            return d.key.split(',')[2];
        })
        .cluster(true);





    dc.renderAll();

    // InitChart();
    //
    // function InitChart() {
    //
    //     console.log("init chart");
    //     var barData = [{
    //         'x': 1,
    //         'y': 5
    //     }, {
    //         'x': 20,
    //         'y': 20
    //     }, {
    //         'x': 40,
    //         'y': 10
    //     }, {
    //         'x': 60,
    //         'y': 40
    //     }, {
    //         'x': 80,
    //         'y': 5
    //     }, {
    //         'x': 100,
    //         'y': 60
    //     }];
    //
    //     var vis = d3.select('#visualisation'),
    //         WIDTH = 1000,
    //         HEIGHT = 500,
    //         MARGINS = {
    //             top: 20,
    //             right: 20,
    //             bottom: 20,
    //             left: 50
    //         },
    //         xRange = d3.scale.ordinal().rangeRoundBands([MARGINS.left, WIDTH - MARGINS.right], 0.1).domain(barData.map(function (d) {
    //             return d.x;
    //         })),
    //
    //
    //         yRange = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([0,
    //             d3.max(barData, function (d) {
    //                 return d.y;
    //             })
    //         ]),
    //
    //         xAxis = d3.svg.axis()
    //             .scale(xRange)
    //             .tickSize(5)
    //             .tickSubdivide(true),
    //
    //         yAxis = d3.svg.axis()
    //             .scale(yRange)
    //             .tickSize(5)
    //             .orient("left")
    //             .tickSubdivide(true);
    //
    //
    //     vis.append('svg:g')
    //         .attr('class', 'x axis')
    //         .attr('transform', 'translate(0,' + (HEIGHT - MARGINS.bottom) + ')')
    //         .call(xAxis);
    //
    //     vis.append('svg:g')
    //         .attr('class', 'y axis')
    //         .attr('transform', 'translate(' + (MARGINS.left) + ',0)')
    //         .call(yAxis);
    //
    //     vis.selectAll('rect')
    //         .data(barData)
    //         .enter()
    //         .append('rect')
    //         .attr('x', function (d) {
    //             return xRange(d.x);
    //         })
    //         .attr('y', function (d) {
    //             return yRange(d.y);
    //         })
    //         .attr('width', xRange.rangeBand())
    //         .attr('height', function (d) {
    //             return ((HEIGHT - MARGINS.bottom) - yRange(d.y));
    //         })
    //         .attr('fill', 'grey')
    //         .on('mouseover',function(d){
    //             d3.select(this)
    //                 .attr('fill', '#4424D6' );
    //         })
    //         .on('mouseout',function(d){
    //             d3.select(this)
    //                 .attr('fill','grey');
    //         });


});
