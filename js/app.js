$(document).ready(function() {
    $.get("https://accesscontrolalloworiginall.herokuapp.com/http://digg.com/api/news/popular.json", function(results){
        console.log("hi");
        console.log(results);
        // results.data.feed.forEach(function(result){
        //     $("ul").append("<li>"+result.content.title+"</li>");
        // });
    });

    var root = 'https://jsonplaceholder.typicode.com';

    // $.ajax({
    //     url: root + '/posts/1',
    //     method: 'GET'
    // }).then(function(data) {
    //     $('p:first-of-type').html(JSON.stringify(data));
    //     // Let's insert the "title" into the p with id "title" and the "body" into the p with id "body"
    // });

    // Built by LucyBot. www.lucybot.com
    var url = "https://api.nytimes.com/svc/suggest/v1/timestags.json";
    url += '?' + $.param({
        'api-key': "1b5c0536a9cf49be87c49d7cc0e140c3"
    });
    $.ajax({
        url: url,
        method: 'GET',
    }).then(function(result) {
        console.log(result);
    });
});
