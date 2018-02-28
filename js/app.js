// function to add an article to main
function addArticle(article) {

    // create article
    var dom_article = document.createElement("ARTICLE");
    dom_article.className = "article";

    // assign img url from article
    var dom_sectionImage = document.createElement("SECTION");
    dom_sectionImage.className = "featuredImage";

    var dom_img = document.createElement("img");
    dom_img.src = article.imageUrl;

    dom_sectionImage.appendChild(dom_img);

    // assign article title
    var dom_sectionTitle = document.createElement("SECTION");
    dom_sectionTitle.className = "articleContent";

    var dom_title = document.createElement("H3");
    var title = document.createTextNode(article.title);
    dom_title.appendChild(title);
    dom_sectionTitle.appendChild(dom_title);

    // assign article type (i.e. section)
    var dom_type = document.createElement("H5");
    var type = document.createTextNode(article.category);
    type.className = "type";
    dom_type.appendChild(type);

    dom_sectionImage.appendChild(dom_type);

    var clearfix = document.createElement("div");
    clearfix.className = "clearfix";

    // assign article snippet (abstract, summary)
    var dom_sectionSnippet = document.createElement("SECTION");
    dom_sectionSnippet.className = "snippet";
    //var snippet = document.createTextNode(article.summary);
    dom_sectionSnippet.innerHTML = article.summary;
    dom_sectionTitle.appendChild(dom_sectionSnippet);

    dom_article.appendChild(dom_sectionImage);
    dom_article.appendChild(dom_sectionTitle);
    dom_article.appendChild(clearfix);

    dom_article.dataArticle = article;

    // add article to main
    var src = document.getElementById("main");
    src.appendChild(dom_article);
}

// add click events to articles
// on click display content in pop up
$("#main").on('click', '.article', function () {

    // get the popup container and clear it
    var container = document.getElementById('popUp').getElementsByClassName('container')[0];
    container.innerHTML = "";

    // add the content from the clicked article
    // title
    var section = document.createElement("SECTION");
    var title = document.createElement("H2");
    var titleText = document.createTextNode(this.dataArticle.title);
    title.appendChild(titleText);
    section.appendChild(title);

    // author
    var author = document.createElement("H3");
    var authorText = document.createTextNode(this.dataArticle.byline);
    author.appendChild(authorText);
    section.appendChild(author);

    //d ate
    var date = document.createTextNode(this.dataArticle.date);
    date.className = "dateText";
    section.appendChild(date);
    section.appendChild(document.createElement("div"));

    // image
    var dom_img = document.createElement("img");
    dom_img.src = this.dataArticle.imageUrl;
    dom_img.className = "featuredImage";
    section.appendChild(dom_img);

    container.appendChild(section);

    // summary/abstract
    var snippetPar = document.createElement("P");
    snippetPar.className = "summary";
    snippetPar.innerHTML = this.dataArticle.summary;
    section.appendChild(snippetPar);

    // button to view original article in new tab
    var link = document.createElement('a');
    link.setAttribute('class', 'popUpAction');
    link.setAttribute('href', this.dataArticle.url);
    link.setAttribute('target', '_blank');
    var linkText = document.createTextNode("Read more from source");
    link.appendChild(linkText);
    section.appendChild(link);

    $("#popUp").attr('class', 'popUpAction');

})

// an article class
function Article(title, byline, category, imageUrl, summary, url, date) {
    this.title = title;
    this.byline = byline;
    this.category = category;
    this.imageUrl = imageUrl;
    this.summary = summary;
    this.url = url;
    this.date = date;
}

// return today's date as YYYYMMDD
function getToday() {

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //Jan is 0
    var yyyy = today.getFullYear();

    // add zeros to support mmdd format
    if (dd < 10) {
        dd = '0' + dd
    }

    if (mm < 10) {
        mm = '0' + mm
    }

    return (yyyy + mm + dd);
}


$(document).ready(function () {

    // helper functions for adding articles to main
    function loadArticles(nytBoolean, guardianBoolean) {

        document.getElementById("main").innerHTML = "";
        if (nytBoolean) {
            for (var article in nytList) {
                addArticle(nytList[article]);
            }
        }

        if (guardianBoolean) {
            for (var article in guardianList) {
                addArticle(guardianList[article]);
            }
        }

    }

    // if click feeder button, show articles from all sources
    document.getElementById("feederButton").addEventListener("click", function () {

        document.getElementById("all").className = "hidden";
        document.getElementById("nytSource").className = "";
        document.getElementById("guardianSource").className = "";
        document.getElementById("currentSource").innerHTML = "News Source:<span> All</span>";

        loadArticles(true, true);
    });

    // when user clicks source, update main to show that source
    // update source value to selected/current source
    // hide current source from drop down
    document.getElementById("sourceList").addEventListener("click", function (e) {

        if (e.target.id == "nytSource") {

            e.target.className = "hidden";
            document.getElementById("guardianSource").className = "";
            document.getElementById("all").className = "";
            document.getElementById("currentSource").innerHTML = "News Source:<span> The New York Times</span>";

            loadArticles(true, false);

        } else if (e.target.id == "guardianSource") {

            e.target.className = "hidden";
            document.getElementById("nytSource").className = "";
            document.getElementById("all").className = "";
            document.getElementById("currentSource").innerHTML = "News Source:<span> The Guardian</span>";

            loadArticles(false, true);


        } else if (e.target.id == "all") {


            e.target.className = "hidden";
            document.getElementById("nytSource").className = "";
            document.getElementById("guardianSource").className = "";
            document.getElementById("currentSource").innerHTML = "News Source:<span> All</span>";

            loadArticles(true, true);

        }

    });

    // function to load source articles to main for the first time
    // hide loader in pop up and unhide close pop up x
    function loadArticlesIntoMainInitial() {

        if (callsComplete == totalCalls) {
            loadArticles(true, true);

            $("#popUp").attr('class', 'loader hidden');
            $("#popUpCloser").attr('class', 'closePopUp');
        }
    }


    // when close pop up x is clicked, hide the pop up
    $(".closePopUp").on('click', function () {
        $("#popUp").attr('class', 'loader hidden');

    });

    // variable to keep track of whether ajax calls finished (done or error)
    var callsComplete = 0;
    var totalCalls = 2;

    // lists to hold results from initial call
    var guardianList = [];
    var nytList = [];


    //////////////////////// AJAX Calls
    // NYTIMES, search term = "artificial intelligence"
    var url = "https://accesscontrolalloworiginall.herokuapp.com/https://api.nytimes.com/svc/search/v2/articlesearch.json";
    url +=
        "?" +
        $.param({
            "api-key": "1b5c0536a9cf49be87c49d7cc0e140c3",
            q: "artificial intelligence",
            begin_date: getToday(),
            sort: "newest",
            fl:
                "headline, web_url, snippet, abstract, source, pub_date, section_name, document_type, byline, multimedia",
            facet_field: "section_name, document_type"
        });

    $.ajax({
        url: url,
        method: "GET"
    })
        .done(function (result) {

            // increment complete calls counter
            // create article objects from results; add to nyt article list
            callsComplete++;
            var results = result.response.docs;
            results.forEach(function (article) {


                try {
                    var article = new Article(article.headline.main,
                        "",
                        article.section_name,
                        "https://www.nytimes.com/" + article.multimedia[0].url,
                        article.snippet,
                        article.web_url,
                        article.pub_date);
                    nytList.push(article);
                }
                catch (err) {
                    // do nothing
                }
            });

            // load articles into main if all ajax calls completed/errored out
            loadArticlesIntoMainInitial();


        })
        .fail(function (err) {

            // alert if call failed
            // increment call complete counter, load articles into main if all ajax calls completed/errored out
            alert("Could not load NYT feed.")
            callsComplete++;
            loadArticlesIntoMainInitial();

        });


    // THE GUARDIAN, search = "AI"
    var guardianUrl = "https://accesscontrolalloworiginall.herokuapp.com/http://content.guardianapis.com/search?page-size=30&section=technology&show-fields=body%2Cbyline%2Cthumbnail%2CtrailText&q=AI&order-by=newest";
    guardianUrl +=
        "&" +
        $.param({
            "api-key": "651aec01-89ea-423c-89b9-2bfdde0a303e"
        });

    $.ajax({
        url: guardianUrl,
        method: "GET"
    })
        .done(function (result) {

            // increment complete calls counter
            // create article objects from results; add to guardian article list
            callsComplete++;
            var results = result.response.results;
            results.forEach(function (article) {

                try {
                    var article = new Article(
                        article.webTitle,
                        article.fields.byline,
                        article.sectionName,
                        article.fields.thumbnail,
                        article.fields.trailText,
                        article.webUrl,
                        article.webPublicationDate
                    );
                    guardianList.push(article);
                }
                catch (err) {
                    // do nothing
                }
            });

            // load articles into main if all ajax calls completed/errored out
            loadArticlesIntoMainInitial();

        })
        .fail(function (err) {

            // alert if call failed
            // increment call complete counter, load articles into main if all ajax calls completed/errored out
            alert("Could not load Guardian feed.")
            callsComplete++;
            loadArticlesIntoMainInitial();

        });

});
