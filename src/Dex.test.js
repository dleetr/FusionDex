// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import { idToName, nameToID } from "./utility/DexMap";

it("works for 1-251 mons", () => {
  expect(idToName(1, false).toLowerCase()).toEqual("bulbasaur");
  expect(idToName(1, true).toLowerCase()).toEqual("bulbasaur");
  expect(idToName(251, false).toLowerCase()).toEqual("celebi");
  expect(idToName(251, true).toLowerCase()).toEqual("celebi");

  expect(nameToID("bulbasaur", false)).toEqual(1);
  expect(nameToID("bulbasaur", true)).toEqual(1);
  expect(nameToID("celebi", true)).toEqual(251);
});

it("works for custom (>251) dex mons", () => {
  expect(idToName(252, true).toLowerCase()).toEqual("azurill");
  expect(idToName(252, false).toLowerCase()).toEqual("treecko");

  expect(nameToID("treecko", false)).toEqual(252);
  expect(nameToID("azurill", true)).toEqual(252);
});
