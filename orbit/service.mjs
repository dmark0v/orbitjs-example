import SchemaDescription from './schema.mjs';
import IndexedDB from '@orbit/indexeddb';

export class OrbitService {
  static _memory = null;
  static _schema = null;

  static async initialize ({ MemorySource , Schema, JSONAPISource, IndexedDBSource, Coordinator, RequestStrategy, SyncStrategy }) {
    this._schema = new Schema(SchemaDescription);
    this._memory = new MemorySource({ schema: this.schema, name: 'memory' });

    if (JSONAPISource) {
      this.initializeRemoteSource({ JSONAPISource, Coordinator, RequestStrategy, SyncStrategy }, this.schema);
    }

    if (IndexedDB.supportsIndexedDB() && IndexedDBSource) {
      this.initializeBackupSource({ IndexedDBSource, Coordinator, SyncStrategy }, this.schema);
    }

    if (this.coordinator) {
      await this.coordinator.activate();
    }
  }

  static initializeRemoteSource ({ JSONAPISource, Coordinator, RequestStrategy, SyncStrategy }, schema) {
    const remote = new JSONAPISource({
      schema,
      name: "remote",
      host: "http://localhost:3000/api"
    });

    this._remote = remote;

    if (!this.coordinator) {
      this._coordinator = new Coordinator({
        sources: [this.memory, remote]
      });
    } else {
      this.coordinator.addSource(remote);
    }

    this.coordinator.addStrategy(
      new SyncStrategy({
        source: "remote",
        target: "memory",
        blocking: true
      })
    );

    this.coordinator.addStrategy(
      new RequestStrategy({
        source: "memory",
        on: "beforeUpdate",

        target: "remote",
        action: "update",

        blocking: true
      })
    );

    this.coordinator.addStrategy(
      new RequestStrategy({
        source: "memory",
        on: "beforeQuery",

        target: "remote",
        action: "query",

        blocking: true
      })
    );
  }

  static initializeBackupSource ({ IndexedDBSource, Coordinator, SyncStrategy }, schema) {
    const backup = new IndexedDBSource({
      schema,
      name: "backup",
      namespace: "posts"
    });

    if (!this.coordinator) {
      this._coordinator = new Coordinator({
        sources: [this.memory, backup]
      });
    } else {
      this.coordinator.addSource(backup);
    }

    this.coordinator.addStrategy(new SyncStrategy({
      source: "memory",
      target: "backup",
      blocking: true
    }));
  }

  static get memory () {
    return this._memory;
  }

  static get schema () {
    return this._schema;
  }

  static get coordinator () {
    return this._coordinator;
  }

  static get remote () {
    return this._remote;
  }
}