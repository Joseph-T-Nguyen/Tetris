/**
 * Definition of constants.
 * 
 * Author: Joseph Nguyen 
 */

export {Viewport, Constants, Square, ROWS};

const Viewport = {
    CANVAS_WIDTH: 200,
    CANVAS_HEIGHT: 400,
    PREVIEW_WIDTH: 160,
    PREVIEW_HEIGHT: 80,
} as const;

const Constants = {
    TICK_RATE_MS: 1,        // Game clock fires every 1 ms
    DEFAULT_SPEED: 200,     // Level 1 speed
    GRID_WIDTH: 10,
    GRID_HEIGHT: 20,
    SCORE_MULTIPLIER: 100,  // Get 100 points for each line cleared
    LEVEL_UP: 500,          // Level up after 500 points
    ORIGIN: {x: 4, y: -1},  // Origin of rotation 
    PREVIEW_OFFSET: {x: -1, y: 3}
} as const;

// Defines width and height of one square/grid in the game canvas
const Square = {
    WIDTH: Viewport.CANVAS_WIDTH / Constants.GRID_WIDTH,
    HEIGHT: Viewport.CANVAS_HEIGHT / Constants.GRID_HEIGHT,
} as const;

const ROWS: ReadonlyArray<number> = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19];