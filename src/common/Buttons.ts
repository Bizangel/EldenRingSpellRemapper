export const ButtonList = ["A", "B", "X", "Y", "LB", "RB", "LT", "RT", "START", "SELECT", "DPAD_UP", "DPAD_LEFT", "DPAD_RIGHT", "DPAD_DOWN", "LS", "RS"] as const;
export type ButtonString = typeof ButtonList[number];

export const ButtonToImage: Record<ButtonString, string> = {
    "A": "A",
    "B": "B",
    "X": "X",
    "Y": "Y",
    "LB": "LB",
    "RB": "RB",
    "LT": "LT",
    "RT": "RT",
    "START" : "Menu",
    "SELECT": "Windows",
    "DPAD_UP": "Dpad_Up",
    "DPAD_DOWN": "Dpad_Down",
    "DPAD_LEFT": "Dpad_Left",
    "DPAD_RIGHT": "Dpad_Right",
    "LS": "Left_Stick_Click",
    "RS": "Right_Stick_Click"
}