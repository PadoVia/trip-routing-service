
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

  process() {
    throw new Error('Method "process" must be implemented in subclasses');
  }
}

module.exports = { Vehicle };
