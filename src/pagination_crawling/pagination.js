/***********************************************\
            Script to crawl through
                 multiple pages
               
                       by
                       
                Code Monkey King
              
\***********************************************/

// import JQuery
var jq = document.createElement('script');
jq.src = 'https://code.jquery.com/jquery-3.5.1.min.js';
document.getElementsByTagName('head')[0].append(jq)

// pagination crawler method
function crawlNextPage() {
  // open URL in a new window
  var response = window.open('http://quotes.toscrape.com', 'new', true);

  // init window onload function
  response.onload = function crawlNextPage() {
    // wait until content is fetched on a newly created window
    setTimeout(function () {
      if ($(response.document).find('li[class="next"] a')[0]) {  
        // print debug info
        console.log('crawling next page...');
        
        // data extraction logic
        var quote = $(response.document).find('span[class="text"]').text();
        console.log(quote);

        //extract and click next page URL
        $(response.document).find('li[class="next"] a')[0].click();

        // crawl pagination recursively
        crawlNextPage();
      } else {
        console.log('All done!');
      }
    },1000) // crawl delay
  };
}

// wait until JQuery is loaded
setTimeout(crawlNextPage(), 1000)
