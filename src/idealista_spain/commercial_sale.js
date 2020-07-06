/***********************************************\
     Script to scrape real estate properties
      from idealista.com in JSON/CSV format
               
                       by
                       
                Code Monkey King
              
\***********************************************/

// postal codes
var postcodes = [3001, 6001, 6002, 6003]

// postal codes count
var postcodesCount = 0;

// listings count
var listingsCount = 0;

// selectors
var cardSelector = 'article.item';
var linkSelector = 'a[class="item-link "]';

// output data
properties = [];

// crawl delay
var crawlDelay = 1500;

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
        
        'price': $(idealista.document).find('span[class="info-data-price"]').text(),
        
        'price_details': $(idealista.document).find('section[class="price-features__container"]')
                                    .text()
                                    .split('  ')
                                    .slice(1, 3)
                                    .map((item) => {
                                      return item.trim();
                                    }),               
                        
            
        'last_updated': $(idealista.document).find('div[id="stats"] p')
                                             .text(),

        'floor_area': $($(idealista.document).find('div[class="info-features"] span')[0])
                                             .text()
                                             .trim(),

        'image_urls': [],
        
        'agent_name': $(idealista.document).find('div[class="professional-name"] span')
                                           .text()
                                           .trim(),

        'agent_link': 'https://www.idealista.com' + 
                      $(idealista.document).find('a[class="about-advertiser-name"]')
                                           .attr('href'),

        'agent_phone': $(idealista.document).find('span[class="phone-btn-number"]')
                                            .text(),

        'full_description': $(idealista.document).find('div[class="adCommentsLanguage expandable"]')
                                                 .text()
                                                 .replace('"', '')
                                                 .trim(),
        
        'key_features': Array.from($(idealista.document)
                             .find('div[class="details-property-feature-one"]')
                             .find('div[class="details-property_features"] li')
                             .map((index, item) => {
                               return $(item).text()
                                             .trim();
                             })).concat(
                               'Energy efficiency rating: ' +

                               $(idealista.document).find('div[class="details-property-feature-one"] ul')
                                          .text()
                                          .split('Energy efficiency rating:')
                                          .slice(-1)
                                          .join()
                                          .trim()                      
                             ),
         
        'building_fabric': Array.from($($(idealista.document)
                                .find('div[class="details-property-feature-two"]')
                                .find('div[class="details-property_features"]')[1])
                                .find('li')
                                .filter((index, item) => {
                                  if ($(item).text().trim().length > 1)
                                    return $(item).text()
                                                  .trim();
                                })
                                .map((index, item) => {
                                  return $(item).text()
                                                .trim();
                                })),

        'amenities': Array.from($($(idealista.document)
                          .find('div[class="details-property-feature-two"]')
                          .find('div[class="details-property_features"]')[1])
                          .find('li')
                          .filter((index, item) => {
                           if ($(item).text().trim().length > 1)
                             return $(item).text()
                                           .trim();
                           })
                          .map((index, item) => {
                            return $(item).text()
                                         .trim();
                                })),

        'location': Array.from($(idealista.document)
                         .find('div[id="headerMap"] li')
                         .filter((index, item) => {
                           if ($(item).text().trim().length > 1)
                             return $(item).text()
                                           .trim();
                         })
                         .map((index, item) => {
                           return $(item).text()
                                         .trim();
                         })),
        
        'coordinates': {
            'latitude': '',
            'longitude': ''
        }

      };
      
      // extract images
      try {
          features.image_urls = idealista.adMultimediasInfo.fullScreenGalleryPics
                                         .map((item) => {
                                           return item.src;
                                         })
      } catch(error) {
        console.log(error);
      }
      
      // extract coordinates
      try {
        features.coordinates = {
            'latitude': idealista.mapConfig.latitude,
            'longitude': idealista.mapConfig.longitude
        }
      } catch(error) {
        console.log(error);
      }
      
      // store data
      console.log(features);
      page.push(features);
      properties.push(features);
      
      // go back
      idealista.history.back();
      
      // crawl through property listings
      setTimeout(() => {
        if (listingsCount < $(idealista.document).find(cardSelector).length)
          crawlNextListing(idealista, postcode, page);
        else {          
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
              // filename
              var filename = new Date();
              
              filename = 'Commercial_Sale_' + 
                         filename.getFullYear() + '-' + 
                         filename.getMonth().toString().padStart(2, '0') + '-' + 
                         filename.getDate().toString().padStart(2, '0') + '-' + 
                         filename.getHours().toString().padStart(2, '0') + '-' + 
                         filename.getMinutes().toString().padStart(2, '0') +
                         '.json';
            
              // download data from page
              $(idealista.document).find('head')
                                   .append('<a download="' + filename + '"></a>');
              
              $(idealista.document).find('head')
                                   .find('a[download="' + filename + '"]')
                                   .attr('href', idealista.URL.createObjectURL(
                                     new Blob([JSON.stringify(properties, null, 2)], {type: 'text'}) 
                                   ));
              
              $(idealista.document).find('head')
                                   .find('a[download="' + filename + '"]')[0]
                                   .click();
            }
          }

        }

      }, crawlDelay * 3);

    }, crawlDelay * 3);
  
  } else {
    console.log('postcode not available')
  
    // crawl next postal code
    if (postcodesCount < postcodes.length) {
      idealista = undefined;
      crawlNextPostcode();
    } else {
      // filename
      var filename = new Date();
      
      filename = 'Commercial_Sale_' + 
                 filename.getFullYear() + '-' + 
                 filename.getMonth().toString().padStart(2, '0') + '-' + 
                 filename.getDate().toString().padStart(2, '0') + '-' + 
                 filename.getHours().toString().padStart(2, '0') + '-' + 
                 filename.getMinutes().toString().padStart(2, '0') +
                 '.json';
    
      // download data from page
      $(idealista.document).find('head')
                           .append('<a download="' + filename + '"></a>');
      
      $(idealista.document).find('head')
                           .find('a[download="' + filename + '"]')
                           .attr('href', idealista.URL.createObjectURL(
                             new Blob([JSON.stringify(properties, null, 2)], {type: 'text'}) 
                           ));
      
      $(idealista.document).find('head')
                           .find('a[download="' + filename + '"]')[0]
                           .click();
    }
  }

}

// start crawler
crawlNextPostcode();
