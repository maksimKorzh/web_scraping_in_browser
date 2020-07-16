/********************************************\
        Visual HTML element selector

                    by

             Code Monkey King

\********************************************/

/********************************************\
         Just paste this source into
           Chrome Devtools Console
             in order to run it!
             
\********************************************/

// import Jquery
var jq = document.createElement('script');
jq.src = 'https://code.jquery.com/jquery-3.5.1.min.js';
document.getElementsByTagName('head')[0].append(jq);

// wait until JQuery is loaded
setTimeout(function() {
  // render selectors table
  $('html').prepend(`
    <hr>
    <table id="selectors" style="margin-left: 50px; font-size: medium">
      <thead>
        <tr>
          <th style="padding: 10px">Selectors</th>
          <th style="padding: 10px">Content</th>
        </tr>
      </thead>
      <tbody>
        <tr></tr>
      </tbody>
    </table>
    <hr>
  `);

  // disable links
  $('body').click(function(e) {
    e.preventDefault();
  });
  
  // main logic
  $('body *').each(function() {
    // background color
    var bgcolor = '';
    
    // highlight colors
    var colors = ['#d6d6c2', '#e0e0d1', '#ebebe0', '#f5f5f0'];
  
    // on mouseover event
    $(this).mouseover(function() {
      // store current background color
      bgcolor = $(this).css('background-color');

      // highlight element
      try {
        $(this).css('background-color', colors[$(this).children().length]);
      } catch(e) {
        console.log('no color available');
      }

    }).mousedown(function() {
      // HTML element selector
      var selectors = `tag: ${$(this).prop('tagName').toLowerCase()}<br>`;
      
      // pick up attributes
      $.each(this.attributes, function() {
        if (this.specified)
          if (this.name != 'style')
            selectors += `${this.name}: ${this.value}<br>`
      });
      
      // HTML element text
      var text = $(this).text();
      
      // render selectors within the table
      $('#selectors tbody').append(`
        <tr>
          <td style="padding: 10px">${selectors}</td>
          <td style="padding: 10px">${text}</td>
        </tr>
      `);
      
      return false;
      
    }).mouseout(function() {
      // restore background color
      $(this).css('background-color', bgcolor);
    });
  });
  
  
  
}, 1000);





















