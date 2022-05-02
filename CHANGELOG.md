# [0.19.0-beta.1](https://github.com/cloudgraphdev/sdk/compare/0.18.1...0.19.0-beta.1) (2022-05-02)


### Bug Fixes

* Fixed empty rules edge case ([4953a6c](https://github.com/cloudgraphdev/sdk/commit/4953a6ce10b9e41d5f569f80fcdbed6db88be0b8))


### Features

* Considered edge cases for aws provider extra fields ([ab75afa](https://github.com/cloudgraphdev/sdk/commit/ab75afa8bfeb0949e053bb38440cae5ce1628ded))
* Reduced mutations payload ([f931f91](https://github.com/cloudgraphdev/sdk/commit/f931f91c8df7a856f68d631bf801666a4f0a7ab6))
* Refactored RulesEngine to improve mutations performance ([af20dea](https://github.com/cloudgraphdev/sdk/commit/af20dea938b83e79c714114747ebd08b0284ba38))

# [0.19.0-alpha.1](https://github.com/cloudgraphdev/sdk/compare/0.18.1...0.19.0-alpha.1) (2022-04-25)


### Bug Fixes

* Fixed empty rules edge case ([4953a6c](https://github.com/cloudgraphdev/sdk/commit/4953a6ce10b9e41d5f569f80fcdbed6db88be0b8))


### Features

* Considered edge cases for aws provider extra fields ([ab75afa](https://github.com/cloudgraphdev/sdk/commit/ab75afa8bfeb0949e053bb38440cae5ce1628ded))
* Reduced mutations payload ([f931f91](https://github.com/cloudgraphdev/sdk/commit/f931f91c8df7a856f68d631bf801666a4f0a7ab6))
* Refactored RulesEngine to improve mutations performance ([af20dea](https://github.com/cloudgraphdev/sdk/commit/af20dea938b83e79c714114747ebd08b0284ba38))

## [0.18.1](https://gitlab.com/auto-cloud/cloudgraph/sdk/compare/0.18.0...0.18.1) (2022-03-23)


### Bug Fixes

* Fixed node-jq version to 2.1.0 ([23ae96f](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/23ae96f07277a0460e9aa9e6a4d7761a9a969081))

# [0.18.0](https://gitlab.com/auto-cloud/cloudgraph/sdk/compare/0.17.0...0.18.0) (2022-03-22)


### Features

* Included matchAll for regex operators ([6ff42ca](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/6ff42cab1e511f7948648642ca4bd350c4207dde))
* Included matchAny for regex operators ([b22971c](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/b22971c1425a24d41ce15f9f8f2cf9a0fddf7726))

# [0.17.0](https://gitlab.com/auto-cloud/cloudgraph/sdk/compare/0.16.0...0.17.0) (2022-03-18)


### Features

* Validated null cases for isEmpty operator ([d142342](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/d142342f266595bd15318e1d10f5564180d3b835))

# [0.16.0](https://gitlab.com/auto-cloud/cloudgraph/sdk/compare/0.15.0...0.16.0) (2022-03-17)


### Features

* Added DataProcessors to handle mutations depending on the StorageEngine ([e061c80](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/e061c80cd55a75816dfff9286b5757cc70d594dd))
* Composed related rules during prepare mutations method ([6ff9f9f](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/6ff9f9fb1b5912a04d9b587f9d207be2f2297ec7))
* Created CompositeEvaluator for composite rules ([b9b51a1](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/b9b51a1872eb2b23f07d04e24117de6bbcc8d2ce))
* Moved prepareMutations logic to DgraphDataProcessor ([6c7c5f5](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/6c7c5f5ee7ea15c19208e9abda9525bea6cfaa5f))
* Refactored RulesEngine to allow composite rules ([659e5b0](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/659e5b091cebe4ca2092f44e94a17bab22a82bca))
* Reused data for Automated Rules and created policyPackPlugin unit test ([cdc6226](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/cdc6226f80a81df814d5fa7b6976a935a11ed10b))

# [0.15.0](https://gitlab.com/auto-cloud/cloudgraph/sdk/compare/0.14.3...0.15.0) (2022-03-16)


### Features

* First approach to compare two fields in the same object ([632ba76](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/632ba76725b0f4ac703a35c07d89d5489a8edb24))

## [0.14.3](https://gitlab.com/auto-cloud/cloudgraph/sdk/compare/0.14.2...0.14.3) (2022-03-10)


### Bug Fixes

* Renamed array operators to common and validate empty objects as well ([064601c](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/064601c0efadfaf537bd2c14f8e8d955fd60ffb9))

## [0.14.2](https://gitlab.com/auto-cloud/cloudgraph/sdk/compare/0.14.1...0.14.2) (2022-03-01)


### Bug Fixes

* Added inverse relation to ruleMetadata ([345b44d](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/345b44da24120062ec0dcc6d8595df10c6bd1377))
* Avoided rule duplication using schema connections ([251a31f](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/251a31f40c6789b70d11785f43a0919c6e29b4b0))
* Display findings result properly ([d3d4eba](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/d3d4ebaf21fabdc518cf3bc14d2fe7f6fdd01c6f))

## [0.14.1](https://gitlab.com/auto-cloud/cloudgraph/sdk/compare/0.14.0...0.14.1) (2022-02-22)


### Bug Fixes

* Fixed exception to execute undefined arrays ([02183cc](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/02183cca465839ee1609b17c2dc7d746c03fa701))

# [0.14.0](https://gitlab.com/auto-cloud/cloudgraph/sdk/compare/0.13.1...0.14.0) (2022-02-10)


### Features

* Included extra fields to findings result ([4510423](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/451042360db61e1105a20c1fdc403482d85a7fcf))

## [0.13.1](https://gitlab.com/auto-cloud/cloudgraph/sdk/compare/0.13.0...0.13.1) (2022-02-04)


### Bug Fixes

* Included title field for Rules ([717b9fb](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/717b9fbd12a76e59e3d8483564c3c9c68c2f08a8))

# [0.13.0](https://gitlab.com/auto-cloud/cloudgraph/sdk/compare/0.12.0...0.13.0) (2022-02-03)


### Features

* Adjustments for the policyPack plugin ([c8df8d8](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/c8df8d8c87affb36fe447f103ec494f85c84a7bc))
* Removed cgPlugins key file ([6f94b6f](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/6f94b6f94f9165b3bae6914ad969666944af3f54))
* Reorder plugins files ([8845cfd](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/8845cfd7b0aff220a9ff45e9418f4f2d2422bce8))

# [0.12.0](https://gitlab.com/auto-cloud/cloudgraph/sdk/compare/0.11.0...0.12.0) (2022-02-01)


### Features

* Created Manual Evaluator ([612809d](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/612809d9ce4e95e527efae69badc75bd58fa9d9d))
* Deprecated default evaluator ([f199f28](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/f199f28337f2b0c514ddff17149ba11779c64c7d))
* Updated rule evaluator definition ([1409105](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/1409105f2e1a9b8ccb3df60e1154a4e8f53ecbfb))

# [0.11.0](https://gitlab.com/auto-cloud/cloudgraph/sdk/compare/0.10.9...0.11.0) (2022-01-28)


### Features

* add daysDiff operator ([cacba7a](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/cacba7a19c023fb2a70fc989343d7adf1180a7a4))
* add daysDiff operator ([e18b6ea](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/e18b6eab834f6efcadcc8ec80f44cd1aea6baea7))

## [0.10.9](https://gitlab.com/auto-cloud/cloudgraph/sdk/compare/0.10.8...0.10.9) (2022-01-28)


### Bug Fixes

* **rule-engine:** update rule interface to allow for more fields ([89e9959](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/89e99599a82ecd57e959fc348a9d60b71f07115f))
* **rule-engine:** update rule processor to use new fields in schema ([ebcd67e](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/ebcd67e246e3e0a7e76ed013956d5a4607a47b1b))

## [0.10.8](https://gitlab.com/auto-cloud/cloudgraph/sdk/compare/0.10.7...0.10.8) (2022-01-28)


### Bug Fixes

* Moved common utils to SDK ([ab96993](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/ab96993bafcc45db430d6bb7ace91a40dbdedd94))

## [0.10.7](https://gitlab.com/auto-cloud/cloudgraph/sdk/compare/0.10.6...0.10.7) (2022-01-25)


### Bug Fixes

* **getData:** update get data to take account param so we can include it in raw data ([7da8949](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/7da8949221ebed1ab97b1115999f54ffd80c4bd7))

## [0.10.6](https://gitlab.com/auto-cloud/cloudgraph/sdk/compare/0.10.5...0.10.6) (2022-01-18)


### Bug Fixes

* type cleanup, removed old prop ([d81eb1e](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/d81eb1e8212af9e0e4d62c6912e02d07af9ef011))

## [0.10.5](https://gitlab.com/auto-cloud/cloudgraph/sdk/compare/0.10.4...0.10.5) (2022-01-18)


### Bug Fixes

* **types:** refactor graphql types to allow patch operation, new type for input ([cbe266c](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/cbe266cc91aa299c5f698141f5d539d77a409eb7))

## [0.10.4](https://gitlab.com/auto-cloud/cloudgraph/sdk/compare/0.10.3...0.10.4) (2022-01-18)


### Bug Fixes

* Updated getSchemaFromFolder definition ([a5dbe1a](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/a5dbe1afeb4f73c3441ed184b0797fdb7e7eaadd))

## [0.10.3](https://gitlab.com/auto-cloud/cloudgraph/sdk/compare/0.10.2...0.10.3) (2022-01-12)


### Bug Fixes

* Implemented temporary solution to display findings results ([c9a7d18](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/c9a7d18160d2749003b96168accefce0c9937c88))
* Renamed Severity levels ([ad1fd6c](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/ad1fd6cfd51528d2e1f9637e0ecb1c029b66a0f4))

## [0.10.2](https://gitlab.com/auto-cloud/cloudgraph/sdk/compare/0.10.1...0.10.2) (2022-01-11)


### Bug Fixes

* Only shows execution message when plugins available ([ce868a6](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/ce868a640eb6a5a1c12bbe0a976be1d1f4513d0b))

## [0.10.1](https://gitlab.com/auto-cloud/cloudgraph/sdk/compare/0.10.0...0.10.1) (2022-01-10)


### Bug Fixes

* Removed policy pack plugin message during configuration ([eeede94](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/eeede9447d1bd23667852b656b68ccc73cad8b16))

# [0.10.0](https://gitlab.com/auto-cloud/cloudgraph/sdk/compare/0.9.0...0.10.0) (2022-01-07)


### Features

* adding jq and not operators to policy packs json evaluator ([1912c61](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/1912c61d3a1d73e44fa24f53430d635fc07d9427))

# [0.9.0](https://gitlab.com/auto-cloud/cloudgraph/sdk/compare/0.8.0...0.9.0) (2022-01-05)


### Features

* Included new regex operator for rules engine ([beb4bce](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/beb4bce4f0a81e08841562c30f5195d0e9e7ae76))

# [0.8.0](https://gitlab.com/auto-cloud/cloudgraph/sdk/compare/0.7.1...0.8.0) (2022-01-05)


### Bug Fixes

* Updated default value for missing entity field ([1689810](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/168981088abff2fc25e7b8435ac279fa486259a0))


### Features

* Created overall schema for findings ([f46e567](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/f46e567459fd71efa62541bc962b2b40c8c9be3e))
* Grouped findings by entity ([19de4b7](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/19de4b7c99d06931764a55708722596ed162b9f2))

## [0.7.1](https://gitlab.com/auto-cloud/cloudgraph/sdk/compare/0.7.0...0.7.1) (2021-12-29)


### Bug Fixes

* Included description field to findings schema ([596b45a](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/596b45a979f442fa57b58591adfa851993ab6fc2))

# [0.7.0](https://gitlab.com/auto-cloud/cloudgraph/sdk/compare/0.6.1...0.7.0) (2021-12-28)


### Bug Fixes

* Pass CLI flags during initialization ([f0046e7](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/f0046e7e1543b3008303fb658865daebdf829581))
* updated plugin types ([fefeeaa](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/fefeeaaa235c7156d6c5cbcd70600eb61712ff3a))


### Features

* Included new types from CLI ([fd50907](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/fd509072dd13cd18ad510dcc0f4ae6d83fa365be))
* Included plugin base class ([c7f2dc3](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/c7f2dc37d724155e838d7e4fe89c20ed7ad92e2c))
* Included StorageEngine interface to sdk ([52cb776](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/52cb77618fd6f06eb9b77152b126b97c5e2d388c))
* Included types for PluginManager ([7d8363f](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/7d8363f457fe37ced7bc4652d8adc37aa0f2aaac))
* Moved schema utils to sdk ([a04a424](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/a04a424fee99e41220995a29fcc6756f66524bff))

## [0.6.1](https://gitlab.com/auto-cloud/cloudgraph/sdk/compare/0.6.0...0.6.1) (2021-11-23)


### Bug Fixes

* Enabled update mutations at rules engine ([16fbfea](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/16fbfeabc5e60aaa5955146997c9a3f46aaba7b0))
* Fixed unit tests ([8d8f221](https://gitlab.com/auto-cloud/cloudgraph/sdk/commit/8d8f221f23b962a530d937708ee7b00908d34e32))

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
