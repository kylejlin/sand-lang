import { Option, Result } from "rusty-ts";
import { TextRange } from ".";
import * as ast from "./ast";
import { TokenType } from "./tokens";

export interface SandParser {
  parse(input: string): Result<ast.FileNode, ParseError>;
}

export type ParseError =
  | UnexpectedTokenError
  | DuplicatePropertyAccessorDeclarationsError;

export enum ParseErrorType {
  UnexpectedToken,
  DuplicatePropertyAccessorDeclarations,
}

export interface UnexpectedTokenError {
  errorType: ParseErrorType.UnexpectedToken;
  token: TokenType;
  text: Option<string>;
  location: TextRange;
  expected: TokenType[];
}

export interface DuplicatePropertyAccessorDeclarationsError {
  errorType: ParseErrorType.DuplicatePropertyAccessorDeclarations;
  readonly declarations:
    | [ast.PropertyGetterDeclaration, ast.PropertyGetterDeclaration]
    | [ast.PropertySetterDeclaration, ast.PropertySetterDeclaration];
}
