const { Vehicle } = require("./vehicle");

class VehicleRegistry {
  constructor() {
    this.vehicles = new Map(); // Map<string, Vehicle>
  }

  /**
   * Ritorna il Vehicle esistente o ne crea uno nuovo
   */
  getOrCreate(vehicleId, payload) {
    if (this.vehicles.has(vehicleId)) {
      const v = this.vehicles.get(vehicleId);
      v.updateFromPayload(payload);
      return v;
    }

    const newVehicle = new Vehicle(payload);
    this.vehicles.set(vehicleId, newVehicle);
    return newVehicle;
  }

  /**
   * Ottieni un Vehicle se già presente
   */
  get(vehicleId) {
    return this.vehicles.get(vehicleId);
  }

  /**
   * Rimuovi un Vehicle (es. per timeout o errore)
   */
  remove(vehicleId) {
    this.vehicles.delete(vehicleId);
  }

  /**
   * (Facoltativo) lista dei veicoli attivi
   */
  list() {
    return Array.from(this.vehicles.values());
  }
}

module.exports = { VehicleRegistry };
