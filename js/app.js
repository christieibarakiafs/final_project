function Article(title, category, imageUrl, summary, url, date) {
    this.title = title;
    this.category = category;
    this.imageUrl = imageUrl;
    this.summary = summary;
    this.url = url;
    this.date = date;
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
                    article.multimedia[2].url,
                    article.snippet,
                    article.web_url,
                    article.pub_date);
                nytList.push(article);
            });
            console.log(nytList);
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
            console.log(guardianList);
        })
        .fail(function(err) {
            throw err;
        });
});
