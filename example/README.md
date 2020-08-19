# lepont-example

> An example usage of [lepont][] native bridge library.

`lepont` (Le Pont, "the bridge" in french) is a bridging library between react-native and browser.

This example repository demonstrates the usages of [lepont][] itself, [@lepont/share][], and [@lepont/async-storage][].

# How to run

You need to have Xcode, Cocoapods, JDK 8, and Android Studio installed.

```
yarn
yarn pod-install
yarn ios     # => this should start example app in your ios simulator
yarn android # => this should start example app in your android simulator
```

## Note

You can install Xcode from App Store.

You can donwload JDK 8 installer from [the oracle's homepage](https://www.oracle.com/java/technologies/javase/javase-jdk8-downloads.html).

You can download Android Studio from [the homepage](https://developer.android.com/studio).

[lepont]: https://github.com/kt3k/lepont
[@lepont/share]: https://github.com/kt3k/lepont-share
[@lepont/async-storage]: https://github.com/kt3k/lepont-async-storage
[Homebrew]: https://brew.sh/
