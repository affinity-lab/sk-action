import axios, {AxiosError, type AxiosProgressEvent, type AxiosRequestConfig} from "axios"
import ActionFatalErrorResponse from "./response/action-fatal-error-response";
import type ActionResponseInterface from "./response/action-response-interface";
import ActionResponse from "./response/action-response";
import type {HandlerFunctionSet, ResultType} from "./types";
import type {ActionFailure} from "@sveltejs/kit";

type ActionUrl = [route: string, action: string];

export default class Action<R = ResultType> {

	private options: Partial<AxiosRequestConfig> = {headers: {"Content-Type": "multipart/form-data"}};

	constructor(private data?: any, options: Partial<AxiosRequestConfig> = {}, public actionUrl?: ActionUrl) {
		this.options = Object.assign(this.options, options);
	}

	get url(): string | undefined {
		if (this.actionUrl === undefined) return undefined;
		return `${this.actionUrl[0]}?/${this.actionUrl[1]}`
	}

	onUploadProgress(handler: (progressEvent: AxiosProgressEvent) => void): this {
		this.options.onUploadProgress = handler;
		return this;
	}
	onDownloadProgress(handler: (progressEvent: AxiosProgressEvent) => void): this {
		this.options.onDownloadProgress = handler;
		return this;
	}
	setHeader(key: string, value?: string): this {
		if (typeof value === "undefined" && typeof this.options.headers![key] !== "undefined") delete this.options.headers![key];
		else this.options.headers![key] = value;
		return this;
	}

	public async call(options?: Partial<AxiosRequestConfig>): Promise<ActionResponseInterface<R>|ActionFatalErrorResponse> {
		if (typeof options !== "undefined") this.options = Object.assign(this.options, options);
		this.options.headers!["Content-Type"] = "multipart/form-data";
		let response;
		try {
			response = new ActionResponse(await axios.post(this.url!, this.data, this.options));
			if (response.result.type === "failure") {
				let status: number = response.result.status;
				if (typeof this.handlers[status] !== "undefined") this.handlers[status](response.result as unknown as ActionFailure);
				else if (typeof this.handlers.failure !== "undefined") this.handlers.failure(response.result as unknown as ActionFailure);
			}
		} catch (e) {
			if (e instanceof AxiosError && typeof e.response !== "undefined") {
				response = new ActionFatalErrorResponse(e.response);
				if (typeof this.handlers.error !== "undefined") {
					response = this.handlers.error(response);
				}
			} else throw e;
		}
		return response;
	}

	// public static define<R = ResultType>(route: string, action: string, data: any = {}, options?: Partial<AxiosRequestConfig>): Action<R> { return new Action<R>(`/${route}?/${action}`, data, options); }
	public static define<R = ResultType>(data: any = {}, options?: Partial<AxiosRequestConfig>, url?: ActionUrl): Action<R> { return new Action<R>(data, options, url); }

	private handlers: HandlerFunctionSet = {};

	public static setup(actions: any, handlers?: HandlerFunctionSet): void;
	public static setup(actions: any, handlers?: HandlerFunctionSet, route?: string): void;
	public static setup(actions: any, handlers?: HandlerFunctionSet, route?: string): void {
		if (route === undefined) route = "";
		for (let key in actions) {
			if (typeof actions[key] === "function") {
				let actionDefiner = actions[key]
				actions[key] = (...args: any) => {
					let action: Action = actionDefiner(...args)
					if (action.url === undefined) action.actionUrl = [route!, key];
					if(handlers !== undefined) action.handlers = handlers;
					return action;
				}
			} else {
				this.setup(actions[key], handlers, `${route}/${key}`);
			}
		}
	}

}

