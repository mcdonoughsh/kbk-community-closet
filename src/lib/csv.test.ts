import { describe, it, expect } from "vitest";
import { toCsv } from "./csv";

describe("toCsv", () => {
  it("joins plain cells with commas and rows with CRLF", () => {
    expect(toCsv([["Name", "Email"], ["Ada", "ada@example.com"]])).toBe(
      "Name,Email\r\nAda,ada@example.com"
    );
  });

  it("quotes cells containing commas, quotes, or newlines", () => {
    expect(toCsv([["Smith, Jo", 'Say "hi"', "line\nbreak"]])).toBe(
      '"Smith, Jo","Say ""hi""","line\nbreak"'
    );
  });

  it("neutralizes cells a spreadsheet would run as a formula", () => {
    expect(toCsv([["=HYPERLINK(1)", "+1", "-2", "@x", "ok"]])).toBe(
      "'=HYPERLINK(1),'+1,'-2,'@x,ok"
    );
  });
});
