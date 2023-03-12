import type {ActionFailure} from "@sveltejs/kit";
import type ActionFatalErrorResponse from "./response/action-fatal-error-response";
import type ActionResponseInterface from "./response/action-response-interface";

export type Dict = { [p: string]: any }
export type ResultType<T = Dict> = Dict & T | any;
export type FailureHandlerFunction = (result: ActionFailure<Record<string, any> | undefined>) => void;
export type FatalErrorHandlerFunction = (response: ActionFatalErrorResponse) => ActionResponseInterface;
export type HandlerFunctionSet = {[p:number]:FailureHandlerFunction}&{error?:FatalErrorHandlerFunction}&{failure?:FailureHandlerFunction}