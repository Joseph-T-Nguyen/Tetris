/**
 * This module contains all the different initialisations for the different tetriminoes.
 * It also contains one exported method to select the next piece.
 * 
 * Author: Joseph Nguyen
 */
export { getNextPiece, tetrominoes };

import { Block } from "./types";
import { RNG } from "./utils";

type Tetrominoes = ReadonlyArray<ReadonlyArray<Block>>;

const O: ReadonlyArray<Block> = [
    { x: 4, y: -2, colour: "green" },
    { x: 5, y: -2, colour: "green" },
    { x: 4, y: -1, colour: "green" },
    { x: 5, y: -1, colour: "green" },
];

const I: ReadonlyArray<Block> = [
    { x: 3, y: -1, colour: "blue"},
    { x: 4, y: -1, colour: "blue"},
    { x: 5, y: -1, colour: "blue"},
    { x: 6, y: -1, colour: "blue"}
]

const J: ReadonlyArray<Block> = [
    { x: 3, y: -2, colour: "brown"},
    { x: 3, y: -1, colour: "brown"},
    { x: 4, y: -1, colour: "brown"},
    { x: 5, y: -1, colour: "brown"}
]

const L: ReadonlyArray<Block> = [
    { x: 5, y: -2, colour: "red"},
    { x: 3, y: -1, colour: "red"},
    { x: 4, y: -1, colour: "red"},
    { x: 5, y: -1, colour: "red"}
]

const S: ReadonlyArray<Block> = [
    { x: 3, y: -1, colour: "yellow"},
    { x: 4, y: -1, colour: "yellow"},
    { x: 4, y: -2, colour: "yellow"},
    { x: 5, y: -2, colour: "yellow"}
]

const Z: ReadonlyArray<Block> = [
    { x: 3, y: -2, colour: "purple"},
    { x: 4, y: -1, colour: "purple"},
    { x: 4, y: -2, colour: "purple"},
    { x: 5, y: -1, colour: "purple"}
]

const T: ReadonlyArray<Block> = [
    { x: 3, y: -1, colour: "orange"},
    { x: 4, y: -1, colour: "orange"},
    { x: 4, y: -2, colour: "orange"},
    { x: 5, y: -1, colour: "orange"}
]

const tetrominoes: Tetrominoes = [O, I, J, L, S, Z, T];

const getNextPiece = (id: number): ReadonlyArray<Block> => {
    return tetrominoes[RNG.scale(id)];
}