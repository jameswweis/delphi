import axios from "~/plugins/axios.js";

export const state = () => ({
  papers: []
});

export const actions = {
  fetchPapers: function(context, filters) {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => params.append(key, filters[key]));
    return axios.get(`/api/papers/?${params.toString()}`).then(response => {
      response.forEach(item => {
        item["uuid"] = Math.random()
          .toString(36)
          .substr(2, 9);
      });
      return response;
    });
  },

  fetchAuthors: function(context, filters) {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => params.append(key, filters[key]));
    return axios.get(`/api/authors/?${params.toString()}`).then(response => {
      // parse result to mimic the paper item result
      return response.map(item => {
        return {
          uuid: Math.random()
            .toString(36)
            .substr(2, 9),
          title: item["name"],
          ...item
        };
      });
    });
  },

  fetchVenues: function(context, filters) {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => params.append(key, filters[key]));
    return axios.get(`/api/venues/?${params.toString()}`).then(response => {
      // parse result to mimic the paper item result
      return response.map(item => {
        return {
          uuid: Math.random()
            .toString(36)
            .substr(2, 9),
          title: item["name"],
          ...item
        };
      });
    });
  },

  fetchAffiliates: function(context, filters) {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => params.append(key, filters[key]));
    return axios.get(`/api/affiliate/?${params.toString()}`).then(response => {
      // parse result to mimic the paper item result
      return response.map(item => {
        return {
          uuid: Math.random()
            .toString(36)
            .substr(2, 9),
          title: item["name"],
          ...item
        };
      });
    });
  }
};
