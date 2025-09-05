import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { TheatersManager, ViewsManager, ViewsProxy } from "pancake";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Vector3 } from "three";
import { ViewId } from "../../../constants/views/ViewId";
import ReactViewBase, { TransitionProps } from "../../../core/_engine/reacts/views/bases/ReactViewBase";
import MainThreeView from "../../threes/MainThreeView";
import Button from "./components/Button";
import { TheaterId } from "../../../constants/theaters/TheaterId";

export let handleCameraIndexChange: ((index: number) => void) | null = null;

// Types
interface Breakpoint {
  title: string;
  subtitle?: string;
  techno?: string;
  disabled?: boolean;
  description?: string;
}

const breakpoints: Breakpoint[] = [
  { title: "", description: "" },
  {
    title: "Musée de <span class='font-bold'>l’Orangerie</span>",
    subtitle: "awwward project",
    techno: "[React, Three.js, WebGL, GSAP]",
    disabled: false,
  },
  {
    title: "Portfolio <span class='font-bold'>Zoé Michel</span>",
    subtitle: "School project",
    techno: "[Next, GSAP]",
    disabled: true,
  },
];