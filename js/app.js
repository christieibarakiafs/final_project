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

    var dom_type = document.createElement("H6");
    var type = document.createTextNode(article.category);
    dom_type.appendChild(type);
    dom_sectionTitle.appendChild(dom_type);

    var clearfix = document.createElement("div");
    clearfix.className = "clearfix";

    dom_article.appendChild(dom_sectionImage);
    dom_article.appendChild(dom_sectionTitle);
    dom_article.appendChild(clearfix);

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

function Article(title, category, imageUrl, summary, url, date) {
    this.title = title;
    this.category = category;
    this.imageUrl = imageUrl;
    this.summary = summary;
    this.url = url;
    this.date = date;
}

function getNytArticles(){
    var result = [];
}

var guardianList = [];
var nytList = [];

$(document).ready(function() {


    var url = "https://accesscontrolalloworiginall.herokuapp.com/https://api.nytimes.com/svc/search/v2/articlesearch.json";
    url +=
        "?" +
        $.param({
            "api-key": "1b5c0536a9cf49be87c49d7cc0e140c3",
            q: "artificial intelligence",
            begin_date: "20180101",
            fl:
                "headline, web_url, snippet, abstract, source, pub_date, section_name, document_type, multimedia",
            facet_field: "section_name, document_type"
        });
    $.ajax({
        url: url,
        method: "GET"
    })
        .done(function(result) {
            var results = result.response.docs;
            results.forEach(function(article) {

                var article = new Article(article.headline.main,
                    article.section_name,
                    "https://www.nytimes.com/" + article.multimedia[2].url,
                    article.snippet,
                    article.web_url,
                    article.pub_date);
                nytList.push(article);
            });

        })
        .fail(function(err) {
            throw err;
        });

    var guardianUrl = "https://accesscontrolalloworiginall.herokuapp.com/http://content.guardianapis.com/search?page-size=20&section=technology&show-fields=body%2Cthumbnail%2CtrailText&q=AI";
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
            var results = result.response.results;
            results.forEach(function(article) {
                var article = new Article(
                    article.webTitle,
                    article.sectionName,
                    article.fields.thumbnail,
                    article.fields.trailText,
                    article.webUrl,
                    article.webPublicationDate
                );
                guardianList.push(article);
            });
            for(article in guardianList){
                addArticle(guardianList[article]);
            }
        })
        .fail(function(err) {
            throw err;
        });

    console.log(guardianList[0]);

});
