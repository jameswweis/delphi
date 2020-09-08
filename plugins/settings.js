// plugin for reading config json file
const settings = require("~/config.json");

settings["STATS_FIELD_KEYS"] = settings["fields"].map(item =>
  item["name"].toLowerCase()
);
settings["STATS_FIELDS"] = settings["STATS_FIELD_KEYS"].reduce((acc, curr) => {
  const nums = Array.from(Array(settings["maxYear"] + 1).keys());
  nums.forEach(x => {
    acc.push(`${curr}_${x}`);
  });
  return acc;
}, []);
export { settings };
