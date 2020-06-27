/*************************************************************

    NAVIGATE TO: https://www.rightmove.co.uk/property-for-sale/find.html?searchType=SALE&locationIdentifier=OUTCODE%5E523&insId=1&radius=0.0&minPrice=&maxPrice=&minBedrooms=&maxBedrooms=&displayPropertyType=&maxDaysSinceAdded=&_includeSSTC=on&sortByPriceDescending=&primaryDisplayPropertyType=&secondaryDisplayPropertyType=&oldDisplayPropertyType=&oldPrimaryDisplayPropertyType=&newHome=&auction=false
    AND INVOKE DEVTOOLS BY PRESSING "Ctrl-Shift-i"

**************************************************************/



/*************************************************************

    FIRST COPY, PASTE AND RUN THESE LINES TO CHROME DEVTOOLS

**************************************************************/

// import jquery
var jq = document.createElement('script');
jq.src = 'https://code.jquery.com/jquery-3.5.1.min.js';
document.getElementsByTagName('head')[0].append(jq);


/*************************************************************

    THEN COPY, PASTE AND RUN THESE LINES TO CHROME DEVTOOLS

**************************************************************/

// scraped data
properties = [];

// loop over the range of pages
for (var page = 1; page <= 4; page++)   
  // make HTTP request 
  fetch('https://www.rightmove.co.uk/property-for-sale/find.html?searchType=SALE&locationIdentifier=OUTCODE%5E523&insId=1&radius=0.0&minPrice=&maxPrice=&minBedrooms=&maxBedrooms=&displayPropertyType=&maxDaysSinceAdded=&_includeSSTC=on&sortByPriceDescending=&primaryDisplayPropertyType=&secondaryDisplayPropertyType=&oldDisplayPropertyType=&oldPrimaryDisplayPropertyType=&newHome=&auction=false&offset=' + (page * 24).toString())
    // extract HTML
    .then(data => data.text())
    
    // extract data
    .then(data => $(data).find('div[class="propertyCard-wrapper"]').each(function(index) {
      var features = {
        'title': $(this).find('h2[class="propertyCard-title"]')
                        .text()
                        .trim(),

        'address': $(this).find('meta[itemprop="streetAddress"]')
                          .attr('content'),

        'price': $(this).find('div[class="propertyCard-priceValue"]')
                        .text()
                        .trim(),

        'description': $(this).find('span[itemprop="description"]')
                              .text(),

        'date': $(this).find('span[class="propertyCard-contactsAddedOrReduced"]')
                       .text()
      };

      //console.log(features);
      
      // populate properties array
      properties.push(features)
    }))

/*************************************************************

    FINALLY COPY, PASTE AND RUN THESE LINES TO CHROME DEVTOOLS

**************************************************************/

// download output file
$('head').append('<a download="rightmove.json">');
$('a[download="rightmove.json"]').attr('href', window.URL.createObjectURL(
     new Blob([JSON.stringify(properties, null, 2)], {type: 'text'})
   )
 )
$('a[download="rightmove.json"]')[0].click()
    
