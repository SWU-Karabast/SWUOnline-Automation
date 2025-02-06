import { cards } from '../utils/cards';
import { GameState } from '../utils/gamestate';
import {
  com, p,
  player1Window, player2Window,
  gameName,
  src
} from '../utils/util';

export const DiscardCases = {
  'Cards go in Discard': async function() {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage('9 16')
      .AddBase(1, cards.SHD.JabbasPalace)
      .AddLeader(1, cards.TWI.YodaLeader)
      .AddBase(2, cards.SOR.EchoBase)
      .AddLeader(2, cards.JTL.HanSoloLeader)
      .FillResources(1, cards.SOR.CraftySmuggler, 3)
      .FillResources(2, cards.SOR.CraftySmuggler, 2)
      .AddCardToHand(2, cards.SOR.CraftySmuggler)
      .AddCardToHand(1, cards.TWI.PerilousPosition)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser.waitForElementPresent(com.PassButton)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.PassButton).pause(p.ButtonPress)
    ;

    await browser.window.switchTo(player2Window)
      .waitForElementPresent(com.MyHand)
      .moveToElement(com.MyHand, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.elementPresent(com.AllyGroundUnit(1));
    await browser.assert.attributeContains(com.UnitDivPiece(com.AllyGroundUnit(1), 3), 'style', src.ShieldToken);
    //act
    await browser.window.switchTo(player1Window)
      .waitForElementPresent(com.MyHand)
      .moveToElement(com.MyHand, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.not.elementPresent(com.EnemyGroundUnit(1));
    await browser.assert.textEquals(com.MyDiscardCount, '1');
    await browser.assert.textEquals(com.TheirDiscardCount, '1');
    //act
    await browser.waitForElementPresent(com.MyDiscard)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.MyDiscard).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.attributeEquals(com.MyDiscardCard(1), 'src', src.Concat(cards.TWI.PerilousPosition));
    //act
    await browser.window.switchTo(player2Window)
      .waitForElementPresent(com.MyDiscard)
      .moveToElement(com.MyDiscard, 0, 0).pause(p.Move)
      .click(com.MyDiscard).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.attributeEquals(com.MyDiscardCard(1), 'src', src.Concat(cards.SOR.CraftySmuggler));
  }
}