import {promises as fsp} from 'fs';
import { browser, NightwatchAPI } from 'nightwatch';

export var player1Window = '';
export var player2Window = '';

export function setPlayer1Window(window: string) {
  player1Window = window;
}
export function setPlayer2Window(window: string) {
  player2Window = window;
}
//File Paths assumed from root directory
async function LastGameNumberAsync() {
  return Number.parseInt(await fsp.readFile('../SWUOnline/HostFiles/GameIDCounter.txt', 'ascii')) - 1;
}

export async function LoadTestGameStateAsync(filename: string) {
  if(player1Window === '' || player2Window === '') {
    throw new Error('player1Window and player2Window must be set before calling LoadTestGameStateAsync');
  }

  const lastGameNumber = await LastGameNumberAsync();
  const testState = await fsp.readFile(`./test/cases/${filename}`, 'ascii');
  const originalState = await fsp.readFile(`../SWUOnline/Games/${lastGameNumber}/gamestate.txt`, 'ascii');
  const originalStateModified = originalState.split('\r\n').slice(57);
  originalStateModified[3] = '200';
  originalStateModified[13] = '';
  originalStateModified[14] = '';
  originalStateModified[15] = '2';
  originalStateModified[16] = '0';
  const newGameState = testState.split('\n').join('\r\n') + originalStateModified.join('\r\n');
  await fsp.writeFile(`../SWUOnline/Games/${lastGameNumber}/gamestate.txt`, newGameState, 'ascii');
  await browser.window.switchTo(player2Window).refresh();
  await browser.pause(p.WaitForEffect);
  await browser.window.switchTo(player1Window).refresh();
  await browser.pause(p.WaitToBegin);
}

export const com = {
    GameLog: 'div#gamelog',
    GameChat: 'input#chatText',
    DeckInput: 'input#fabdb',
    CreateGameButton: 'input.create-game-button',
    InviteLink: 'input.invite-link',
    JoinGameButton: 'input.JoinGame_Button',
    ReadyButton: 'input.GameLobby_Button[value="Ready"]',
    GoFirstButton: 'input.GameLobby_Button[value="Go First"]',
    StartButton: 'input.GameLobby_Button[value="Start"]',
    LobbySetupContent: 'div#setup-content p',
    MyHand: 'div#myHand',
    MyHandDivs: 'div#myHand div',
    TheirHand: "div#theirHand",
    TheirHandDivs: "div#theirHand div",
    MyDiscardCount: 'div.my-discard a div:nth-last-of-type(1)',
    MyDiscardEmpty: 'div.my-discard.my-discard-empty',
    TheirDiscardCount: 'div.their-discard a div:nth-last-of-type(1)',
    TheirDiscardEmpty: 'div.their-discard div.their-discard-empty',
    HandCard(index: number) { return `div#myHand span:nth-of-type(${index}) a`; },
    HandCardImg(index: number) { return `div#myHand span:nth-of-type(${index}) img`; },
    Checkbox(index: number) { return `td:nth-of-type(${index}) > label`; },
    PassButton: 'span.pass-label',
    ClaimButton: 'button.claimButton',
    SubmitButton: 'input[type="button"]',
    YesNoButton(choice: "YES"|"NO") { return `div#mainDiv button:nth-of-type(${choice === "YES" ? 1 : 2})`; },
    TopBottomButton(index: number, choice: number) { return `div > table > tbody > tr > td:nth-of-type(${index}) button:nth-of-type(${choice})`; },
    ButtonInputChoice(index: number) { return `div#BUTTONINPUT div button:nth-of-type(${index})`; },
    MultizoneImage(index: number) { return `div#CHOOSEMULTIZONE div div a:nth-of-type(${index}) img`; },
    Base(player: number) { return `span#P${player}BASE a`; },
    Leader(player: number) { return `span#P${player}LEADER a`; },
    AllyGroundUnit(index: number, exhausted: boolean = false) { return `div.groundAlliesContainer div:nth-of-type(${index})${exhausted ? '.exhausted' : ''} a`; },
    AllySpaceUnit(index: number, exhausted: boolean = false) { return `div.spaceAlliesContainer div:nth-of-type(${index})${exhausted ? '.exhausted' : ''} a`; },
    EnemyGroundUnit(index: number, exhausted: boolean = false) { return `div.groundEnemiesContainer div:nth-of-type(${index})${exhausted ? '.exhausted' : ''} a`; },
    EnemySpaceUnit(index: number, exhausted: boolean = false) { return `div.spaceEnemiesContainer div:nth-of-type(${index})${exhausted ? '.exhausted' : ''} a`; },
    UniqueIdSelector(uniqueId: number) { return `div#unique-${uniqueId} a`; },
    UniqueIdExhausted(uniqueId: number) { return `div#unique-${uniqueId}.exhausted`; },
    //these count backwards where the last is subcards if any,
    //then Attack, then Defense, then damage if any,
    //then tokens like Sentinel, Shield, Clone if any
    UnitDivPiece(uniqueIdSelector: string, index: number) { return `${uniqueIdSelector} div:nth-last-of-type(${index})`; },
    MyResources: 'div.my-resources div.resources span',
    TheirResources: 'div.their-resources div.resources span',
    MyBaseDamage: 'span.base-my-dmg',
    TheirBaseDamage: 'span.base-their-dmg',
    ClaimVictoryButton: 'button[title=claimVictoryButton]',
  }

export const p = {
  Move: 500,
  CheckBox: 250,
  ButtonPress: 1_000,
  WaitForEffect: 1_200,
  WaitToBegin: 3_000,
  WaitToChooseTarget: 1_500,
  Debug: 300_000,
}

export const src = {
  SentinelToken: 'url("./Images/SentinelToken.png") 0% 0% / contain no-repeat',
  ShieldToken: 'url("./Images/ShieldToken.png") 0% 0% / contain no-repeat',
  CloneToken: 'url("./Images/CloneToken.png") 0% 0% / contain no-repeat',
  DamageGradient: 'linear-gradient(90deg, rgba(255, 0, 0, 0) 0%, rgba(255, 0, 0, 0.9) 50%, rgb(255, 0, 0) 100%), linear-gradient(270deg, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.9) 45%, rgba(0, 0, 0, 0) 100%)',
}
