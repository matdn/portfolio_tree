export enum DomEvent {
    // Mouse Events
    CLICK = "click",
    DOUBLE_CLICK = "dblclick",
    MOUSE_DOWN = "mousedown",
    MOUSE_UP = "mouseup",
    MOUSE_MOVE = "mousemove",
    MOUSE_ENTER = "mouseenter",
    MOUSE_LEAVE = "mouseleave",
    MOUSE_WHEEL = "wheel",
    CONTEXT_MENU = "contextmenu",

    // Touch Events
    TOUCH_START = "touchstart",
    TOUCH_MOVE = "touchmove",
    TOUCH_END = "touchend",
    TOUCH_CANCEL = "touchcancel",

    // Keyboard Events
    KEY_DOWN = "keydown",
    KEY_UP = "keyup",
    KEY_PRESS = "keypress",

    // Focus Events
    FOCUS = "focus",
    BLUR = "blur",

    // Form Events
    CHANGE = "change",
    INPUT = "input",
    SUBMIT = "submit",
    RESET = "reset",

    // Document Events
    FULLSCREENCHANGE = "fullscreenchange",

    // Window Events
    LOAD = "load",
    UNLOAD = "unload",
    BEFORE_UNLOAD = "beforeunload",
    RESIZE = "resize",
    SCROLL = "scroll",

    // Clipboard Events
    CUT = "cut",
    COPY = "copy",
    PASTE = "paste",

    // Drag and Drop Events
    DRAG = "drag",
    DRAG_START = "dragstart",
    DRAG_END = "dragend",
    DRAG_ENTER = "dragenter",
    DRAG_LEAVE = "dragleave",
    DRAG_OVER = "dragover",
    DROP = "drop",

    // Media Events
    PLAY = "play",
    PAUSE = "pause",
    ENDED = "ended",
    CAN_PLAY = "canplay",
    TIMEUPDATE = 'timeupdate',

    // Animation Events
    ANIMATION_START = "animationstart",
    ANIMATION_END = "animationend",
    ANIMATION_ITERATION = "animationiteration",

    // Lottie Events
    COMPLETE = 'complete',

    // Transition Events
    TRANSITION_START = "transitionstart",
    TRANSITION_END = "transitionend",
    TRANSITION_CANCEL = "transitioncancel",

    // Other Events
    BEFORE_PRINT = "beforeprint",
    AFTER_PRINT = "afterprint",
    HASH_CHANGE = "hashchange",
    POP_STATE = "popstate",
    STORAGE = "storage",
    ONLINE = "online",
    OFFLINE = "offline",
}
