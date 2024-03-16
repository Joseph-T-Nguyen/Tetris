/**
 * Module for utility and helper functions
 * 
 * Author: Joseph Nguyen 
 */
export { RNG }
import { tetrominoes } from "./blocks";

/**
 * A random number generator which provides two pure functions
 * `hash` and `scaleToRange`.  Call `hash` repeatedly to generate the
 * sequence of hashes.
 * 
 * Taken from Tutorial 4 exercise code, and modified to scale between 0 and 7
 */
abstract class RNG {
    // LCG using GCC's constants
    private static m = 0x80000000; // 2**31
    private static a = 1103515245;
    private static c = 12345;

    /**
     * Call `hash` repeatedly to generate the sequence of hashes.
     * @param seed
     * @returns a hash of the seed
     */
    public static hash = (seed: number) => (RNG.a * seed + RNG.c) % RNG.m;

    /**
     * Takes hash value and scales it to the range [0, 6]
     */
    public static scale = (hash: number) => Math.round((hash / (RNG.m - 1)) * (tetrominoes.length - 1));
}