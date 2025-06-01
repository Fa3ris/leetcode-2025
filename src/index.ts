import { produce } from "immer";
type Foo = string;

type Database = {
  layers: Layer[];
  topId: number;
  timestamp: number;
};

type Layer = {
  storage: any;
  // other indices
};

const PendingId = Symbol("pendingId");

type Entity = {
  id: number | typeof PendingId;
  attributes: Record<Attribute["name"], Attribute>;
};

function entity(id: Entity["id"] = PendingId): Entity {
  return { id, attributes: {} };
}

type Storage = {
  getEntity(id: Entity["id"]): Entity;
  writeEntity(entity: Entity): void;
  dropEntity(entity: Entity): void;
};
type MemoryStorage = Storage & { map: Map<Entity["id"], Entity> };

type Index<
  L1 extends string | number | symbol,
  L2 extends string | number | symbol,
  L3
> = Record<L1, Record<L2, Set<L3>>>;

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

const EAV = "EAV";
const AVE = "AVE";
const VAE = "VAE";
const VEA = "VEA";
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
  writeEntity(entity: Entity): void {
    this.map.set(entity.id, entity);
  },
  dropEntity(entity: Entity) {
    this.map.delete(entity.id);
    throw new Error("Function not implemented.");
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
  type: string;
  cardinality: "single" | "multiple";
};

const INVALID_TIME = -1;
function attribute(
  name: string,
  value: any,
  type: string,
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

function addAttribute(entity: Entity, attribute: Attribute): Entity {
  return produce(entity, (draft) => {
    draft.attributes[attribute.name] = attribute;
  });
}

function entityAt(db: Database, ts: Database["timestamp"] | undefined): Entity {
  throw "erer";
}

function attributeAt(
  db: Database,
  entityId: Entity["id"],
  name: Attribute["name"],
  ts: Database["timestamp"] | undefined
): Attribute {
  throw "fwhfowh";
}

function valueOfAt(
  db: Database,
  entityId: Entity["id"],
  name: Attribute["name"],
  ts: Database["timestamp"] | undefined
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
