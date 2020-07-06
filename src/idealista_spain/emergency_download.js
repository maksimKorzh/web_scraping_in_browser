/***********************************************\
    Paste this source code into console that
       was running the code and hit enter
    it should download the current state of
   'properties' variable containing the data
             being scraped so far
              
\***********************************************/


// filename
var filename = new Date();

filename = 'Emergency_Download_' + 
         filename.getFullYear() + '-' + 
         filename.getMonth().toString().padStart(2, '0') + '-' + 
         filename.getDate().toString().padStart(2, '0') + '-' + 
         filename.getHours().toString().padStart(2, '0') + '-' + 
         filename.getMinutes().toString().padStart(2, '0') +
         '.json';

// download data from page
$(document).find('head')
                   .append('<a download="' + filename + '"></a>');

$(document).find('head')
                   .find('a[download="' + filename + '"]')
                   .attr('href', window.URL.createObjectURL(
                     new Blob([JSON.stringify(properties, null, 2)], {type: 'text'}) 
                   ));

$(document).find('head')
                   .find('a[download="' + filename + '"]')[0]
                   .click();
