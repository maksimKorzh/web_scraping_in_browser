/***********************************************\
     Script to scrape real estate properties
      from idealista.com in JSON/CSV format
               
                       by
                       
                Code Monkey King
              
\***********************************************/

// postal codes
var postcodes = [3001, 6000]

// postal codes count
var postcodesCount = 0;

// listings count
var listingsCount = 0;

// selectors
var cardSelector = 'article[class="item item-multimedia-container"]';
var linkSelector = 'a[class="item-link "]';

// output data
properties = [];

// crawl delay
var crawlDelay = 2000;

function crawlNextPostcode() {
  // open idealista window
  var idealista = window.open('https://www.idealista.com/en/', 'idealista', true)
  console.log('postcode:', postcodes[postcodesCount]);
  // set up search query
  setTimeout(() => {
    // select commercial properties
    $(idealista.document).find('ul[class="dropdown"]')
                         .find('li[data-value="warehouse"]')
                         .addClass('active')
    
    // select properties for sale
    $(idealista.document).find('input[value="sale"]')
                         .attr('checked', 'checked')

    // select postal code
    $(idealista.document).find('input[id="campoBus"]')
                         .val(postcodes[postcodesCount++])
    
    // search properties
    $(idealista.document).find('button[id="btn-free-search"]')[0].click();
    
    // crawl through pages
    setTimeout(() => {
      // extract postcode from URL
      postcode = idealista.location.href.split('/')[6];
    
      // crawl next page
      crawlNextPage(idealista, postcode);

    }, crawlDelay * 2)
    
  }, crawlDelay * 2)
}

function crawlNextPage(idealista, postcode) {
  // reset listings count
  listingsCount = 0;
  
  var page = [];
  
  // crawl through property listings
  crawlNextListing(idealista, postcode, page);
  
}

function crawlNextListing(idealista, postcode, page) {
  // click on property link
  if ($(idealista.document).find(cardSelector)[listingsCount]) {
    $($(idealista.document).find(cardSelector)[listingsCount++])
                           .find(linkSelector)[0]
                           .click();
    // extract data
    setTimeout(() => {
      // property features
      var features = {
        'id': idealista.location.href.split('/?')[0].split('/')[5],
        'url': idealista.location.href,
        'postcode': postcode,
        
        'title': $(idealista.document).find('span[class="main-info__title-main"]')
                                      .text(),
        
        'address': $(idealista.document).find('span[class="main-info__title-minor"]')
                                        .text(),
        
        'price': $(idealista.document).find('span[class="info-data-price"]').text()      
      };
      
      // store data
      console.log(features);
      page.push(features);
      properties.push(features);
      
      // go back
      idealista.history.back();
      
      // crawl through property listings
      setTimeout(() => {
        if (listingsCount < 2) // $(idealista.document).find(cardSelector).length
          crawlNextListing(idealista, postcode, page);
        else {
          /* Uncomment to download data per page
          
          // download data from page
          $(idealista.document).find('head')
                               .append('<a download="page.json"></a>');
          
          $(idealista.document).find('head')
                               .find('a[download="page.json"]')
                               .attr('href', idealista.URL.createObjectURL(
                                 new Blob([JSON.stringify(page, null, 2)], {type: 'text'}) 
                               ));
          
          $(idealista.document).find('head')
                               .find('a[download="page.json"]')[0]
                               .click();
          */
          
          // crawl next page
          if ($(idealista.document).find('li[class="next"] a')[0]) {
            console.log($(idealista.document).find('li[class="next"] a')[0]);
            $(idealista.document).find('li[class="next"] a')[0]
                                 .click();
            
            setTimeout(() => {
              crawlNextPage(idealista, postcode);
            }, crawlDelay);
            
          } else {
            // crawl next postal code
            if (postcodesCount < postcodes.length) {
              idealista = undefined;
              crawlNextPostcode();
            } else {
              // download data from page
              $(idealista.document).find('head')
                                   .append('<a download="commercial_sale.json"></a>');
              
              $(idealista.document).find('head')
                                   .find('a[download="commercial_sale.json"]')
                                   .attr('href', idealista.URL.createObjectURL(
                                     new Blob([JSON.stringify(properties, null, 2)], {type: 'text'}) 
                                   ));
              
              $(idealista.document).find('head')
                                   .find('a[download="commercial_sale.json"]')[0]
                                   .click();
            }
          }

        }

      }, crawlDelay * 3);

    }, crawlDelay * 2);
  
  }

}

// start crawler
crawlNextPostcode();
