import { controls } from '../../constants/controls';

const keys = {
  d:{
    pressed:false
  },
  l:{
    pressed:false
  },
  a:{
    pressed:false
  },
  j:{
    pressed:false
  }
}


export async function fight(firstFighter, secondFighter) {
  return new Promise((resolve) => {
    // resolve the promise with the winner when fight is over
    firstFighter.isCriticalActive = false;
    secondFighter.isCriticalActive = false;
    firstFighter.combo = [];
    secondFighter.combo = [];
    firstFighter.critCombination = controls.PlayerOneCriticalHitCombination
    secondFighter.critCombination =  controls.PlayerTwoCriticalHitCombination
    let firstFighterHealth = firstFighter.health;
    let secondFighterHealth = secondFighter.health;
    window.addEventListener('keydown',function keydown(e){
      switch(e.code) {
        case controls.PlayerOneAttack:
          if ((!keys.l.pressed && !keys.d.pressed)) {
            secondFighterHealth = attack(firstFighter, secondFighter, secondFighterHealth, 1);
            if (secondFighterHealth <= 0) {
              window.removeEventListener('keydown', keydown);
              resolve(firstFighter);
            }
          }
          break;
        case controls.PlayerTwoAttack:
          if ((!keys.d.pressed && !keys.l.pressed)) {
            firstFighterHealth = attack(secondFighter, firstFighter, firstFighterHealth, 0);
            if (firstFighterHealth <= 0) {
              window.removeEventListener('keydown', keydown);
              resolve(secondFighter);
            }
          }
          break;
        case controls.PlayerOneBlock:
          keys.d.pressed = true;
          break;
        case controls.PlayerTwoBlock:
          keys.l.pressed = true;
          break;
      }
      if(firstFighter.critCombination.includes(e.code)&&!keys.d.pressed){
        secondFighterHealth = critActivation(firstFighter,secondFighter,secondFighterHealth,1, e.code);
        if (secondFighterHealth <= 0) {
          window.removeEventListener('keydown',keydown);
          resolve(firstFighter);
        }
      }
      if(secondFighter.critCombination.includes(e.code)&&!keys.l.pressed)
        firstFighterHealth = critActivation(secondFighter,firstFighter,firstFighterHealth,0, e.code);
      if (firstFighterHealth <= 0 ) {
        window.removeEventListener('keydown',keydown);
        resolve(secondFighter);
      }
    })
    window.addEventListener('keyup',function keyup(e){
      switch(e.code) {
        case controls.PlayerOneBlock:
          keys.d.pressed = false;
          break;
        case controls.PlayerTwoBlock:
          keys.l.pressed = false;
          break;
      }
          if (firstFighter.critCombination.includes(e.code)) {
            critActivationStop(firstFighter, e.code);
          }
          if(secondFighter.critCombination.includes(e.code)) {
            critActivationStop(secondFighter, e.code);
          }
      if (firstFighterHealth <= 0 || secondFighterHealth <=0 ) {
        window.removeEventListener('keyup',keyup);
      }
    })
  });
}


function critActivation(attacker, defender,fighterHealth,fighter,pressedKey) {
    attacker.combo.push(pressedKey);
    if (attacker.critCombination.every((item) => attacker.combo.includes(item))) {
      if (!attacker.isCriticalActive) {
        fighterHealth = critAttack(attacker, defender,fighterHealth,fighter);

      }
    }
    return fighterHealth;
}
function critAttack(attacker, defender,fighterHealth,fighter) {
  attacker.isCriticalActive = true;
  const damage = attacker.attack * 2;
  fighterHealth -= damage;
  const healthBar = document.getElementsByClassName("arena___health-bar")[fighter];
  healthBar.style.width = fighterHealth > 1 ? ((fighterHealth * 100) / defender.health) + "%" : "0.01%";
  setTimeout(() => {
    attacker.isCriticalActive = false;
  }, 10000);
  return fighterHealth;
}

function critActivationStop(attacker, pressedKey) {
    attacker.combo = attacker.combo.filter((item) => item !== pressedKey);
    return attacker.combo;
}

function attack(attacker,defender,fighterHealth,fighter){
  const damageToPlayer = getDamage(attacker, defender);
  const healthBar = document.getElementsByClassName("arena___health-bar")[fighter];
  fighterHealth -= damageToPlayer;
  healthBar.style.width = fighterHealth > 1 ? ((fighterHealth * 100) / defender.health) + "%" : "0.01%";
  return fighterHealth;
}

export function getDamage(attacker, defender) {
  const damage = getHitPower(attacker) - getBlockPower(defender);
  if (damage <= 0) {
    return 0;
  }
  return damage;
}

export function getHitPower(fighter) {
  const criticalHitDamage = getRandomNumber(1,2);
  const power = fighter.attack * criticalHitDamage;
  return power;
}

export function getBlockPower(fighter) {
  const dodgeChance = getRandomNumber(1, 2);
  const power = fighter.defense * dodgeChance;
  return power;
}
export function getRandomNumber(min,max) {
  return Math.random() * (max-min) + min;
}