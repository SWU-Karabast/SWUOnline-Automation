# SWUOnline Automation
This test suite assumes the SWUOnline repo is sibling to this one, otherwise the SWUOnline root path can be configured with a `.env` file by setting the `SWUONLINE_ROOT_PATH` variable

## Usage
To run the tests, open a terminal at the root and run `npm test`. This will begin the NightwatchJS test tool

## Testing certain suites
Lines of the `regression.ts` file can be commented out to only run specific test suites

For Example,
```javascript
import {NightwatchTests} from 'nightwatch';

import { player1Window, player2Window } from './utils/util';
/*other imports*/
import { init } from './utils/gamestart';

const home: NightwatchTests = {
  before: init,
//regression suite
  // ...WhenPlayedCases,
  // ...WhenDefeatCases,
  // ...OnAttackCases,
  // ...AmbushCases,
  // ...BounceCases,
  // ...DamageCases,
  // ...LeaderAbilitySORCases,
  ...LeaderUnitSORCases,
  // ...LeaderUnitSHDCases,
  // ...LeaderUnitTWICases,
  // ...SpecificSORCases,
  // ...BountyCases,
  // ...SpecificSHDCases,
  // ...ExploitCases,
  // ...SpecificTWICases,
//end regression suite
  after: async (browser, done) => {
    await browser.window.switchTo(player2Window).window.close();
    await browser.window.switchTo(player1Window).window.close();

    done();
  }
};

export default home;
```

### Testing single cases
use `-- --testcase` to pass in a test case.

For example:
```
npm test -- --testcase 'Ambush: Sabine ECL Ping Shield'
```

## Running Full Regression vs Quick Regression
by default, the suite runs a quick regression, but full regression can be enabled in the `.env` with the variable `FULL_REGRESSION=true`

## Bypassing Game Creation
by default, the suite tests game creation and join game flows. to bypass this locally, pass in an existing game name to the `.env` for `LOCAL_RUN=<N>` where \<N> is a game name from your Games\ dir

---

`.env` reference/example:
```bash
SWUONLINE_ROOT_PATH=/Home/GitHub/Karabast-SWU/SWUOnline
FULL_REGRESSION=false
LOCAL_RUN=24
```