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
  // TODO other indices
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
        [VAE]: undefined,
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

class IndexWrapper<T extends IndexOrder> {
  [immerable] = true;
  readonly map: IndexByType<T> = {} as IndexByType<T>;

  /**
   *
   */
  constructor() {}
}

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
    return this.map.get(id);
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

function indexAt<T extends IndexOrder>(
  db: Database,
  kind: T,
  ts: Database["timestamp"] | undefined
): IndexByType<T> {
  throw "fefjeifj";
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

export function addEntity(db: Database, entity: Entity): [Database, Entity] {
  const [entityToAdd, nextTopId] = fixNewEntity(db, entity);

  const newLayer = produce(db.layers.at(-1), (layerDraft) => {
    layerDraft.storage = layerDraft.storage.writeEntity(entityToAdd);
  });

  // TODO skip indexed for now

  return [
    produce(db, (dbDraft) => {
      dbDraft.layers.push(newLayer);
      dbDraft.topId = nextTopId;
      dbDraft.timestamp = nextTimestamp(dbDraft);
    }),
    entityToAdd,
  ];
}

function removeEntity(db: Database, entity: Entity) {}

function updateEntity(db: Database, entity: Entity) {}

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
  entity: Entity
): [Entity, Database["topId"]] {
  const [newTopId, newId] = nextId(db, entity);
  const newTimetamp = nextTimestamp(db);

  const e1 = produce(entity, (draft) => {
    draft.id = newId;
  });
  const e2 = setCreationTimestamp(e1, newTimetamp);

  return [e2, newTopId];
}

// indexAt({} as Database, EAV, undefined);
// indexAt({} as Database, VAE, undefined);
// indexAt({} as Database, VEA, undefined);
// indexAt({} as Database, AVE, undefined);

const f: Foo = "hello";
console.log(f);

const toto = {
  a: "ab",
  b: [1, 2, 3],
  c: true,
};

const newTotot = produce(toto, (draft) => {
  draft.b.push(4);
  draft.c = false;
});

console.log(toto);
console.log(newTotot);
