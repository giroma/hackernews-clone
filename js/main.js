// get top 500 stories
var topStories = [] //make the top stories array global for later use
function hackernewsTopStories() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = async function() {
    if (xmlhttp.readyState == XMLHttpRequest.DONE) {   // XMLHttpRequest.DONE == 4
       if (xmlhttp.status == 200) {
         topStories = JSON.parse(xmlhttp.responseText); //populates the array with 500 articles
         for (var i = 0; i < 30; i++) {
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
var listNumber = 1; //denotes the visual number for each article, incremented on append
function newPost(postNumber) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == XMLHttpRequest.DONE) {   // XMLHttpRequest.DONE == 4
       if (xmlhttp.status == 200) {
         var apiArticle = JSON.parse(xmlhttp.responseText);
         var footer = document.querySelector("footer");
         var hostname = apiArticle.url || ""; //empty url if none given from api, this way replace doesnt error
         var hostname = hostname.replace('http://','').replace('https://','').replace('www.','').split(/[/?#]/)[0]; //parse url into only hostname
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
           <span>${parseTime(apiArticle.time)}</span>
           <span>|</span>
           <span>hide</span>
           <span>|</span>
           <span>${apiArticle.descendants}</span>
           <span>comments</span>
         </div>
         <div class="spacer" style="height: 5px; background-color: #f6f6ef">
         </div> `
         document.body.insertBefore(newArticle, footer);

         listNumber += 1; //add to
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

var parseTime = function(date) { //parses unix time into timeago display
  var seconds = Math.floor((new Date(Date.now()) - (date+'000')) / 1000);
  var interval = Math.floor(seconds / 31536000);
  if (interval > 1) {
    return interval + " years ago";
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return interval + " months ago";
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return interval + " days ago";
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return interval + " hours ago";
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return interval + " minutes ago";
  }
  return Math.floor(seconds) + " seconds ago";
}
//calculates distance from bottom of window
function getDistFromBottom() {
  var scrollPosition = window.pageYOffset;
  var windowSize     = window.innerHeight;
  var bodyHeight     = document.body.offsetHeight;
  return Math.max(bodyHeight - (scrollPosition + windowSize), 0);
}

var paginationNumber = 1; //start at 1 and increments for each pagination
document.addEventListener('scroll', function() {
  if (getDistFromBottom() === 0) {; //if the scroll gets to zero
    for (i = paginationNumber*30; i < paginationNumber*30+30; i++) {
      newPost(topStories[i]) //run newPost function for 30 articles
    }
    paginationNumber += 1;
  }
});

hackernewsTopStories()
