import { enableMapSet, immerable, produce } from "immer";

enableMapSet();

type Foo = string;

export type Database = {
  layers: Layer[];
  topId: number;
  timestamp: number;
};

type Layer = {
  storage: Storage;
  [VAE]: IndexWrapper<typeof VAE>;
  [AVE]: IndexWrapper<typeof AVE>;
  [VEA]: IndexWrapper<typeof VEA>;
  [EAV]: IndexWrapper<typeof EAV>;
};

const dbForName: Record<string, Database> = {};

function isRef(attribute: Attribute): boolean {
  return attribute.type === "ref";
}

function always(): boolean {
  return true;
}

type IndexUsage = (attribute: Attribute) => boolean;

const INIT_TIMESTAMP = 0;
const INIT_TOP_ID = 0;

export function getDBConnection(name: string): Database {
  const db = dbForName[name];
  if (db) return db;

  const newDb: Database = {
    layers: [
      {
        storage: memoryStorage,
        [VAE]: { index: {} },
        [AVE]: { index: {} },
        [VEA]: { index: {} },
        [EAV]: { index: {} as EAVT },
      },
    ],
    topId: INIT_TOP_ID,
    timestamp: INIT_TIMESTAMP,
  };

  dbForName[name] = newDb;
  return newDb;
}

const PendingId = Symbol("pendingId");

type Entity = {
  id: number | typeof PendingId;
  attributes: Record<Attribute["name"], Attribute>;
};

export function entity(id: Entity["id"] = PendingId): Entity {
  return { id, attributes: {} };
}

type Storage = {
  getEntity(id: Entity["id"]): Entity;
  writeEntity(entity: Entity): Storage;
  dropEntity(entity: Entity): Storage;
};
type MemoryStorage = Storage & { map: Map<Entity["id"], Entity> };

type Index<
  L1 extends string | number | symbol,
  L2 extends string | number | symbol,
  L3
> = Record<L1, Record<L2, Set<L3>>>;

type IndexWrapper<T extends IndexOrder> = {
  index: IndexByType<T>;
};

// set which create a
class ObjectSet<T> implements Set<T> {
  private map = new Map<string, T>();

  constructor(private keyExtractor: (item: T) => string) {}
  clear(): void {
    throw new Error("Method not implemented.");
  }
  forEach(
    callbackfn: (value: T, value2: T, set: Set<T>) => void,
    thisArg?: any
  ): void {
    throw new Error("Method not implemented.");
  }
  entries(): SetIterator<[T, T]> {
    throw new Error("Method not implemented.");
  }
  keys(): SetIterator<T> {
    throw new Error("Method not implemented.");
  }

  [Symbol.toStringTag]: string;

  add(item: T): this {
    const key = this.keyExtractor(item);
    this.map.set(key, item);
    return this;
  }

  has(item: T): boolean {
    const key = this.keyExtractor(item);
    return this.map.has(key);
  }

  delete(item: T): boolean {
    const key = this.keyExtractor(item);
    return this.map.delete(key);
  }

  get size(): number {
    return this.map.size;
  }

  *[Symbol.iterator]() {
    yield* this.map.values();
  }

  values(): IterableIterator<T> {
    return this.map.values();
  }
}

// T is for Time
type EAVT = Index<Entity["id"], Attribute["name"], Attribute["value"]>;
type AVET = Index<Attribute["name"], Attribute["value"], Entity["id"]>;
type VAET = Index<Attribute["value"], Attribute["name"], Entity["id"]>;
type VEAT = Index<Attribute["value"], Entity["id"], Attribute["name"]>;

const EAV = "EAV" as const;
const AVE = "AVE" as const;
const VAE = "VAE" as const;
const VEA = "VEA" as const;
type IndexOrder = typeof EAV | typeof AVE | typeof VAE | typeof VEA;

type IndexByType<T extends IndexOrder> = T extends typeof EAV
  ? EAVT
  : T extends typeof AVE
  ? AVET
  : T extends typeof VAE
  ? VAET
  : T extends typeof VEA
  ? VEAT
  : never;

const memoryStorage: MemoryStorage = {
  map: new Map<Entity["id"], Entity>(),

  getEntity(id: Entity["id"]): Entity {
    const entity = this.map.get(id);
    if (entity === undefined) throw new Error("");
    return entity;
  },

  writeEntity(entity: Entity): MemoryStorage {
    return produce(this, (draft) => {
      draft.map.set(entity.id, entity);
    });
  },
  dropEntity(entity: Entity): MemoryStorage {
    return produce(this, (draft) => {
      draft.map.delete(entity.id);
    });
  },
};

type Datom = {
  entityId: Entity["id"];
  attributeName: Attribute["name"];
  attributeValue: Attribute["value"];
};

type Attribute = {
  name: string;
  value: any;
  timestamp: number;
  previousTimestamp: number;
  type: AttributeValue;
  cardinality: "single" | "multiple";
};

const INVALID_TIME = -1;

type AttributeValue = "string" | "number" | "ref";

export function attribute(
  name: string,
  value: any,
  type: AttributeValue,
  cardinality: Attribute["cardinality"] = "single"
): Attribute {
  return {
    name,
    value,
    type,
    cardinality,
    timestamp: INVALID_TIME,
    previousTimestamp: INVALID_TIME,
  };
}

export function addAttribute(entity: Entity, attribute: Attribute): Entity {
  return produce(entity, (draft) => {
    draft.attributes[attribute.name] = attribute;
  });
}

export function entityAt(
  db: Database,
  entityId: Entity["id"],
  ts: Database["timestamp"] = db.timestamp
): Entity {
  return db.layers[ts].storage.getEntity(entityId);
}

export function attributeAt(
  db: Database,
  entityId: Entity["id"],
  name: Attribute["name"],
  ts: Database["timestamp"] = db.timestamp
): Attribute {
  return entityAt(db, entityId, ts).attributes[name];
}

export function valueOfAt(
  db: Database,
  entityId: Entity["id"],
  name: Attribute["name"],
  ts: Database["timestamp"] = db.timestamp
) {
  return attributeAt(db, entityId, name, ts).value;
}

export function indexAt<T extends IndexOrder>(
  db: Database,
  indexName: T,
  ts: Database["timestamp"] = db.timestamp
): IndexWrapper<T> {
  return db.layers[ts][indexName] as IndexWrapper<T>;
}

function evolutionOf(
  db: Database,
  entityId: Entity["id"],
  attributeName: Attribute["name"]
): [number, Attribute["value"]][] {
  const result: [number, Attribute["value"]][] = [];

  let ts = db.timestamp;

  while (ts != INVALID_TIME) {
    const attr = attributeAt(db, entityId, attributeName, ts);

    result.push([ts, attr.value]);
    ts = attr.previousTimestamp;
  }

  return result;
}

function datomToIndexPathAVE(datom: Datom): [string, string, number] {
  if (typeof datom.entityId === "symbol") throw `entityId is not set`;
  return [datom.attributeName, String(datom.attributeValue), datom.entityId];
}

function datomToIndexPathEAV(datom: Datom): [number, string, string] {
  if (typeof datom.entityId === "symbol") throw `entityId is not set`;
  return [datom.entityId, datom.attributeName, String(datom.attributeValue)];
}

function datomToIndexPathVAE(datom: Datom): [string, string, number] {
  if (typeof datom.entityId === "symbol") throw `entityId is not set`;
  return [String(datom.attributeValue), datom.attributeName, datom.entityId];
}

function datomToIndexPathVEA(datom: Datom): [string, number, string] {
  if (typeof datom.entityId === "symbol") throw `entityId is not set`;
  return [datom.attributeValue, datom.entityId, datom.attributeName];
}

export function addEntity(db: Database, entity: Entity): [Database, Entity] {
  const [entityToAdd, nextTopId] = fixNewEntity(db, entity);

  const newLayer = produce(db.layers.at(-1), (layerDraft) => {
    addEntityToIndices(layerDraft, entityToAdd);
  });

  return [
    produce(db, (dbDraft) => {
      dbDraft.layers.push(newLayer);
      dbDraft.topId = nextTopId;
      dbDraft.timestamp = nextTimestamp(dbDraft);
    }),
    entityToAdd,
  ];
}

export function addEntities(
  db: Database,
  ...entities: Entity[]
): [Database, ...Entity[]] {
  const nextDbTimestamp = nextTimestamp(db);

  let intermediateDb = db;

  const newEntities = Array.from<Entity>({ length: entities.length });
  for (const [index, entity] of Object.entries(entities)) {
    const [newEntity, newTopId] = fixNewEntity(
      intermediateDb,
      entity,
      nextDbTimestamp
    );
    newEntities[index] = newEntity;
    intermediateDb = produce(intermediateDb, (draft) => {
      draft.topId = newTopId;
    });
  }

  let newLayer = db.layers.at(-1);
  for (const entityToAdd of newEntities) {
    newLayer = produce(newLayer, (layerDraft) => {
      addEntityToIndices(layerDraft, entityToAdd);
    });
  }
  const nextDb = produce(intermediateDb, (draft) => {
    draft.timestamp = nextDbTimestamp;
    draft.layers.push(newLayer);
  });
  return [nextDb, ...newEntities];
}

function addEntityToIndices(layerDraft: Layer, entityToAdd: Entity) {
  layerDraft.storage = layerDraft.storage.writeEntity(entityToAdd);

  for (const attribute of Object.values(entityToAdd.attributes)) {
    const datom: Datom = {
      entityId: entityToAdd.id,
      attributeName: attribute.name,
      attributeValue: attribute.value,
    };

    const path = datomToIndexPathAVE(datom);

    const indexToUpdate = layerDraft[AVE].index;

    if (!indexToUpdate[path[0]]) {
      indexToUpdate[path[0]] = {};
    }
    const record = indexToUpdate[path[0]];

    if (!record[path[1]]) {
      record[path[1]] = new Set();
    }
    record[path[1]].add(Number(path[2]));
  }

  for (const attribute of Object.values(entityToAdd.attributes)) {
    const datom: Datom = {
      entityId: entityToAdd.id,
      attributeName: attribute.name,
      attributeValue: attribute.value,
    };

    const path = datomToIndexPathEAV(datom);

    const indexToUpdate = layerDraft[EAV].index;

    if (!indexToUpdate[path[0]]) {
      indexToUpdate[path[0]] = {};
    }
    const record = indexToUpdate[path[0]];

    if (!record[path[1]]) {
      record[path[1]] = new Set();
    }
    record[path[1]].add(path[2]);
  }

  for (const attribute of Object.values(entityToAdd.attributes)) {
    const datom: Datom = {
      entityId: entityToAdd.id,
      attributeName: attribute.name,
      attributeValue: attribute.value,
    };

    const path = datomToIndexPathVAE(datom);

    const indexToUpdate = layerDraft[VAE].index;

    if (!indexToUpdate[path[0]]) {
      indexToUpdate[path[0]] = {};
    }
    const record = indexToUpdate[path[0]];

    if (!record[path[1]]) {
      record[path[1]] = new Set();
    }
    record[path[1]].add(Number(path[2]));
  }
  for (const attribute of Object.values(entityToAdd.attributes)) {
    const datom: Datom = {
      entityId: entityToAdd.id,
      attributeName: attribute.name,
      attributeValue: attribute.value,
    };

    const path = datomToIndexPathVEA(datom);

    const indexToUpdate = layerDraft[VEA].index;

    if (!indexToUpdate[path[0]]) {
      indexToUpdate[path[0]] = {} as any;
    }
    const record = indexToUpdate[path[0]];

    if (!record[path[1]]) {
      record[path[1]] = new Set();
    }
    record[path[1]].add(path[2]);
  }
}

export function removeEntity(db: Database, entityId: Entity["id"]): Database {
  const entityToRemove = entityAt(db, entityId);
  const newLayer = produce(db.layers.at(-1), (draftLayer) => {
    draftLayer.storage = draftLayer.storage.dropEntity(entityToRemove);
  });

  // TODO update indexes later - only VAET apparently
  return produce(db, (draft) => {
    draft.layers.push(newLayer);
    draft.timestamp = nextTimestamp(draft);
  });
}

export function updateEntity(
  db: Database,
  entityId: Entity["id"],
  attribute: Attribute
): Database {
  const nextDbTimestamp = nextTimestamp(db);

  const newLayer = produce(db.layers.at(-1), (layerDraft) => {
    const entity = entityAt(db, entityId);

    const attributeToUpdate = entity.attributes[attribute.name];

    const newAttribute = produce(attributeToUpdate, (attributeDraft) => {
      attributeDraft.value = attribute.value;
      attribute.previousTimestamp = attribute.timestamp;
      attribute.timestamp = nextDbTimestamp;
    });

    const updatedEntity = produce(entity, (draft) => {
      draft.attributes[newAttribute.name] = newAttribute;
    });

    layerDraft.storage = layerDraft.storage.writeEntity(updatedEntity);

    const datom: Datom = {
      entityId,
      attributeName: attributeToUpdate.name,
      attributeValue: attributeToUpdate.value,
    };

    // AVE
    {
      const path = datomToIndexPathAVE(datom);
      const indexToUpdate = layerDraft[AVE].index;
      const record = indexToUpdate[path[0]];
      delete record[path[1]];
      record[newAttribute.value] = new Set([datom.entityId]);
    }

    // EAV
    {
      const path = datomToIndexPathEAV(datom);
      const indexToUpdate = layerDraft[EAV].index;
      indexToUpdate[path[0]][path[1]].clear();
      indexToUpdate[path[0]][path[1]].add(newAttribute.value);
    }

    // VEA
    {
      const path = datomToIndexPathVEA(datom);
      const indexToUpdate = layerDraft[VEA].index;
      delete indexToUpdate[path[0]];
      if (!indexToUpdate[newAttribute.value]) {
        indexToUpdate[newAttribute.value] = {} as any;
      }
      const record = indexToUpdate[newAttribute.value];
      if (!record[path[1]]) {
        record[path[1]] = new Set();
      }
      record[path[1]].add(path[2]);
    }

    // VAE
    {
      const path = datomToIndexPathVAE(datom);
      const indexToUpdate = layerDraft[VAE].index;
      delete indexToUpdate[path[0]];
      if (!indexToUpdate[newAttribute.value]) {
        indexToUpdate[newAttribute.value] = {} as any;
      }
      const record = indexToUpdate[newAttribute.value];
      if (!record[path[1]]) {
        record[path[1]] = new Set();
      }
      record[path[1]].add(path[2]);
    }
  });

  return produce(db, (draft) => {
    draft.timestamp = nextDbTimestamp;
    draft.layers.push(newLayer);
  });
}

function nextTimestamp(db: Database): Database["timestamp"] {
  return db.timestamp + 1;
}

function setCreationTimestamp(
  entity: Entity,
  timestamp: Database["timestamp"]
): Entity {
  return produce(entity, (draft) => {
    for (const attributeName of Object.keys(draft.attributes)) {
      draft.attributes[attributeName].timestamp = timestamp;
    }
  });
}

function nextId(
  db: Database,
  entity: Entity
): [Database["topId"], Entity["id"]] {
  const { topId } = db;
  const { id } = entity;

  if (id !== PendingId) {
    return [topId, id];
  }

  const newId = topId + 1;

  return [newId, newId];
}

function fixNewEntity(
  db: Database,
  entity: Entity,
  nextTs?: number
): [Entity, Database["topId"]] {
  const [newTopId, newId] = nextId(db, entity);
  const newTimetamp = nextTs ?? nextTimestamp(db);

  const e1 = produce(entity, (draft) => {
    draft.id = newId;
  });
  const e2 = setCreationTimestamp(e1, newTimetamp);

  return [e2, newTopId];
}
