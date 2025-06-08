import { describe, expect, test } from "vitest";
import {
  addAttribute,
  addEntities,
  addEntity,
  attribute,
  attributeAt,
  entity,
  entityAt,
  getDBConnection,
  indexAt,
  valueOfAt,
} from ".";

describe("Functional Database", () => {
  describe("get DB", () => {
    test("same db for same name", () => {
      const name = "foo";
      const db = getDBConnection(name);
      const db2 = getDBConnection(name);
      expect(db === db2).toBe(true);
    });

    test("different db for different names", () => {
      const db = getDBConnection("foo");
      const db2 = getDBConnection("bar");
      expect(db !== db2).toBe(true);
    });
  });

  describe("entity operations", () => {
    test("add attribute creates new instance", () => {
      const e1 = entity();
      const e2 = addAttribute(e1, attribute("foo", "bar", "string", "single"));

      expect(e1 !== e2).toBe(true);
    });

    describe("adding entities to database", () => {
      test("should add entity and retrieve it", () => {
        const e1 = entity();
        const db = getDBConnection("test-db");
        const e1Prime = addAttribute(
          e1,
          attribute("foo", "bar", "string", "single")
        );

        const [newDB, e2] = addEntity(db, e1Prime);

        const retrieved = entityAt(newDB, e2.id);
        expect(retrieved).toStrictEqual(e2);
      });

      test("should retrieve entity at specific timestamp", () => {
        const e1 = entity();
        const db = getDBConnection("test-db");
        const e1Prime = addAttribute(
          e1,
          attribute("foo", "bar", "string", "single")
        );

        const [newDB, e2] = addEntity(db, e1Prime);
        const retrievedAtTimestamp = entityAt(newDB, e2.id, 1);

        expect(retrievedAtTimestamp).toStrictEqual(e2);
      });
    });

    describe("multiple entities", () => {
      test("should handle multiple entities in same database", () => {
        const db = getDBConnection("multi-entity-db");

        // First entity
        const e1 = entity();
        const e1Prime = addAttribute(
          e1,
          attribute("foo", "bar", "string", "single")
        );
        const [dbWithE1, e2] = addEntity(db, e1Prime);

        // Second entity
        const e5 = entity();
        const e5Prime = addAttribute(
          e5,
          attribute("baz", 123, "number", "single")
        );
        const [dbWithBoth, e6] = addEntity(dbWithE1, e5Prime);

        // Assert both entities exist
        const retrievedE2 = entityAt(dbWithBoth, e2.id);
        const retrievedE6 = entityAt(dbWithBoth, e6.id);

        expect(retrievedE2).toStrictEqual(e2);
        expect(retrievedE6).toStrictEqual(e6);
      });

      test("should maintain entity history across additions", () => {
        const db = getDBConnection("history-db");

        const e1 = entity();
        const e1Prime = addAttribute(
          e1,
          attribute("foo", "bar", "string", "single")
        );
        const [dbWithE1, e2] = addEntity(db, e1Prime);

        const e5 = entity();
        const e5Prime = addAttribute(
          e5,
          attribute("baz", 123, "number", "single")
        );
        const [dbWithBoth, e6] = addEntity(dbWithE1, e5Prime);

        const e7 = entityAt(dbWithBoth, e2.id);
        const e8 = entityAt(dbWithBoth, e2.id, 1);

        expect(e7).toStrictEqual(e2);
        expect(e8).toStrictEqual(e2);
      });
    });
  });

  describe("attribute queries", () => {
    describe("attributeAt function", () => {
      test("should retrieve attribute by entity and name", () => {
        const db = getDBConnection("attr-test-db");
        const e1 = entity();
        const e1Prime = addAttribute(
          e1,
          attribute("foo", "bar", "string", "single")
        );
        const [newDB, e2] = addEntity(db, e1Prime);

        const attr = attributeAt(newDB, e2.id, "foo");

        expect(attr).toStrictEqual(e2.attributes.foo);
      });

      test("should retrieve attribute at specific timestamp", () => {
        const db = getDBConnection("attr-timestamp-db");
        const e1 = entity();
        const e1Prime = addAttribute(
          e1,
          attribute("foo", "bar", "string", "single")
        );
        const [newDB, e2] = addEntity(db, e1Prime);

        const attr = attributeAt(newDB, e2.id, "foo", 1);

        expect(attr).toStrictEqual(e2.attributes.foo);
      });
    });

    describe("valueOfAt function", () => {
      test("should retrieve attribute value", () => {
        const db = getDBConnection("value-test-db");
        const e1 = entity();
        const e1Prime = addAttribute(
          e1,
          attribute("foo", "bar", "string", "single")
        );
        const [newDB, e2] = addEntity(db, e1Prime);

        const value = valueOfAt(newDB, e2.id, "foo");

        expect(value).toBe("bar");
      });

      test("should retrieve attribute value at timestamp", () => {
        const db = getDBConnection("value-timestamp-db");
        const e1 = entity();
        const e1Prime = addAttribute(
          e1,
          attribute("foo", "bar", "string", "single")
        );
        const [newDB, e2] = addEntity(db, e1Prime);

        const value = valueOfAt(newDB, e2.id, "foo", 1);

        expect(value).toBe("bar");
      });

      test("should handle different data types", () => {
        const db = getDBConnection("number-test-db");
        const e5 = entity();
        const e5Prime = addAttribute(
          e5,
          attribute("baz", 123, "number", "single")
        );
        const [newDB, e6] = addEntity(db, e5Prime);

        const value = valueOfAt(newDB, e6.id, "baz");
        const valueAtTimestamp = valueOfAt(newDB, e6.id, "baz", 1);
        const attr = attributeAt(newDB, e6.id, "baz");
        const attrAtTimestamp = attributeAt(newDB, e6.id, "baz", 1);

        expect(value).toBe(123);
        expect(valueAtTimestamp).toBe(123);
        expect(attr).toStrictEqual(e6.attributes.baz);
        expect(attrAtTimestamp).toStrictEqual(e6.attributes.baz);
      });
    });
  });

  describe("add multiple entities", () => {
    test("they are all set to the same timestamp", () => {
      const db = getDBConnection("number-test-db");
      const e1 = entity();
      const e1Prime = addAttribute(
        e1,
        attribute("baz", 123, "number", "single")
      );
      const e2 = entity();
      const e2Prime = addAttribute(
        e2,
        attribute("buzz", "qix", "string", "single")
      );
      const [newDB, e1Second, e2Second] = addEntities(db, e1Prime, e2Prime);

      expect(newDB.timestamp).toBe(1);
      expect(newDB.topId).toBe(2);
      expect(e1Second.id).toBe(1);
      expect(e2Second.id).toBe(2);

      expect(
        Object.values(e1Second.attributes)
          .map((attr) => attr.timestamp)
          .every((att) => att === 1)
      ).toBe(true);

      expect(Object.values(e1Second.attributes)).toStrictEqual([
        {
          cardinality: "single",
          name: "baz",
          previousTimestamp: -1,
          timestamp: 1,
          type: "number",
          value: 123,
        },
      ]);

      expect(Object.values(e2Second.attributes)).toStrictEqual([
        {
          cardinality: "single",
          name: "buzz",
          previousTimestamp: -1,
          timestamp: 1,
          type: "string",
          value: "qix",
        },
      ]);
    });
  });

  describe("temporal queries", () => {
    test("should maintain entity state across time", () => {
      const db = getDBConnection("temporal-db");

      const e1 = entity();
      const e1Prime = addAttribute(
        e1,
        attribute("foo", "bar", "string", "single")
      );
      const [dbWithE1, e2] = addEntity(db, e1Prime);

      const e5 = entity();
      const e5Prime = addAttribute(
        e5,
        attribute("baz", 123, "number", "single")
      );
      const [dbWithBoth, e6] = addEntity(dbWithE1, e5Prime);

      const e9 = entityAt(dbWithBoth, e6.id);
      const e10 = entityAt(dbWithBoth, e6.id, 2);

      expect(e9).toStrictEqual(e6);
      expect(e10).toStrictEqual(e6);
    });
  });

  function replacerForSet(key: string, value: any) {
    if (value instanceof Set) {
      return [...value]; // Convert Set to Array
    }
    return value;
  }
  describe("update index", () => {
    test("on add entity", () => {
      const db = getDBConnection("update-index");

      const e1 = entity();
      const e1Prime = addAttribute(
        e1,
        attribute("foo", "bar", "string", "single")
      );
      const [dbWithE1] = addEntity(db, e1Prime);

      const eav = indexAt(dbWithE1, "EAV");
      expect(eav.index).toStrictEqual({ 1: { foo: new Set(["bar"]) } });

      const ave = indexAt(dbWithE1, "AVE");
      expect(ave.index).toStrictEqual({ foo: { bar: new Set([1]) } });

      const vae = indexAt(dbWithE1, "VAE");
      expect(vae.index).toStrictEqual({ bar: { foo: new Set([1]) } });

      const vea = indexAt(dbWithE1, "VEA");
      expect(vea.index).toStrictEqual({ bar: { 1: new Set(["foo"]) } });
    });
  });
});
