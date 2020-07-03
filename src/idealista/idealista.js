/***********************************************\
     Script to scrape real estate properties
      from idealista.com in JSON/CSV format
               
                       by
                       
                Code Monkey King
              
\***********************************************/

/***********************************************\
       CRAWL THROUGH PAGES & SCRAPE DATA
 paste & run below (all up to "DOWNLOAD" section)
          in Chrome Devtools Console
              
\***********************************************/

// page counter
var page = 1;

// properties
var properties = [];

// pagination crawler method
function crawlNextPage() {
  // open URL in a new window
  var response = window.open('https://www.idealista.com/en/venta-viviendas/madrid-madrid/', 'new', true);

  // init window onload function
  response.onload = function crawlNextPage() {
    // wait until content is fetched on a newly created window
    setTimeout(function () {
      if ($(response.document).find('li[class="next"] a')[0]) {  
        // print debug info
        console.log('crawling next page...');
        
        // data extraction logic
        $(response.document).find('article[class="item item_contains_branding item_hightop item-multimedia-container"]').each(function() {
          // extract features
          var features = {
            'title': $(this).find('a[class="item-link "]')
                            .text(),
            
            'details_url': 'https://www.idealista.com/' + $(this).find('a[class="item-link "]')
                                  .attr('href'),

            'price': $(this).find('span[class="item-price h2-simulated"]')
                            .text(),

            'details': '',

            'description': $(this).find('div[class="item-description description"]')
                                  .text()
                                  .trim(),

            'phone': $(this).find('a[class="icon-phone phone-btn item-clickable-phone"]')
                            .attr('href')
                            .split(':')[1]
          };

          // extract item details
          $(this).find('span[class="item-detail"]').each(function() {
            features.details += ' ' + $(this).text();
          });

          // strip item details
          features.details = features.details.trim()

          // store item in properties list
          console.log(features);
          properties.push(features);
        });
        

        //extract and click next page URL
        $(response.document).find('li[class="next"] a')[0].click();

        // increment page counter
        page++;

        // crawl pagination recursively (remove page condition to crawl through ALL pages)
        if (page < 10)
          crawlNextPage();
        else
          console.log('Reached page limit number!');
      } else {
        console.log('All done!');
      }
    },3000) // crawl delay
  };
}

// start crawling
crawlNextPage();

/***********************************************\
       DOWNLOAD DATA IN JSON/CSV FORMATS
      paste & run this to Chrome Devtools
    console after above crawling is finished
              
\***********************************************/

/*__JSON__*/
  
// create JSON download link
$('head').append('<a download="properties.json"></a>');

// create object URL
$('a[download="properties.json"]').attr('href', window.URL.createObjectURL(
  new Blob([JSON.stringify(properties, null, 2)], {type: 'text'})
));

// click JSON download link
$('a[download="properties.json"]')[0].click()

/*__CSV__*/

// create CSV output
csv = 'title,details URL,price,details,description,phone\n';

// loop over properties
$.each(properties, function(index) {
  // create row string
  var row = '';

  // loop over object values within a given quote
  $.each(this, function(key, val) {
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
$('head').append('<a download="properties.csv"></a>');

// create object URL
$('a[download="properties.csv"]').attr('href', window.URL.createObjectURL(
  new Blob([csv], {type: 'text/csv'})
));

// click download link
$('a[download="properties.csv"]')[0].click()
  
  
  
