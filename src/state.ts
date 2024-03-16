/**
 * State management file that contains functions and definitions
 * for game state objects.
 * 
 * Author: Joseph Nguyen 
 */
export { Motion, Tick, Drop, Restart, Rotate, reduceState, initialState };

import { State, Block, Action } from "./types";
import { getNextPiece } from "./blocks";
import { Constants, ROWS } from "./constants";
import { RNG } from "./utils";

/************************************** STATE INITIALISATION **************************************/
const initialSeed = RNG.hash(new Date().getMilliseconds()); // IMPURE, but done only once
const initialState: State = {
    gameEnd: false,
    stationary: [],
    moving: getNextPiece(initialSeed),
    nextBlock: getNextPiece(RNG.hash(initialSeed)),
    seed: RNG.hash(initialSeed),
    offset: { x: 0, y: 0 },
    level: 1,
    score: 0,
    highscore: 0
};

/***************************************** STATE UPDATES *****************************************/
/**
 * Allows user to move the block left/down/right
 */
class Motion implements Action {
    constructor(public readonly x: number, public readonly y: number) { }
    apply = (s: State): State => {
        const newState: State = moveBlock(s)(this.x)(this.y);
        return collision(newState) ? s : newState;
    }
}

/**
 * Handles game clock and default block drop if user does not input anything.
 * Additionally, it also hashes the seed based on elapsed time for increased randomness.
 * Level speed up handled here as well.
 */
class Tick implements Action {
    constructor(public readonly elapsed: number) { }
    apply = (s: State): State => {
        // If the game is over, return the same state, with no moving blocks
        if (gameOver(s)) {
            return {
                ...s,
                moving: [],
                highscore: Math.max(s.score, s.highscore),
                gameEnd: true,
                nextBlock: []
            }
        }

        const hashedState: State = { ...s, seed: RNG.hash(this.elapsed) };
        return !(this.elapsed % Math.floor(Constants.DEFAULT_SPEED / s.level))
            ? (collision({ ...s, moving: s.moving.map(block => ({ ...block, y: block.y + 1 })) })
                ? processNextBlock(hashedState) : moveBlock(hashedState)(0)(1))
            : hashedState;
    };
}

/**
 * Recursively moves the block down until a collision is detected
 */
class Drop implements Action {
    apply = (s: State): State => {
        if (gameOver(s)) return s; // Do not allow inputs while gameover.
        const newState: State = moveBlock(s)(0)(1);
        return collision(newState) ? s : this.apply(newState);
    }
}

/**
 * Allows the user to restart, only if the game is over. On restart, rehash
 * all the seeds to be able to start at a different state.
 */
class Restart implements Action {
    apply = (s: State): State => gameOver(s) ?
        {
            ...initialState,
            highscore: s.highscore,
            seed: RNG.hash(s.seed),
            moving: getNextPiece(RNG.hash(s.seed)),
            nextBlock: getNextPiece(RNG.hash(RNG.hash(s.seed)))
        }
        : s;
}

/**
 * Allows the user to rotate left or right for all blocks, except square piece.
 * Additionally, do not allow user input if game is over.
 */
class Rotate implements Action {
    constructor(public readonly direction: string) { }
    /* Logic taken from: https://stackoverflow.com/questions/233850/tetris-piece-rotation-algorithm 
       but modified to fit assignment*/
    apply = (s: State): State => {
        // Do not allow rotation for square piece
        if (gameOver(s) || s.moving[0].colour === "green") return s;

        // Multiply by rotation matrix, using origin and offset to calculate pivot point
        const pivotX = Constants.ORIGIN.x + s.offset.x;
        const pivotY = Constants.ORIGIN.y + s.offset.y;

        const rotatedPiece = s.moving.map(block => {
            const relativeX = block.x - pivotX;
            const relativeY = block.y - pivotY;
            const newX = this.direction === "clockwise" ? pivotX - relativeY : pivotX + relativeY;
            const newY = this.direction === "clockwise" ? pivotY + relativeX : pivotY - relativeX;
            return { ...block, x: newX, y: newY };
        });

        const newState: State = { ...s, moving: rotatedPiece };
        return collision(newState) ? s : newState;
    }
}

/**
 * State transformation
 */
const reduceState = (s: State, action: Action): State => action.apply(s);

/**************************************** HELPER FUNCTIONS ****************************************/
/**
 * Detects collisions with other blocks, x boundaries, and/or y bounds (bottom)
 */
const collision = (newState: State): boolean => {
    return newState.moving.some((movingBlock => newState.stationary.some(
        (statBlocks => statBlocks.x === movingBlock.x && statBlocks.y === movingBlock.y))))
        || newState.moving.some(block => block.y === Constants.GRID_HEIGHT)
        || newState.moving.some(block => (block.x === -1 || block.x === Constants.GRID_WIDTH));
};

/**
 * Allows left/right/downward movement. Used for Tick, Drop and Motion classes.
 */
const moveBlock = (s: State) => (x: number) => (y: number): State => {
    if (gameOver(s)) return s;
    const newBlocks: ReadonlyArray<Block> = s.moving.map((block) => ({
        ...block,
        x: block.x + x,
        y: block.y + y,
    }));
    const newState: State = {
        ...s,
        moving: newBlocks,
        offset: { x: s.offset.x + x, y: s.offset.y + y },
    };
    return newState;
}

/**
 * Handles 'end of turn' logic, including:
 * - resetting offset, getting next piece, clearing rows
 */
const processNextBlock = (s: State): State => {
    return clearRow({
        ...s,
        moving: s.nextBlock,
        stationary: s.stationary.concat(s.moving),
        offset: { x: 0, y: 0 },
        nextBlock: getNextPiece(s.seed)
    })
}

/**
 * Handles row clearing logic. Approach:
 * - calculate row shifts for each of the 20 rows
 *      - row shift amount is the number of rows that have been removed that lie beneath the row
 * - apply row shifts to those rows that have blocks in them
 */
const clearRow = (s: State): State => {
    const clearableRows: ReadonlyArray<number> =
        ROWS.filter(rowNum =>
            s.stationary.filter(block => block.y === rowNum).length === Constants.GRID_WIDTH);

    const nonClearableRows: ReadonlyArray<number> = ROWS.filter(val => !clearableRows.includes(val));

    const rowShifts: ReadonlyArray<number> =
        ROWS.map(value => clearableRows.filter(row => row > value).length);

    const shiftedBlocks: ReadonlyArray<Block> = s.stationary
        .filter(block => nonClearableRows.includes(block.y))
        .map(block => ({ ...block, y: block.y + rowShifts[block.y] }));

    return updateSL({ ...s, stationary: shiftedBlocks })(clearableRows.length);
}

/**
 * Updates scores and levels if applicable, depending on number of rows cleared
 */
const updateSL = (s: State) => (rowsCleared: number): State => {
    const newScore = s.score + rowsCleared * Constants.SCORE_MULTIPLIER;
    const canLevelUp = newScore >= Constants.LEVEL_UP * s.level;
    return {
        ...s,
        score: newScore,
        level: canLevelUp ? s.level + 1 : s.level
    };
}

/**
 * Game over condition is when any column has settled at the top
 */
const gameOver = (s: State): boolean => s.stationary.some(block => block.y === 0);
