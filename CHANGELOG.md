# [0.6.0](https://gitlab.com/auto-cloud/cloudgraph/sdk/compare/0.5.4...0.6.0) (2021-11-23)


### Features

* tweaks to drop the need to maintain a mandatory mutation file ([e3e2e92](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/e3e2e92fddb00fe83a029ec7c90fb70e46be5f1d))

## [0.5.4](https://gitlab.com/auto-cloud/cloudgraph/sdk/compare/0.5.3...0.5.4) (2021-11-19)


### Bug Fixes

* Fixed RulesEngine interface ([8b8958a](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/8b8958a9f52a19db716b103cffbc381b94a8042b))
* Included severity field to rule engine ([4c18614](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/4c18614054d29d4f29ac8ff117f700ff6a91f35f))
* Validated empty data passed on processRule ([dfb6e1e](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/dfb6e1ebb50de683ee12c4a5e962bb027ee079d0))

## [0.5.3](https://gitlab.com/auto-cloud/cloudgraph/sdk/compare/0.5.2...0.5.3) (2021-11-15)


### Bug Fixes

* Added new operator to evaluate empty/filled arrays ([57cfc82](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/57cfc82880e19e823e29a2515fcb747e53cfd760))

## [0.5.2](https://gitlab.com/auto-cloud/cloudgraph/sdk/compare/0.5.1...0.5.2) (2021-11-15)


### Bug Fixes

* Extended logger type ([dd19b1a](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/dd19b1a23556e933fa8b8167defd91b9f067e4e2))

## [0.5.1](https://gitlab.com/auto-cloud/cloudgraph/sdk/compare/0.5.0...0.5.1) (2021-11-09)


### Bug Fixes

* Exported types for Rules Engine ([360a5bf](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/360a5bf70043eb642df54a90a571890fb863777d))

# [0.5.0](https://gitlab.com/auto-cloud/cloudgraph/sdk/compare/0.4.0...0.5.0) (2021-10-26)


### Bug Fixes

* Fixed unknow field at awsFinding schema ([96bfd2c](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/96bfd2c5ccbcba4d00d6fcaf645d2e4025d6ecf1))


### Features

* Migrated Policy Pack engine to SDK repo ([d939607](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/d939607533d8c6a4c12f94f85a1648742c258a3e))

# [0.4.0](https://gitlab.com/auto-cloud/cloudgraph/sdk/compare/0.3.10...0.4.0) (2021-10-19)


### Bug Fixes

* **debugLog:** set cg prefix on debug log ([3b1cb73](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/3b1cb73d0a502a5bb28d6b144a205a55d0e31dcf))


### Features

* **debugLog:** write error/debug logs to file in debug mode ([bb74b62](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/bb74b62967534d1dd4816462bf60f95dff220990))

## [0.3.10](https://gitlab.com/auto-cloud/cloudgraph/sdk/compare/0.3.9...0.3.10) (2021-10-12)


### Bug Fixes

* **service:** update service type with new params ([f990413](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/f990413155a7c5976ee682c30abe468795fb089a))

## [0.3.9](https://gitlab.com/auto-cloud/cloudgraph/sdk/compare/0.3.8...0.3.9) (2021-09-28)


### Bug Fixes

* **logger:** Update how logger handles instances of error objs ([5edfea0](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/5edfea0d6a1ef790ea730ff920a50bd0960d003c))

## [0.3.8](https://gitlab.com/auto-cloud/cloudgraph/sdk/compare/0.3.7...0.3.8) (2021-09-24)


### Bug Fixes

* Added extra attribute to getData interface ([853586f](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/853586fc1072ff9852361a7371d8a6567c29ddb3))

## [0.3.7](https://gitlab.com/auto-cloud/cloudgraph/sdk/compare/0.3.6...0.3.7) (2021-09-21)


### Bug Fixes

* **.gitlab-ci:** remove yarn lockfile freezing ([343d1ad](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/343d1ad442a06ba65424b66c151a3336137f560d))
* **.gitlab-ci:** set NODE_ENV to ci for build phase ([7d06713](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/7d067132e315a007e5b225382d3dc6398dfa0729))
* **.gitlab-gi:** set NODE_ENV before yarn install ([38c1335](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/38c13352a827474b085a7c893287d04dbeaf2e3c))

## [0.3.6](https://gitlab.com/auto-cloud/cloudgraph/sdk/compare/0.3.5...0.3.6) (2021-09-21)


### Bug Fixes

* **deps:** correct devDeps and deps list ([c9650dd](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/c9650dd2ea057593bfc4ea5f23e101803abb2cd6))
* **deps:** correct devDeps and deps list ([3f02b21](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/3f02b210440ac02e58ebb5fb2adc2cb9206ffa3a))
* **logger:** update logger so you can log during a spinner ([713805d](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/713805d1519f7a323418f9c2d7bbf962d32ee62f))

## [0.3.5](https://gitlab.com/auto-cloud/cloudgraph/sdk/compare/0.3.4...0.3.5) (2021-09-20)


### Bug Fixes

* **client:** Update client to assign empty obj to config if there isn't one ([3983c23](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/3983c23ade85abbe2139ea297c0c7d2edbf7ac19))
* **client:** Update client to assign empty obj to config if there isnt one ([18de389](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/18de3894e389bd8f936ed359f24b775d851fe736))

## [0.3.4](https://gitlab.com/auto-cloud/cloudgraph/sdk/compare/0.3.3...0.3.4) (2021-09-08)


### Bug Fixes

* Be more specific with types ([8c30b69](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/8c30b69f00932967dbdd1819cf518999144522cf))
* Rework logger parsing content ([aed8996](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/aed899658512319d7c7b37af66753495e76945a8))

## [0.3.3](https://gitlab.com/auto-cloud/cloudgraph/sdk/compare/0.3.2...0.3.3) (2021-08-26)


### Bug Fixes

* **spinner:** drop spinner restart on info/debug messages ([fa2383e](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/fa2383ef3c4a878e836a0295194cacb2030cb30d))

## [0.3.2](https://gitlab.com/auto-cloud/cloudgraph/sdk/compare/0.3.1...0.3.2) (2021-08-25)


### Bug Fixes

* **spinner:** downgrade ora to ^5.4.1 ERR_REQUIRE_ESM ([9749e37](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/9749e3770ef85a22e8cb8584a307c6fd5671d6c2))

## [0.3.1](https://gitlab.com/auto-cloud/cloudgraph/sdk/compare/0.3.0...0.3.1) (2021-08-25)


### Bug Fixes

* **spinner:** remove consola ([d38c4f6](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/d38c4f642608e20167f7f1bdbe148f7093ec0588))
* **spinner:** update logger debug env var ([1cd8064](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/1cd8064e84a4446d2ad5c191326d48dc22d65210))
* **spinner:** use Ora ([b429916](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/b4299161f1ae218af732faa877f75bedb12b724f))
* **spinner:** use Ora for CLI spinner ([aa19a32](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/aa19a329e4e3a95acf90669c9a2b6773c473fdc8))
* add Github repository references ([9fbf598](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/9fbf598c9907cf4b8e5c0ac4c8cf28f69c02855c))

# [0.3.0](https://gitlab.com/auto-cloud/cloudgraph/sdk/compare/0.2.0...0.3.0) (2021-08-23)


### Features

* **interface:** create types for new provider interface ([6db4b7f](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/6db4b7f31319224322bcccbf4ae8cc9685573d6e))
* **interface:** Create types for new provider interface, update Client abstract class, update scripts with build command ([818836e](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/818836ef472b34466963fe94138e8917b7bc8b26))

# [0.2.0](https://gitlab.com/auto-cloud/cloudgraph/sdk/compare/0.1.1...0.2.0) (2021-08-16)


### Features

* **LICENSE:** update license to MPL 2.0 ([2e534c6](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/2e534c6fbe4420de430ddf17398c471005435e81))

## [0.1.1](https://gitlab.com/auto-cloud/cloudgraph/sdk/compare/0.1.0...0.1.1) (2021-08-12)


### Bug Fixes

* **tsconfig:** Fixed ECMAScript target version ([0a40e62](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/0a40e62aee82b706dbddbda750829f106117a7c9))

# [0.1.0](https://gitlab.com/auto-cloud/cloudgraph/sdk/compare/0.0.1...0.1.0) (2021-08-11)


### Bug Fixes

* **eslint:** Installed autocloud ESLint package ([b1c8403](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/b1c8403f9802445e62c9554fcf6bdd9ae1c86055))
* **getSchema:** update getSchema signature return string ([fc5543c](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/fc5543c8034360ade7a3165764d6d4c3955c7fa2))
* **package:** update package name with namespace, use npx to run tsc ([2bf62dd](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/2bf62dd2cfd76ec4c9ce2b32eca12eea28932e37))


### Features

* **ESLint:** rules setup ([c51662b](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/c51662bc2a0deb45421a5b60287566a318a8684c))
* **logger:** update logger class to be global singleton using DEBUG env var to deteremine log level ([80aa0d3](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/80aa0d37fd327d19b6f87b249395de71044749bd))
* **ProviderBase:** add new provider base class to be extended. Simplified integration ([aec79a1](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/aec79a1eebd110daf5527bcac35ead92ad9a35e1))
