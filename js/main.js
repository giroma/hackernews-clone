// get top 500 stories
function hackernewsTopStories() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = async function() {
    if (xmlhttp.readyState == XMLHttpRequest.DONE) {   // XMLHttpRequest.DONE == 4
       if (xmlhttp.status == 200) {
         var topStories = JSON.parse(xmlhttp.responseText);
         for (var i = 0; i < 31; i++) {
           newPost(topStories[i]) //run newPost function for 30 articles
         }
       }
       else if (xmlhttp.status == 400) {
          alert('There was an error 400');
       }
       else {
           alert('something else other than 200 was returned');
       }
    }
  };

  xmlhttp.open("GET", "https://hacker-news.firebaseio.com/v0/topstories.json");
  xmlhttp.send();
}
//ajax call and append for each article number
var listNumber = 1;
function newPost(postNumber) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == XMLHttpRequest.DONE) {   // XMLHttpRequest.DONE == 4
       if (xmlhttp.status == 200) {
         var apiArticle = JSON.parse(xmlhttp.responseText);
         var footer = document.querySelector("footer")
         var hostname = apiArticle.url.replace('http://','').replace('https://','').replace('www.','').split(/[/?#]/)[0]; //parse url into only hostname
         var newArticle = document.createElement("article");
         newArticle.innerHTML = `
         <div class="article-title">
           <span class="number">${listNumber}.</span>
           <img class="arrow" src="images/arrow.gif" alt="arrow">
           <span class="title"><a href="${apiArticle.url}">${apiArticle.title}</a></span>
           <span class="url">(${hostname})</span>
         </div>
         <div class="article-details">
           <span>${apiArticle.score}</span>
           <span>points by</span>
           <span>${apiArticle.by}</span>
           <span>${apiArticle.time}</span>
           <span>|</span>
           <span>hide</span>
           <span>|</span>
           <span>${apiArticle.descendants}</span>
           <span>comments</span>
         </div>
         <div class="spacer" style="height: 5px; background-color: #f6f6ef">
         </div>`;
         document.body.insertBefore(newArticle, footer);

         listNumber += 1;
       }
       else if (xmlhttp.status == 400) {
          alert('There was an error 400');
       }
       else {
           alert('something else other than 200 was returned');
       }
    }
  };

  xmlhttp.open("GET", "https://hacker-news.firebaseio.com/v0/item/"+postNumber+".json");
  xmlhttp.send();
}

hackernewsTopStories()
