// people list
var people = [];

function fetch_profile(profile_url, person) {
  // crawl through profile URLs
  fetch(profile_url)          
    // extract HTML text from response
    .then((response) => { 
      return response.text()
    })
    
    // parse profile URL
    .then((content) => $(content).each(function(index) {      
      // select <code> tags
      if ($(this).prop('tagName') == 'CODE') {
        // extract details data
        if (index == 344) {
          // parse string to JSON
          var profile_data = JSON.parse($(this).text());
          
          // init person data
          person.country = profile_data.included[17].defaultLocalizedName;
          person.specialty = profile_data.included[18].name;
          person.education = profile_data.included[19].schoolName;
          person.company = profile_data.included[21].companyName;
          person.title = profile_data.included[21].title;
          person.skills = [];

          $.each(profile_data.included.slice(24, 42), function() {
            person.skills.push(this.name);
          });
          //console.log(profile_data.included)//[17].defaultLocalizedName);
        }

        // extract general data
        if(index == 354) {
          // parse string to JSON
          var profile_data = JSON.parse($(this).text());

          // init person data
          person.firstName = profile_data.data.firstName;
          person.lastName = profile_data.data.lastName;
          person.occupation = profile_data.data.occupation;
          
          // append person to list
          people.push(person);
          console.log(person);
        }
      }
    }))
    
    .catch((err) => {
      console.log('data leaks, trying again...');
      
      // create person object
      person = {};
      
      // retry
      fetch_profile(profile_url, person);
    });
}

// crawl through the range of pages
$.each(new Array(3), function(page) {
  // make HTTP request to each page URL
  fetch('https://www.linkedin.com/search/results/all/?keywords=python%20developer%20web%20scraping&origin=GLOBAL_SEARCH_HEADER&page=' + (page + 1).toString())
    // extract HTML text from response
    .then(response => response.text())
    
    // extract profile URLs
    .then(content => $.each(content.split('https://www.linkedin.com/in/'), function(index, value) {
      if (value.split('&quot;')[0].length < 100) {
        // generate profile URL
        var profile_url = 'https://www.linkedin.com/in/' + value.split('&quot;')[0] + '/'
        
        // create person object
        var person = {};

        // fetch profile
        fetch_profile(profile_url, person);
      }
    }))
});

