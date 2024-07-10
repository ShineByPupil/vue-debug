# watch 和 watchEffect

## watchEffect 的定义

```ts
function watchEffect(
  effect: (onCleanup: OnCleanup) => void,
  options?: WatchEffectOptions
): StopHandle;

type OnCleanup = (cleanupFn: () => void) => void;

interface WatchEffectOptions {
  flush?: 'pre' | 'post' | 'sync'; // 默认：'pre'
  onTrack?: (event: DebuggerEvent) => void;
  onTrigger?: (event: DebuggerEvent) => void;
}

type StopHandle = () => void; // 用来停止该副作用的函数
```

## watch 是 watchEffect 的**超集**

底层都调用函数 doWatch，唯一的区别是 watch 能传入参 cb

```ts
// vue3-submodule\packages\runtime-core\src\apiWatch.ts

// watchEffect 要运行的副作用函数，该函数的参数用来注册清理回调
export type WatchEffect = (onCleanup: OnCleanup) => void;

export type WatchStopHandle = () => void; // 用来停止该副作用的函数

// watch 侦听器的源：ref, 响应式对象, 返回一个值的函数
export type WatchSource<T = any> = Ref<T> | ComputedRef<T> | (() => T);

export function watch<T = any, Immediate extends Readonly<boolean> = false>(
  source: T | WatchSource<T>,
  cb: any,
  options?: WatchOptions<Immediate>
): WatchStopHandle {
  return doWatch(source as any, cb, options);
}

export function watchEffect(
  effect: WatchEffect,
  options?: WatchOptionsBase
): WatchStopHandle {
  return doWatch(effect, null, options);
}
```

## watch 与 watchEffect 的不同点 ＝ cb 的功能

## onCleanup

### onCleanup 的功能

onCleanup 函数接收函数作为参数，首次不会立即生效。会先执行完副作用函数，最后把当前的函数入参处理并存储到 cleanup 内部变量，每次执行副作用函数前优先执行 cleanup 函数

doWatch 的 source 和 cb，出参都支持 onCleanup

### onCleanup 的应用

```js
const id = ref(0);
const data = ref('');

function doAsyncWork(id) {
  let timeId = null;

  return {
    response: new Promise((resolve) => {
      timeId = setTimeout(() => {
        resolve(`data: ${id}`);
        console.log(`data: ${id}`);
      }, 1000);
    }),
    cancel() {
      clearTimeout(timeId);
      console.log(`cancel: ${id}`);
    },
  };
}

watchEffect(async (onCleanup) => {
  const { response, cancel } = doAsyncWork(id.value);

  onCleanup(cancel);

  data.value = await response;
});

id.value++;
```

输出

```
cancel: 0
data: 1
```

当异步事件执行中，id 值变动再次触发副作用函数时， **onCleanup** 会执行上一次的 cancel 函数（用来停止上一次异步事件）

## 副作用函数慎用 async、await（后续版本可能会优化，论点具有时效性）

await 后面的代码能执行，但不能收集依赖，值变动后不会触发副作用函数

```js
const count1 = ref(100);
const count2 = ref(200);

watchEffect(async () => {
  console.log('watchEffect:', count1.value);

  await Promise.resolve();

  console.log('watchEffect:', count2.value);
});

requestAnimationFrame(() => {
  console.log('执行count2.value++;');
  count2.value++;
});

requestAnimationFrame(() => {
  console.log('执行count1.value++;');
  count1.value++;
});
```

输出

```
watchEffect: 100
watchEffect: 200
执行count2.value++
执行count1.value++
watchEffect: 101
watchEffect: 201
```
