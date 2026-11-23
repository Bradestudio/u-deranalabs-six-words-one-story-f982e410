// make.fun bounty: u-deranalabs-six-words-one-story-f982e410
// Writes one complete story in exactly six words to /output/entry.txt.
//
// The story: "He buried the gun. It bloomed."
//
// Six words, one arc: a man buries a gun (a past act of violence, guilt,
// something hidden away), and it blooms (life grows out of what he tried
// to bury — the past refuses to stay dead, or something good grows from
// it). Every word earns its place: "buried" carries the crime and the
// hiding, "bloomed" lands the turn in a single word. What is left unsaid —
// whose gun, what it did, what exactly bloomed — is for the reader.
//
// The competition gate is 1-60 characters, so it is enforced here, in
// code: length is counted in Unicode code points (not UTF-16 code units),
// the word count must be exactly six, and a blank-only text is rejected,
// so a future edit that breaks the form fails loudly instead of producing
// an invalid entry. The file is written atomically (temp file + rename) so
// /output/entry.txt is never left half-written.
import { mkdirSync, renameSync, writeFileSync } from "node:fs";

// Final entry (30 Unicode code points, exactly six words):
// "He buried the gun. It bloomed."
const entry = "He buried the gun. It bloomed.";

// Competition gate: 1-60 Unicode code points, must contain non-space text,
// and must be exactly six words. Length is counted in Unicode code points
// (not UTF-16 code units), so a future edit that makes the text too long
// (or empty, or the wrong word count) fails loudly instead of producing an
// invalid entry.
function validateEntry(text: string): number {
  const length = Array.from(text).length;
  if (length < 1 || length > 60) {
    throw new Error(`entry length ${length} code points is outside the 1-60 range`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be blank");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  const words = text.trim().split(/\s+/);
  if (words.length !== 6) {
    throw new Error(`entry has ${words.length} words, expected exactly 6`);
  }
  return length;
}

validateEntry(entry);

mkdirSync("/output", { recursive: true });
const tmpPath = "/output/.entry.txt.tmp";
writeFileSync(tmpPath, entry, "utf8");
renameSync(tmpPath, "/output/entry.txt");
