import { Awaitable, NightwatchAPI } from "nightwatch";
import { Arena, com, p, player1Window, player2Window, Zone } from "./util";

export class Gameplay {
  private asyncBrowser: Awaitable<NightwatchAPI, undefined>;
  private currentPlayer: number;

  private constructor(player: number) {
    this.currentPlayer = 1;
    this.asyncBrowser = browser.waitForElementPresent(com.MyHand).moveToElement(com.GameChat, 0, 0).pause(p.Move);
    this.WithPlayer(player);
  }

  public static Start(player: number = 1) {
    return new Gameplay(player);
  }

  public WithPlayer(player: number) {
    if (player !== this.currentPlayer) {
      this.asyncBrowser.window
        .switchTo(player === 1 ? player1Window : player2Window)
        .refresh()
        .moveToElement(com.GameChat, 0, 0)
        .pause(p.WaitToChooseTarget);
      this.currentPlayer = player;
    }
    return this;
  }

  public async End() {
    return await this.asyncBrowser;
  }

  public Debug() {
    this.asyncBrowser.pause(p.Debug);
    return this;
  }

  public Pass() {
    this.asyncBrowser.click(com.PassButton).pause(p.ButtonPress);
    return this;
  }

  public Claim() {
    this.asyncBrowser.click(com.ClaimButton).pause(p.ButtonPress);
    return this;
  }

  public Attack(attacker: number, target: number, arena: Arena) {
    const attackerEl = arena === Arena.ground ? com.AllyGroundUnit(attacker) : com.AllySpaceUnit(attacker);
    const targetEl = arena === Arena.ground ? com.EnemyGroundUnit(target) : com.EnemySpaceUnit(target);

    this.asyncBrowser
      .click(attackerEl)
      .moveToElement(com.GameChat, 0, 0)
      .pause(p.WaitToChooseTarget)
      .click(targetEl)
      .moveToElement(com.GameChat, 0, 0)
      .pause(p.WaitForEffect);

    return this;
  }

  public AttackWithGround(attacker: number, target: number) {
    return this.Attack(attacker, target, Arena.ground);
  }

  public AttackWithSpace(attacker: number, target: number) {
    return this.Attack(attacker, target, Arena.space);
  }

  public Play(index: number, zone: Zone) {
    switch (zone) {
      case Zone.hand:
        this.asyncBrowser.click(com.HandCard(index));
        break;
      case Zone.resources:
        // TODO - implement resources
        break;
      case Zone.discard:
        // TODO - implement discard
        break;
    }

    this.asyncBrowser.moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget);
    return this;
  }

  public PlayFromHand(index: number) {
    return this.Play(index, Zone.hand);
  }

  public PlayFromResources(index: number) {
    return this.Play(index, Zone.resources);
  }

  public PlayFromDiscard(index: number) {
    return this.Play(index, Zone.discard);
  }

  public ChooseTopBottom(index: number, choice: number) {
    this.asyncBrowser
      .click(com.InHandTopBottom(index, choice))
      .moveToElement(com.GameChat, 0, 0)
      .pause(p.ButtonPress);
    return this;
  }

  public ChooseTop(index: number) {
    return this.ChooseTopBottom(index, 1);
  }

  public ChooseBottom(index: number) {
    return this.ChooseTopBottom(index, 2);
  }

  public ChooseMultiChoice(index: number) {
    this.asyncBrowser.click(com.ButtonMultiChoice(index)).moveToElement(com.GameChat, 0, 0).pause(p.ButtonPress);
    return this;
  }

  public ChooseYesNo(choice: "YES" | "NO") {
    this.asyncBrowser.click(com.YesNoButton(choice)).moveToElement(com.GameChat, 0, 0).pause(p.ButtonPress);
    return this;
  }

  public ChooseYes() {
    return this.ChooseYesNo("YES");
  }

  public ChooseNo() {
    return this.ChooseYesNo("NO");
  }

  public ActivateLeader() {
    this.asyncBrowser
      .click(com.Leader(1))
      .moveToElement(com.GameChat, 0, 0)
      .pause(p.Move)
      .click(com.ButtonMultiChoice(1))
      .moveToElement(com.GameChat, 0, 0)
      .pause(p.ButtonPress);
    return this;
  }
}
