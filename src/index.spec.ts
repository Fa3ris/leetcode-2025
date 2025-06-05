import { describe, expect, test } from "vitest";
import {
  addEntity,
  Database,
  getDBConnection,
  entity,
  addAttribute,
  attribute,
  entityAt,
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

    test("one entity", () => {
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
    });
  });
});
