$(document).ready(function() {
    $.get("https://accesscontrolalloworiginall.herokuapp.com/http://digg.com/api/news/popular.json", function(results){
        console.log("hi");
        console.log(results);
        // results.data.feed.forEach(function(result){
        //     $("ul").append("<li>"+result.content.title+"</li>");
        // });
    });
});
