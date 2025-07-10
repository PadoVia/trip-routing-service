const path = require("path");
const osrmBinary = path.join(
  __dirname,
  "..",
  "..",
  "node_modules",
  "@project-osrm",
  "osrm",
  "lib",
  "binding_napi_v8",
  "node_osrm.node"
);
const { OSRM } = require(osrmBinary);
const osrm = new OSRM({
  shared_memory: true,
  dataset_name: "bus_traffic",
  algorithm: "MLD",
});

async function matchCoordinates(coords, timestamps) {

    try {
        const result = await matchAsync(osrm, {
        coordinates: coords,
        timestamps: timestamps,
        overview: "full",
        annotations: ["nodes"]
        });

        if (!result || !result.matchings || result.matchings.length === 0 || result.matchings[0].confidence === 0 || result.matchings[0].confidence > 1) {
            return {}; // Nessun risultato trovato
        }

        return result;

    } catch (error) {
        //console.error("Error matching coordinates:", error);
        //throw error;
    }

}

function matchAsync(osrm, options) {
  return new Promise((resolve, reject) => {
    osrm.match(options, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

module.exports = matchCoordinates;
