import { settings } from "~/plugins/settings.js";

export const state = () => ({
  // use getters for axis radius data. values set in are just for temp data.
  xAxis: "",
  yAxis: "",
  radius: "",
  fieldNames: settings.fields.map(item => item["name"]),
  fieldOptions: settings.fields.map(item => {
    return {
      text: item["display"],
      value: item["name"],
      info: item["description"]
    };
  }),
  yearRange: { min: 0, max: settings.maxYear },
  currentScrollYear: 0
});

export const getters = {
  getXAxis: function(state) {
    if (state.xAxis !== "") {
      return state.xAxis;
    }
    let field = state.fieldNames[0];
    if (field) {
      return field;
    }
    // default to blank field if fields size is less than 1;
    return "";
  },

  getYAxis: function(state, getters) {
    if (state.yAxis !== "") {
      return state.yAxis;
    }
    let field = state.fieldNames[1];
    if (field) {
      return field;
    }
    // default YAxis to XAxis if field config is less than 2 fields
    return getters.getXAxis;
  },

  getRadius: function(state, getters) {
    if (state.radius !== "") {
      return state.radius;
    }
    let field = state.fieldNames[2];
    if (field) {
      return field;
    }
    // default radius to YAxis if field config is less than 3 fields
    return getters.getYAxis;
  }
};

export const mutations = {
  updateXAxis: function(state, value) {
    state.xAxis = value;
    return state;
  },

  updateYAxis: function(state, value) {
    state.yAxis = value;
  },

  updateRadius: function(state, value) {
    state.radius = value;
  },

  updateCurrentScrollYear: function(state, value) {
    state.currentScrollYear = value;
  }
};

export const actions = {
  setXAxis: function({ commit }, value) {
    commit("updateXAxis", value);
  },

  setYAxis: function({ commit }, value) {
    commit("updateYAxis", value);
  },

  setRadius: function({ commit }, value) {
    commit("updateRadius", value);
  },

  setCurrentScrollYear: function({ commit }, value) {
    commit("updateCurrentScrollYear", value);
  }
};
