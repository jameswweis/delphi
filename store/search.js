import axios from "~/plugins/axios.js";
import { settings } from "~/plugins/settings.js";

export const state = () => ({
  keyword: "",
  authors: [],
  venues: [],
  affiliations: [],
  size_per_request: 10,
  validSizes: [10, 50, 100],
  validSort: settings.fields.map(item => item.name),
  validGroup: ["paper", "author", "venue", "affiliation"],
  sort: settings.fields[0].name,
  group: "paper"
});

export const getters = {
  authorIDs: function(state) {
    return state.authors.map(item => item.id);
  },

  venueIDs: function(state) {
    return state.venues.map(item => item.id);
  },

  affiliationIDs: function(state) {
    return state.affiliations.map(item => item.id);
  },

  getSortKey: function(state) {
    return `${state.sort}_5`;
  },

  activeGroup: function(state) {
    return state.group;
  },

  searchedKeywords: function(state) {
    return state.keyword
      .toLowerCase()
      .split(" ")
      .join(",");
  },

  authorIDsString: function(state, getters) {
    return getters.authorIDs.join(",");
  },

  affiliationIDsString: function(state, getters) {
    return getters.affiliationIDs.join(",");
  },

  venueIDsString: function(state, getters) {
    return getters.venueIDs.join(",");
  },

  isPaperGroup: function(state) {
    return state.group === "paper";
  },

  isAuthorGroup: function(state) {
    return state.group === "author";
  },

  isVenueGroup: function(state) {
    return state.group === "venue";
  },

  isAffiliationGroup: function(state) {
    return state.group === "affiliation";
  },

  filterQuery: function(state, getters) {
    const filters = {
      sort_value: "DESC",
      size_per_request: state.size_per_request,
      sort_key: `-${getters.getSortKey}`
    };
    if (getters.isPaperGroup) {
      if (getters.authorIDsString.length !== 0) {
        filters["authors__in"] = getters.authorIDsString;
      }

      if (getters.venueIDsString.length !== 0) {
        filters["venue__in"] = getters.venueIDsString;
      }

      if (getters.affiliationIDsString.length !== 0) {
        filters["authors__affiliate__in"] = getters.affiliationIDsString;
      }
    } else if (getters.isAuthorGroup) {
      if (getters.authorIDsString.length !== 0) {
        filters["id__in"] = getters.authorIDsString;
      }
      if (getters.venueIDsString.length !== 0) {
        // TODO: how to handle author filters with venue filter
        // filters["venue__in"] = getters.venueIDsString;
      }
      if (getters.affiliationIDsString.length !== 0) {
        filters["affiliate__in"] = getters.affiliationIDsString;
      }
    } else if (getters.isVenueGroup) {
      if (getters.authorIDsString.length !== 0) {
        // TODO: venue + author result
        // filters["id__in"] = getters.authorIDsString;
      }
      if (getters.venueIDsString.length !== 0) {
        filters["id__in"] = getters.venueIDsString;
      }
      if (getters.affiliationIDsString.length !== 0) {
        // TODO
        // filters["affiliate__in"] = getters.affiliationIDsString;
      }
    } else if (getters.isAffiliationGroup) {
      if (getters.authorIDsString.length !== 0) {
        filters["author__in"] = getters.authorIDsString;
      }
      if (getters.venueIDsString.length !== 0) {
        // TODO: handle when venue filter is applied
      }
      if (getters.affiliationIDsString.length !== 0) {
        filters["id__in"] = getters.affiliationIDsString;
      }
    }
    if (getters.searchedKeywords.length != 0) {
      if (
        getters.isVenueGroup ||
        getters.isAuthorGroup ||
        getters.isAffiliationGroup
      ) {
        filters["paper__keywords"] = getters.searchedKeywords;
      } else {
        filters["keywords"] = getters.searchedKeywords;
      }
    }
    return filters;
  }
};

export const mutations = {
  addAuthor: function(state, author) {
    if (
      author === undefined ||
      state.authors.map(item => item.id).includes(author.id)
    ) {
      return;
    }
    state.authors.push(author);
  },

  resetAuthor: function(state) {
    state.authors.splice(0, state.authors.length);
  },

  removeAuthor: function(state, author_id) {
    const index = state.authors.findIndex(record => record.id === author_id);
    if (index < 0) {
      return;
    }
    state.authors.splice(index, 1);
  },

  addVenue: function(state, venue) {
    if (
      venue === undefined ||
      state.venues.map(item => item.id).includes(venue.id)
    ) {
      return;
    }
    state.venues.push(venue);
  },

  resetVenue: function(state) {
    state.venues.splice(0, state.venues.length);
  },

  removeVenue: function(state, venue_id) {
    const index = state.venues.findIndex(record => record.id === venue_id);
    if (index < 0) {
      return;
    }
    state.venues.splice(index, 1);
  },

  addAffiliation: function(state, affiliate) {
    if (
      affiliate === undefined ||
      state.affiliations.map(item => item.id).includes(affiliate.id)
    ) {
      return;
    }
    state.affiliations.push(affiliate);
  },

  removeAffiliation: function(state, affiliate_id) {
    const index = state.affiliations.findIndex(
      record => record.id === affiliate_id
    );
    if (index < 0) {
      return;
    }
    state.affiliations.splice(index, 1);
  },

  resetAffiliation: function(state) {
    state.affiliations.splice(0, state.affiliations.length);
  },

  updateKeyword: function(state, value) {
    state.keyword = value;
  },

  updateSort: function(state, value) {
    state.sort = value;
  },

  updateSize: function(state, value) {
    state.size_per_request = parseInt(value);
  },

  updateGroup: function(state, value) {
    state.group = value;
  },

  clearSearch: function(state) {
    state.keyword = "";
    state.authors = [];
    state.venues = [];
    state.affiliations = [];
  }
};

export const actions = {
  fetchAuthorsById: function(context, filters) {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => params.append(key, filters[key]));
    return axios.get(`/api/authors/?${params.toString()}`);
  },

  fetchVenuesById: function(context, filters) {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => params.append(key, filters[key]));
    return axios.get(`/api/venues/?${params.toString()}`);
  },

  fetchAffiliationsById: function(context, filters) {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => params.append(key, filters[key]));
    return axios.get(`/api/affiliate/?${params.toString()}`);
  }
};
