/**
 * Main game module, which contains all the observables that get merged into a stream
 * of Action classes, which reduceState will act on.
 * 
 * Author: Joseph Nguyen 
 */

/** Import from relevant modules */
import "./style.css";
import { fromEvent, interval, merge, Observable, Subscription } from "rxjs";
import { map, filter, scan } from "rxjs/operators";
import { Constants } from "./constants.ts";
import { Key, Event, State, Action } from "./types.ts";
import { render } from "./view.ts";
import { Motion, Tick, Drop, Restart, Rotate, reduceState, initialState } from "./state.ts"

export function main() {
    const key$ = (e: Event, k: Key): Observable<KeyboardEvent> => 
        fromEvent<KeyboardEvent>(document, e)
            .pipe(filter(({ code }) => code === k),
                  filter(({ repeat }) => !repeat));

    // Keyboard observables
    const left$: Observable<Motion> = key$("keydown", "KeyA").pipe(map(() => new Motion(-1, 0)));
    const right$:Observable<Motion> = key$("keydown", "KeyD").pipe(map(() => new Motion(1, 0)));
    const down$: Observable<Motion> = key$("keydown", "KeyS").pipe(map(() => new Motion(0, 1)));
    const drop$: Observable<Drop>   = key$("keydown", "Space").pipe(map(()=> new Drop()));
    const restart$: Observable<Restart> = key$("keydown", "KeyR").pipe(map( () => new Restart()));
    const rotateLeft$: Observable<Rotate> = key$("keydown", "KeyQ").pipe(map( () => new Rotate("anticlockwise")));
    const rotateRight$: Observable<Rotate> = key$("keydown", "KeyE").pipe(map( () => new Rotate("clockwise")));

    // Time-related observables
    const tick$: Observable<Tick> = interval(Constants.TICK_RATE_MS).pipe(map((elapsed: number) => new Tick(elapsed)));

    const action$: Observable<Action> = merge(tick$, left$, right$, down$, drop$, restart$, rotateLeft$, rotateRight$);
    const state$: Observable<State> = action$.pipe(scan(reduceState, initialState));
    const subscription: Subscription = state$.subscribe(render);
}

/** Runs main function on window load */
if (typeof window !== "undefined") {
    window.onload = () => {
        main();
    };
}
