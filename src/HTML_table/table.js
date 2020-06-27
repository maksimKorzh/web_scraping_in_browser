 /****************************************************\
|           HTML table to CSV file scraper             |
|                                                      |
|                         by                           |
|                                                      |
|                  Code Monkey King                    |
|______________________________________________________|
|                                                      |
|  1. Navigate to "https://free-proxy-list.net/"       |
|  2. Open developer tools by pressing Ctrl-Shift-i    |
|  3. Copy this source, paste it into console and run  |
|                                                      |
|     You should get 'proxies.csv' file downloaded     |
|                                                      |
 \****************************************************/

// CSV output content
csv = 'IP Address,Port,Code,Country,Anonymity,Google,Https,Last Checked'

// make HTTP request to "https://free-proxy-list.net/"
fetch('https://free-proxy-list.net/')
  // extract HTML text
  .then(data => data.text())
  
  // parse HTML response with JQuery
  .then(data => $($(data).find('table')[0]).find('tr').each(function(index) {
    // row string
    var row = '';

    // loop over columns
    $(this).find('td').each(function(index) {
      row += $(this).text() + ','
    });

    // slice the last coma
    row = row.slice(0, -1);

    // append new line feed to the end of each row
    row += '\n';

    // append row to CSV content
    csv += row;
  }))
  
  // download data sa CSV
  .then(function() {
      // create download link on the target page
      $('head').append('<a download="proxies.csv"></a>');
      
      // create object URL
      $('a[download="proxies.csv"]').attr('href', window.URL.createObjectURL(new Blob([csv], {type: 'text/csv'})));
      
      // mimic download link click
      $('a[download="proxies.csv"]')[0].click();
    }
  )


