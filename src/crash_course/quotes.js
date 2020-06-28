/***********************************************\
            Script to download quotes
               in JSON/CSV formats
               
                       by
                       
                Code Monkey King
              
\***********************************************/

/***********************************************\
               HOW TO RUN IT

1. Navigate to "http://quotes.toscrape.com"
2. Copy this file's content and paste into
   Chrome developer tools console and run it
3. You should get 'quotes.json' and 'quotes.csv'
   files being downloaded.

\***********************************************/

// import JQuery
var jq = document.createElement('script');
jq.src = 'https://code.jquery.com/jquery-3.5.1.min.js';
document.getElementsByTagName('head')[0].append(jq)

// extract data
setTimeout(function() {
  // quotes list
  quotes = [];

  // loop over the range of pages
  for (var page = 1; page < 3; page++)
    // make HTTP request to the target page URL
    fetch('http://quotes.toscrape.com/page/' + page.toString() + '/')
      // extract HTML from response object
      .then(response => response.text())

      // parse HTML
      .then(content => $(content).find('div[class="quote"]').each(function() {
        // current quote's data
        var quote = {
          'quote': $(this).find('span[class="text"]').text(),
          'author': $(this).find('small[class="author"]').text(),
          'tags': []
        };

        // loop over tags
        $(this).find('a[class="tag"]').each(function() {
          // current tag data
          var tag = {
            'name': $(this).text(),
            'url': $(this).attr('href')
          }

          // append tag to quote
          quote.tags.push(tag);
        })

        // append quote to quotes list
        quotes.push(quote);
      }))

}, 1000);

// download JSON/CSV files
setTimeout(function() {
  /*__JSON__*/
  
  // create JSON download link
  $('head').append('<a download="quotes.json"></a>');
  
  // create object URL
  $('a[download="quotes.json"]').attr('href', window.URL.createObjectURL(
    new Blob([JSON.stringify(quotes, null, 2)], {type: 'text'})
  ));
  
  // click JSON download link
  $('a[download="quotes.json"]')[0].click()

  /*__CSV__*/
  
  // create CSV output
  csv = 'quote,author\n';

  // loop over quotes
  $.each(quotes, function(index) {
    // create row string
    var row = '';

    // loop over object values within a given quote
    $.each(this, function(key, val) {
      if (key == 'quote' || key == 'author')
        row += '"' + val + '"' + ','
    });

    // slice last coma
    row = row.slice(0, -1);

    // append new line feed to the row
    row += '\n';

    // append row to csv  
    csv += row;
  });
  
  // create download link
  $('head').append('<a download="quotes.csv"></a>');
  
  // create object URL
  $('a[download="quotes.csv"]').attr('href', window.URL.createObjectURL(
    new Blob([csv], {type: 'text/csv'})
  ));
  
  // click download link
  $('a[download="quotes.csv"]')[0].click()

}, 2000)

 
   

     
  
