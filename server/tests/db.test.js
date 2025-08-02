/**
 * @jest-environment node
 */
import { jest } from "@jest/globals";

/* ────────── 1.  Mock mysql2/promise BEFORE importing db.js ───────── */
jest.unstable_mockModule("mysql2/promise", () => {
    return {
        default: {
            createPool: jest.fn(() => {
                /* stub of the pool object returned by createPool() */
                return {
                    execute: jest.fn(async (sql, params) => {
                        /* You could branch on sql if you want different behaviour */
                        if (sql === "THROW") {
                            throw new Error("Boom!");
                        }
                        return [["row1", "row2"]]; // 1-element array → [results]
                    }),
                };
            }),
        },
    };
});

/* ────────── 2.  Import module under test (after mocks) ───────── */
const { query } = await import("../db.js");      // adjust path as needed
const mysql     = await import("mysql2/promise"); // to inspect the stub

describe("db.js query()", () => {
    it("returns rows when the pool succeeds", async () => {
        const rows = await query("SELECT 1", [42]);

        expect(rows).toEqual(["row1", "row2"]);
        const pool = mysql.default.createPool.mock.results[0].value;
        expect(pool.execute).toHaveBeenCalledWith("SELECT 1", [42]);
    });

    it("re-throws errors from the pool so callers can catch them", async () => {
        await expect(query("THROW", [])).rejects.toThrow("Boom!");
    });
});
