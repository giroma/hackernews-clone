// get top 500 stories
var topStories = [] //make the top stories array global for later use
var promises = [] //used to make sure the individual article ajax calls are all done before appending
function hackernewsTopStories() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = async function() {
    if (xmlhttp.readyState == XMLHttpRequest.DONE) {   // XMLHttpRequest.DONE == 4;
        if (xmlhttp.status == 200) {
          topStories = JSON.parse(xmlhttp.responseText); //populates the array with 500 articles
          for (var i = 0; i < 30; i++) {//run newPost function for 30 articles
            promises.push(newPost(topStories[i], i)) //each individual article ajax call is a promise
          }
          Promise.all(promises).then(function() {//make sure all 30 ajax calls are resolved
            var footer = document.querySelector("footer");
            for (var i = 0; i < 30; i++) {
              document.body.insertBefore(articles[i], footer)
            }
          })
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
var articles = []
// var listNumber = 1; //denotes the visual number for each article, incremented on append
function newPost(postNumber, index) {
  return new Promise(function(resolve, reject){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == XMLHttpRequest.DONE) {   // XMLHttpRequest.DONE == 4
        if (xmlhttp.status == 200) {
          var apiArticle = JSON.parse(xmlhttp.responseText);
          var footer = document.querySelector("footer");
          var url = apiArticle.url ? `(${new URL(apiArticle.url).hostname.replace("www.", "")})` : "" //empty url if none given from api
          var newArticle = document.createElement("article");
          newArticle.innerHTML = `
          <div class="article-title">
            <span class="number">${index + 1}.</span>
            <img class="arrow" src="images/arrow.gif" alt="arrow">
            <span class="title"><a href="${apiArticle.url}">${apiArticle.title}</a></span>
            <span class="url">${url}</span>
          </div>
          <div class="article-details">
            <span>${apiArticle.score}</span>
            <span>points by</span>
            <span><a href="https://news.ycombinator.com/user?id=${apiArticle.by}">${apiArticle.by}</a></span>
            <span><a href="https://news.ycombinator.com/item?id=${postNumber}">${parseTime(apiArticle.time)}</a></span>
            <span>|</span>
            <span>hide</span>
            <span>|</span>
            <span><a href="https://news.ycombinator.com/item?id=${postNumber}">${apiArticle.descendants} comments</a></span>
          </div>
          <div class="spacer" style="height: 5px; background-color: #f6f6ef">
          </div> `
          articles[index] = newArticle //place article in array with index matching its
          resolve()//resolve the promise
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
  })
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
    for (var i = paginationNumber*30; i < paginationNumber*30+30; i++) {
      promises.push(newPost(topStories[i], i)) //run newPost function for 30 articles
    }
    Promise.all(promises).then(function() {//make sure all 30 ajax calls are resolved
      var footer = document.querySelector("footer");
      for (var i = paginationNumber*30; i < paginationNumber*30+30; i++) {
        document.body.insertBefore(articles[i], footer)
      }
      paginationNumber += 1;
    })
  }
});

hackernewsTopStories()
