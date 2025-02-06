import {NightwatchTests} from 'nightwatch';

import { player1Window, player2Window } from './utils/util';
import { init } from './utils/gamestart';

import { DiscardCases } from './cases/discard';
import { WhenPlayedCases } from './cases/when-played';
import { WhenDefeatCases } from './cases/when-defeat';
import { AmbushCases } from './cases/ambush';
import { WhenTheyPlayCases } from './cases/when-they-play';
import { OnAttackCases } from './cases/on-attack';
import { BounceCases } from './cases/bounce';
import { DamageCases } from './cases/damage';
import { RemovalCases } from './cases/removal';
import { ReadyCases } from './cases/ready';
import { BoardWipeCases } from './cases/boardwipe';
import { ControlCases } from './cases/control';
import { DefeatUpgradeCases } from './cases/defeat-upgrade';
import { LeaderAbilitySORCases } from './cases/leader-ability-sor';
import { LeaderUnitSORCases } from './cases/leader-unit-sor';
import { LeaderUnitSHDCases } from './cases/leader-unit-shd';
import { LeaderUnitTWICases } from './cases/leader-unit-twi';
import { SpecificSORCases } from './cases/specific/sor';
import { BountyCases } from './cases/bounty';
import { SmuggleCases } from './cases/smuggle';
import { SpecificSHDCases } from './cases/specific/shd';
import { ExploitCases } from './cases/exploit';
import { CloneCases } from './cases/clone';
import { SpecificTWICases } from './cases/specific/twi';
import { PilotJTLCases } from './cases/pilots';

import { LocalTestCase } from './cases/local';
import { LeaderAbilityTWICases } from './cases/leader-ability-twi';

const home: NightwatchTests = {
  before: init,
//regression suite
  ...(process.env.LOCAL_RUN ? LocalTestCase : {}),
  ...DiscardCases,
  ...WhenPlayedCases,
  ...WhenDefeatCases,
  ...AmbushCases,
  ...WhenTheyPlayCases,
  ...OnAttackCases,
  ...BounceCases,
  ...DamageCases,
  ...RemovalCases,
  ...ReadyCases,
  ...BoardWipeCases,
  ...ControlCases,
  ...DefeatUpgradeCases,
  ...BountyCases,
  ...SmuggleCases,
  ...ExploitCases,
  ...CloneCases,
  ...LeaderAbilitySORCases,
  ...LeaderUnitSORCases,
  ...SpecificSORCases,
  ...LeaderUnitSHDCases,
  ...SpecificSHDCases,
  ...LeaderAbilityTWICases,
  ...LeaderUnitTWICases,
  ...SpecificTWICases,
  ...PilotJTLCases,
//end regression suite
  after: async (browser, done) => {
    await browser.window.switchTo(player2Window).window.close();
    await browser.window.switchTo(player1Window).window.close();

    done();
  }
};

export default home;