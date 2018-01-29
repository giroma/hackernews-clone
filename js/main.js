// get top 500 stories
function hackernewsTopStories() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {   // XMLHttpRequest.DONE == 4
           if (xmlhttp.status == 200) {
             var topStories = JSON.parse(xmlhttp.responseText);
             for (var i = 0; i < 30; i++) {
               newPost(topStories[i], i)
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

function newPost(postNumber, i) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == XMLHttpRequest.DONE) {   // XMLHttpRequest.DONE == 4
       if (xmlhttp.status == 200) {
         var apiArticle = JSON.parse(xmlhttp.responseText);
         console.log(apiArticle);
         var newArticle = document.createElement("article");
         newArticle.innerHTML = `
         <div class="article-title">
           <span class="number">${i+1}.</span>
           <img class="arrow" src="images/arrow.gif" alt="arrow">
           <span class="title"><a href="${apiArticle.url}">${apiArticle.title}</a></span>
           <span class="url">(${apiArticle.url})</span>
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

         document.body.appendChild(newArticle);

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
