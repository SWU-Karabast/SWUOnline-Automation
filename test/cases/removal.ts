import { cards } from '../utils/cards';
import { GameState } from '../utils/gamestate';
import {
  com, src, p,
  player1Window, player2Window,
  gameName
} from '../utils/util';

export const RemovalCases = {
  'Removal: Vanquish cant target piloted leader unit': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.DagobahSwamp)
      .AddLeader(1, cards.JTL.HanSoloLeader, true)
      .AddBase(2, cards.SOR.DagobahSwamp)
      .AddLeader(2, cards.JTL.HanSoloLeader, true)
      .FillResources(1, cards.SOR.Waylay, 5)
      .AddCardToHand(1, cards.SOR.Vanquish)
      .AddUnit(1, cards.SOR.Snowspeeder)
      .AddUnit(1, cards.SOR.Snowspeeder, false, 0,
        gameState.SubcardBuilder().AddUpgrade(cards.JTL.HanSoloLeaderUnit, 1, true).Build())
      .AddUnit(2, cards.SOR.Snowspeeder)
      .AddUnit(2, cards.SOR.Snowspeeder, false, 0,
        gameState.SubcardBuilder().AddUpgrade(cards.JTL.HanSoloLeaderUnit, 2, true).Build())
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser.waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
    ;
    //assert
    await browser.assert.attributeEquals(com.UnitImg(com.EnemyGroundUnit(2)), 'style', src.NotPlayableBorderUnit);
    await browser.assert.attributeEquals(com.UnitImg(com.AllyGroundUnit(2)), 'style', src.NotPlayableBorderUnit);
  },
  'Removal: Merciless Contest cant target piloted leader unit': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.ChopperBase)
      .AddLeader(1, cards.JTL.AsajjLeaderUnit, true)
      .AddBase(2, cards.SOR.DagobahSwamp)
      .AddLeader(2, cards.JTL.HanSoloLeader, true)
      .FillResources(1, cards.SOR.Waylay, 3)
      .AddCardToHand(1, cards.TWI.MercilessContest)
      .AddUnit(1, cards.SOR.TieLnFighter)
      .AddUnit(1, cards.SOR.TieLnFighter, false, 0,
        gameState.SubcardBuilder().AddUpgrade(cards.JTL.AsajjLeaderUnit, 1, true).Build())
      .AddUnit(1, cards.SOR.TieLnFighter)
      .AddUnit(2, cards.SOR.Snowspeeder)
      .AddUnit(2, cards.SOR.Snowspeeder, false, 0,
        gameState.SubcardBuilder().AddUpgrade(cards.JTL.HanSoloLeaderUnit, 2, true).Build())
      .AddUnit(2, cards.SOR.Snowspeeder)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser.waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
    ;
    //assert
    await browser.assert.attributeEquals(com.UnitImg(com.AllySpaceUnit(2)), 'style', src.NotPlayableBorderUnit);
    //act
    await browser.waitForElementPresent(com.AllySpaceUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.AllySpaceUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;

    await browser.window.switchTo(player2Window).refresh()
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.attributeEquals(com.UnitImg(com.AllyGroundUnit(2)), 'style', src.NotPlayableBorderUnit);
  },
}