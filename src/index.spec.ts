import { describe, expect, test } from "vitest";
import {
  addAttribute,
  addEntity,
  attribute,
  attributeAt,
  entity,
  entityAt,
  getDBConnection,
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

  describe("add entity", () => {
    test("add attribute creates new instance", () => {
      const e1 = entity();

      const e2 = addAttribute(e1, attribute("foo", "bar", "string", "single"));

      expect(e1 !== e2).toBe(true);
    });

    test("add and search entity", () => {
      const e1 = entity();

      const name = "foo";
      const db = getDBConnection(name);

      const e1Prime = addAttribute(
        e1,
        attribute("foo", "bar", "string", "single")
      );
      const [newDB, e2] = addEntity(db, e1Prime);

      const e3 = entityAt(newDB, e2.id);
      const e4 = entityAt(newDB, e2.id, 1);

      expect(e3).toStrictEqual(e2);
      expect(e4).toStrictEqual(e2);

      const e5 = entity();
      const e5Prime = addAttribute(
        e5,
        attribute("baz", 123, "number", "single")
      );
      const [newNewDb, e6] = addEntity(newDB, e5Prime);
      const e7 = entityAt(newNewDb, e2.id);
      const e8 = entityAt(newNewDb, e2.id, 1);
      const att7 = attributeAt(newDB, e2.id, "foo");
      const att7Prime = attributeAt(newDB, e2.id, "foo", 1);
      const val7 = valueOfAt(newDB, e2.id, "foo");
      const val7Prime = valueOfAt(newDB, e2.id, "foo", 1);

      expect(att7).toStrictEqual(e2.attributes.foo);
      expect(att7Prime).toStrictEqual(e2.attributes.foo);
      expect(val7).toBe("bar");
      expect(val7Prime).toBe("bar");
      expect(e7).toStrictEqual(e2);
      expect(e8).toStrictEqual(e2);

      const e9 = entityAt(newNewDb, e6.id);
      const e10 = entityAt(newNewDb, e6.id, 2);
      const att9 = attributeAt(newNewDb, e6.id, "baz");
      const att9Prime = attributeAt(newNewDb, e6.id, "baz", 2);
      const val9 = valueOfAt(newNewDb, e6.id, "baz");
      const val9Prime = valueOfAt(newNewDb, e6.id, "baz", 2);

      expect(val9).toBe(123);
      expect(val9Prime).toBe(123);
      expect(att9).toStrictEqual(e6.attributes.baz);
      expect(att9Prime).toStrictEqual(e6.attributes.baz);
      expect(e9).toStrictEqual(e6);
      expect(e10).toStrictEqual(e6);
    });
  });
});
