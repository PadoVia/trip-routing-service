const nodeAnalyzer = require("../gps/node-analyzer");
const matchCoordinates = require("../osrm/matcher");
const getStopByNodes = require("../stops/stop-db");

class Vehicle {
  constructor({ plate, position, timestamp, speed, door, bearing }) {
    this.vehicleId = plate;
    this.coords = [position.lon, position.lat];
    this.prevCoords = null;
    this.timestamp = new Date(timestamp);
    this.prevTimestamp = null;
    this.speed = speed;
    this.door = door;
    this.bearing = bearing;
    this.routeMatched = null;
    this.tripCandidates = [];
    this.assignedTrip = null;
    this.positionMatch = {};
    this.positionMatchNodes = [];
    this.traversedStops = [];
  }

  updateFromPayload({ position, timestamp, speed, door, bearing }) {
    if (!position || typeof position.lat !== 'number' || typeof position.lon !== 'number') {
      throw new Error('Invalid position data');
    }

    if (!timestamp || isNaN(new Date(timestamp))) {
      throw new Error('Invalid timestamp');
    }

    this.prevCoords = this.coords;
    this.prevTimestamp = this.timestamp;

    this.coords = [position.lon, position.lat];
    this.timestamp = new Date(timestamp);

    if (typeof speed === 'number') {
      this.speed = speed;
    }

    if (door !== undefined) {
      this.door = door;
    }

    if (typeof bearing === 'number') {
      this.bearing = bearing;
    }
  }

  getPlate() { return this.vehicleId; }
  getPos() { return this.coords; }
  getPrevPos() { return this.prevCoords; }
  getTimestamp() { return this.timestamp; }
  getPrevTimestamp() { return this.prevTimestamp; }
  getSpeed() { return this.speed; }
  getDoorStatus() { return this.door; }
  getBearing() { return this.bearing; }

  async process() {
    if (!this.prevCoords || !this.prevTimestamp) {
      //throw('Insufficient data to process: previous coordinates or timestamp missing');
      return;
    }

    const coords = [this.prevCoords, this.coords];
    const times = [this.prevTimestamp.getTime() / 1000, this.timestamp.getTime() / 1000];

    const result = await matchCoordinates(coords, times);
    this.positionMatch = result;

    this.positionMatchNodes = nodeAnalyzer(this.positionMatch);
    this.traversedStops = await getStopByNodes(this.positionMatchNodes);


  }
}

module.exports = { Vehicle };
