# SvelteKit Action
- 
- Gergely Laborci
- gergely@laborci.hu

## Description

Az `sk-action` egy jól használható, RPC-re hasonlító interface-t nyújt, hogy a sveltekit oldalaid, komponenseid kommunikálhassanak a szerverrel. A `sk-action` a sveltekit formkezelő moduljára épül, de konkrétan a `<form>`-ok használata nélkül. A kommunikációhoz az Axios library-t használja.

## Usage

### Action-ök defniálása

Az `action`-öket külön definiáljuk, hogy a kódunk bármely pontjáról uniformizáltan meghívhassuk.  Az `Action.define` metóduson keresztül lehet akciókat létrehozni.

### Action.define

```ts
define<R = ResultType>(
	data: any = {}, 
   	options?: Partial<AxiosRequestConfig>, 
	url?: [route: string, action: string]
): Action<R>
```

Például egy signIn action definiálása az alábbiak szerint fest:

```ts
export const signIn = (login: string, password: string) => Action.define<boolean>({login, password}, {}, ["/actions/auth", "signIn"])
```

### Action.setup

```ts
public static setup(actions: any, handlers?: HandlerFunctionSet): void
```


Jellemzően csoportokba szervezzük a hívásokat az alábbiak szerint.

```ts
const actions = {
	auth: {
		signIn: (login: string, password: string) => Action.define({login, password}, {}, ["/actions/auth", "signIn"]),
		signOut: () => Action.define({}, {}, ["/actions/auth", "signOut"])
	}
};

export default actions;
```

Ezzel a formával két legyet ütünk egy csapásra. Egyrészt, ha ügyesek voltunk, akkor a létrehozott objektumunk kulcsai egy az egyben megegyeznek az url path és action részeivel. Illetve, ha egyben kezeljük az `action`-öket, akkor közös hibakezelőket is tudunk hozzájuk adni.

A következő kódban definiáljuk az akciókat, de az url mezőt nem adjuk meg, azt majd az `Action.setup` metódus fogja hozzájuk adni. E mellett még default hibakezelőket is kötünk hozzájuk.

```ts
const actions = {
	auth: {
		signIn: (login: string, password: string) => Action.define({login, password}),
		signOut: Action.define
	}
};

Action.setup({actions}, {
	401: async () => user.set(null),
	failure: res => {console.log(res)},
	error: res => {
		console.log(res)
		return res
	}
})

export default actions;
```

## Call to action

## Response

## Error handling