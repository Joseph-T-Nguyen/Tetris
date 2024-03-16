/**
 * Type definitions for Tetris
 * 
 * Author: Joseph Nguyen 
 */
export type { Key, Event, Block, State, Action };

/** User input */
type Key = "KeyS" | "KeyA" | "KeyD" | "KeyR" | "Space" | "KeyQ" | "KeyE";

type Event = "keydown" | "keyup" | "keypress";

// Blocks represents one block on the grid
type Block = Readonly<{
    x: number,
    y: number,
    colour: string
}>;

// Offset: used to keep track of position relative to spawn point
type Offset = Readonly<{
    x: number,
    y: number
}>

// State
type State = Readonly<{
    gameEnd: boolean,
    moving: ReadonlyArray<Block>,    // Currently moving blocks
    stationary: ReadonlyArray<Block>, // Stationary/'dead' blocks
    seed: number,
    nextBlock: ReadonlyArray<Block>,
    offset: Offset,
    level: number,
    score: number,
    highscore: number
}>;

/** 
 * Actions modify the state. 
 * Design taken from Asteroids Example
 */
interface Action {
    apply(s: State): State;
}