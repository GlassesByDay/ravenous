const clientId = 'YzbFTLz_y5z-WDWVgLCLyQ';
const secret = 'cETL5nkMDIR5toHWyhsU9knA7Y9mJAeSMcUQ7TSGhBBla6FF1lcLVfflkF9iCoZX';
//accessToken will be obtained later and used to authenticate our requests
let accessToken;

//Yelp object will store functionality needed to interact with Yelp API
export let Yelp = {
  getAccessToken() {
    if (accessToken) {
      return new Promise(resolve => resolve(accessToken));
    }
    return fetch(`https://cors-anywhere.herokuapp.com/https://api.yelp.com/oauth2/token?grant_type=client_credentials&client_id=${clientId}&client_secret=${secret}`,
      {method: 'POST'}).then(response => {
      return response.json();
    }).then(jsonResponse => {
      accessToken = jsonResponse.access_token;
    });
  },
  search(term, location, sortBy) {
    //console.log("Yelp search API called...");
    return Yelp.getAccessToken().then(() => {
      return fetch(`https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=${term}&location=${location}&sort_by=${sortBy}`,{
        headers: {Authorization: `Bearer ${accessToken}`}
      });
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {
      if (jsonResponse.businesses) {
        return jsonResponse.businesses.map(business => {
          return {
            id: business.id,
            imageSrc: business.image_url,
            name: business.name,
            address: business.location.address1,
            city: business.location.city,
            state: business.location.state,
            zipCode: business.location.zip_code,
            category: business.categories[0].title,
            url: business.url,
            rating: business.rating,
            reviewCount: business.review_count
          }
        });
      }
    });
  }
}
