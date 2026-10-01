"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, useGSAP);

export { gsap, ScrollTrigger, SplitText, useGSAP };

/** Every animation runs inside this query, so "reduce motion" users get a static, fully visible page. */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

/** Pointer effects (magnetic buttons, cursor glow) only make sense with a mouse on a wide screen. */
export const POINTER = "(prefers-reduced-motion: no-preference) and (min-width: 1024px) and (pointer: fine)";

/** Sticky stacking project cards need room: they fall back to a normal list on short or narrow screens. */
export const STACK = "(prefers-reduced-motion: no-preference) and (min-width: 1024px) and (min-height: 720px)";

export const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ<>/_-+*";
