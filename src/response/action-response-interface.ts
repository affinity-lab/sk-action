import type {ActionResult} from "@sveltejs/kit";
import type {AxiosResponse, AxiosResponseHeaders, RawAxiosResponseHeaders} from "axios";
import type {ResultType} from "../types";

export default interface ActionResponseInterface<R = ResultType> {
	readonly result: ActionResult | null;
	readonly response: AxiosResponse;
	readonly http: { readonly headers: RawAxiosResponseHeaders | AxiosResponseHeaders; readonly text: string; readonly status: number };
	readonly type: "success" | "failure" | "redirect" | "error" | "fatal-error";
	readonly status: number | undefined;
	readonly data: R;
	readonly location: string | undefined;
	readonly error: any;
	readonly isSuccess: boolean;
	readonly isFailure: boolean;
	readonly isRedirect: boolean;
	readonly isError: boolean;
	onSuccess(callback: (data: R, status: number) => void): this;
	onFailure<T = Record<string, any> | undefined>(status: number, callback: (data: T, status: number) => void): this;
	onFailure<T = Record<string, any> | undefined>(callback: (data: T, status: number) => void): this;
	onRedirect(callback: (location: string, status: number) => void): this;
	onError<T = any>(callback: (error: T, status?: number) => void): this;
	onFatalError<T = any>(callback: (response: AxiosResponse) => void): this;
}