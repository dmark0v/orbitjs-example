import { Schema } from "@orbit/data";
import MemorySource from "@orbit/memory";
import IndexedDBSource from "@orbit/indexeddb";
import Coordinator, { SyncStrategy } from "@orbit/coordinator";

const schema = new Schema({
  models: {
    planet: {
      attributes: {
        name: { type: "string" },
        classification: { type: "string" }
      },
      relationships: {
        moons: { type: "hasMany", model: "moon", inverse: "planet" }
      }
    },
    moon: {
      attributes: {
        name: { type: "string" }
      },
      relationships: {
        planet: { type: "hasOne", model: "planet", inverse: "moons" }
      }
    }
  }
});

export const memory = new MemorySource({ schema, name: 'biba' });

const backup = new IndexedDBSource({
  schema,
  name: "backup",
  namespace: "solarsystem"
});

const coordinator = new Coordinator({
  sources: [memory, backup]
});

const backupMemorySync = new SyncStrategy({
  source: "biba",
  target: "backup",
  blocking: true
});

coordinator.addStrategy(backupMemorySync);




export async function seedMemory () {
  const earth = {
    type: "planet",
    id: "earth",
    attributes: {
      name: "Earth",
      classification: "terrestrial",
      atmosphere: true
    }
  };

  const venus = {
    type: "planet",
    id: "venus",
    attributes: {
      name: "Venus",
      classification: "terrestrial",
      atmosphere: true
    }
  };

  const theMoon = {
    type: "moon",
    id: "theMoon",
    attributes: {
      name: "The Moon"
    },
    relationships: {
      planet: { data: { type: "planet", id: "earth" } }
    }
  };

  await coordinator.activate();

  await memory.update(t => [
    t.addRecord(venus),
    t.addRecord(earth),
    t.addRecord(theMoon)
  ]);
}