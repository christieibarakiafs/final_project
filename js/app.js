function addArticle(article){

    var dom_article= document.createElement("ARTICLE");
    dom_article.className ="article";

    var dom_sectionImage = document.createElement("SECTION");
    dom_sectionImage.className ="featuredImage";

    var dom_img = document.createElement("img");
    dom_img.src = article.imageUrl;

    dom_sectionImage.appendChild(dom_img);

    var dom_sectionTitle = document.createElement("SECTION");
    dom_sectionTitle.className = "articleContent";

    var dom_title = document.createElement("H3");
    var title = document.createTextNode(article.title);
    dom_title.appendChild(title);
    dom_sectionTitle.appendChild(dom_title);

    var dom_type = document.createElement("H5");
    var type = document.createTextNode(article.category);
    type.className = "type";
    dom_type.appendChild(type);

    dom_sectionImage.appendChild(dom_type);

    var clearfix = document.createElement("div");
    clearfix.className = "clearfix";

    var dom_sectionSnippet = document.createElement("SECTION");
    dom_sectionSnippet.className = "snippet";
    var snippet = document.createTextNode(article.summary);
    dom_sectionSnippet.appendChild(snippet);
    dom_sectionTitle.appendChild(dom_sectionSnippet);

    dom_article.appendChild(dom_sectionImage);
    dom_article.appendChild(dom_sectionTitle);
    dom_article.appendChild(clearfix);

    dom_article.dataArticle = article;

    var src = document.getElementById("main") ;
    src.appendChild(dom_article);
}

// <article class="article">
//     <section class="featuredImage">
//     <img src="images/article_placeholder_1.jpg" alt="" />
//     </section>
//     <section class="impressions">
//     526
//     </section>
//     <section class="articleContent">
//     <a href="#"><h3>Test article title</h3></a>
// <h6>Lifestyle</h6>
// </section>
// <div class="clearfix"></div>
//     </article>

function Article(title, byline, category, imageUrl, summary, url, date) {
    this.title = title;
    this.byline = byline;
    this.category = category;
    this.imageUrl = imageUrl;
    this.summary = summary;
    this.url = url;
    this.date = date;
}

$(document).ready(function() {

    var callsComplete = 0;

    var guardianList = [];
    var nytList = [];


    $(".closePopUp").on('click', function(){
        $("#popUp").attr('class', 'loader hidden');

    });

    var url = "https://accesscontrolalloworiginall.herokuapp.com/https://api.nytimes.com/svc/search/v2/articlesearch.json";
    url +=
        "?" +
        $.param({
            "api-key": "1b5c0536a9cf49be87c49d7cc0e140c3",
            q: "artificial intelligence",
            begin_date: "20180101",
            fl:
                "headline, web_url, snippet, abstract, source, pub_date, section_name, document_type, byline, multimedia",
            facet_field: "section_name, document_type"
        });

    $.ajax({
        url: url,
        method: "GET"
    })
        .done(function(result) {
            callsComplete ++;
            var results = result.response.docs;
            results.forEach(function(article) {

                var article = new Article(article.headline.main,
                    "",
                    article.section_name,
                    "https://www.nytimes.com/" + article.multimedia[0].url,
                    article.snippet,
                    article.web_url,
                    article.pub_date);
                nytList.push(article);
                addArticle(article);
            });

            if(callsComplete==2){
                $("#popUp").attr('class', 'loader hidden');
            }

        })
        .fail(function(err) {
            throw err;
        });


// <div id="popUp" class="loader hidden">
//         <a href="#" class="closePopUp">X</a>
//         <div class="container">
//         <section>
//         <h1>Article title here</h1>
//     <p>Article description/content here.</p>
//     <a href="#" class="popUpAction" target="_blank">Read more from source</a>
//
//     </section>
//     </div>
//     </div>

    var guardianUrl = "https://accesscontrolalloworiginall.herokuapp.com/http://content.guardianapis.com/search?page-size=20&section=technology&show-fields=body%2Cbyline%2Cthumbnail%2CtrailText&q=AI";
    guardianUrl +=
        "&" +
        $.param({
            "api-key": "651aec01-89ea-423c-89b9-2bfdde0a303e"
        });

    $.ajax({
        url: guardianUrl,
        method: "GET"
    })
        .done(function(result) {
            callsComplete ++;
            var results = result.response.results;
            results.forEach(function(article) {
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
                addArticle(article);
            });


            if(callsComplete==2){
                $("#popUp").attr('class', 'loader hidden');
                $("#popUpCloser").attr('class', 'closePopUp');

            }

            $(".article").on('click', function(){
                //$("#popUp").attr('class', 'popUpAction');

                var container = document.getElementById('popUp').getElementsByClassName('container')[0];
                container.innerHTML = "";

                var section = document.createElement("SECTION");
                var title = document.createElement("H2");
                var titleText = document.createTextNode(this.dataArticle.title);
                title.appendChild(titleText);
                section.appendChild(title);

                var author = document.createElement("H3");
                var authorText = document.createTextNode(this.dataArticle.byline);
                author.appendChild(authorText);
                section.appendChild(author);

                var date = document.createTextNode(this.dataArticle.date);
                date.className = "dateText";
                section.appendChild(date);
                section.appendChild(document.createElement("div"));

                var dom_img = document.createElement("img");
                dom_img.src = this.dataArticle.imageUrl;
                dom_img.className = "featuredImage";
                section.appendChild(dom_img);

                container.appendChild(section);

                var snippetPar = document.createElement("P");
                var snippetText = document.createTextNode(this.dataArticle.summary);
                snippetText.className = "summary";
                snippetPar.appendChild(snippetText);
                section.appendChild(snippetPar);

                var link= document.createElement('a');
                link.setAttribute('class', 'popUpAction');
                link.setAttribute('href', this.dataArticle.url);
                link.setAttribute('target', '_blank');
                var linkText = document.createTextNode("Read more from source");
                link.appendChild(linkText);
                section.appendChild(link);



                $("#popUp").attr('class', 'popUpAction');

            });
        })
        .fail(function(err) {
            throw err;
        });


});
