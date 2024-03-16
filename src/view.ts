/**
 * This module contains the functions for rendering the blocks 
 * in the game. These methods are impure.
 * 
 * Author: Joseph Nguyen
 */
export { render }
import { Viewport, Square, Constants } from "./constants";
import { Block, State } from "./types";

/**
 * Displays a SVG element on the canvas. Brings to foreground.
 * @param elem SVG element to display
 */
const show = (elem: SVGGraphicsElement) => {
    elem.setAttribute("visibility", "visible");
    svg.appendChild(elem);  // Note: Modified this to append to canvas
};

/**
 * Hides a SVG element on the canvas.
 * @param elem SVG element to hide
 */
const hide = (elem: SVGGraphicsElement) =>
    elem.setAttribute("visibility", "hidden");

/**
 * Creates an SVG element with the given properties.
 *
 * See https://developer.mozilla.org/en-US/docs/Web/SVG/Element for valid
 * element names and properties.
 *
 * @param namespace Namespace of the SVG element
 * @param name SVGElement name
 * @param props Properties to set on the SVG element
 * @returns SVG element
 */
const createSvgElement = (
    namespace: string | null,
    name: string,
    props: Record<string, string> = {}
) => {
    const elem = document.createElementNS(namespace, name) as SVGElement;
    Object.entries(props).forEach(([k, v]) => elem.setAttribute(k, v));
    return elem;
};

// Canvas elements
const svg = document.querySelector("#svgCanvas") as SVGGraphicsElement & HTMLElement;
const preview = document.querySelector("#svgPreview") as SVGGraphicsElement & HTMLElement;
const gameover = document.querySelector("#gameOver") as SVGGraphicsElement & HTMLElement;

svg.setAttribute("height", `${Viewport.CANVAS_HEIGHT}`);
svg.setAttribute("width", `${Viewport.CANVAS_WIDTH}`);
preview.setAttribute("height", `${Viewport.PREVIEW_HEIGHT}`);
preview.setAttribute("width", `${Viewport.PREVIEW_WIDTH}`);

// Text fields
const levelText = document.querySelector("#levelText") as HTMLElement;
const scoreText = document.querySelector("#scoreText") as HTMLElement;
const highScoreText = document.querySelector("#highScoreText") as HTMLElement;

/**
 * This function renders a single block unit to the screen by appending to the svg
 * @param block The block to render onto the screen
 */
const renderBody = (section: SVGGraphicsElement) => (block: Block): void => {
    const cube = createSvgElement(section.namespaceURI, "rect", {
        height: `${Square.HEIGHT}`,
        width: `${Square.WIDTH}`,
        x: `${Square.WIDTH * block.x}`,
        y: `${Square.HEIGHT * block.y}`,
        style: `fill: ${block.colour}`,
    })

    section.appendChild(cube);
};

/**
 * Reusable functions for rendering in the preview vs canvas
 */
const renderPreview = renderBody(preview);
const renderSVG = renderBody(svg);

/**
 * Renders the current state to the canvas.
 *
 * In MVC terms, this updates the View using the Model.
 *
 * @param s Current state
 */
const render = (s: State): void => {
    // Clear svg elements
    svg.innerHTML = "";
    preview.innerHTML = "";

    // Render all the cubes
    s.moving.forEach(block => renderSVG(block));
    s.stationary.forEach(block => renderSVG(block));

    // Render preview blocks: Default offset is (-1, 3)
    if (s.nextBlock.length) {
        s.nextBlock.forEach(block => {
            const updatedBlock: Block = { 
                ...block, 
                x: block.x + Constants.PREVIEW_OFFSET.x, 
                y: block.y + Constants.PREVIEW_OFFSET.y }
            renderPreview(updatedBlock);
        });
    }

    // Display level, score and highscore text
    levelText.innerHTML = `${s.level}`;
    scoreText.innerHTML = `${s.score}`;
    highScoreText.innerHTML = `${s.highscore}`;

    s.gameEnd ? show(gameover) : hide(gameover);
};
