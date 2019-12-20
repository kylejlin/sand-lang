import React from "react";

export type NonNullReactNode = Exclude<React.ReactNode, undefined | null>;
