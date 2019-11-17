class Abilities {
   static renderNeutralize(abililtY) {
      if (ability.neutralize.value === true) { // Render neutralize (not toxin) over shoots, spores, and secretes of opponents
         fill(100);
         stroke(ability.neutralize.color.r, ability.neutralize.color.g, ability.neutralize.color.b);
         strokeWeight(ability.neutralize.weight);
         ellipse(ability.neutralize.x, ability.neutralize.y, ability.neutralize.radius);
      }
   }

   static renderToxin(ability) {
      if (ability.toxin.value === true) { // Toxin renders at bottom
         fill(100);
         stroke(ability.toxin.color.r, ability.toxin.color.g, ability.toxin.color.b);
         strokeWeight(ability.toxin.weight);
         ellipse(ability.toxin.x, ability.toxin.y, ability.toxin.radius);
      }
   }

   static renderSpores(ability) {
      let src = getSrc();
      if (ability.spore.value === true) {
         for (let i = 0; i < ability.spore.count; i++) {
            let cell = ability.spore.spores[i];
            for (let j = 0; j < src.orgs.length; j++) {
               if (src.orgs[j].player === ability.player) {
                  if (src.orgs[j].skin === 'circles') {
                     fill(cell.color.r, cell.color.g, cell.color.b);
                     noStroke();
                     ellipse(cell.x, cell.y, cell.width / 2, cell.height / 2);
                  } else if (src.orgs[j].skin === 'ghost') {
                     noFill();
                     stroke(cell.color.r, cell.color.g, cell.color.b);
                     strokeWeight(1);
                     rect(cell.x, cell.y, cell.width, cell.height);
                  } else {
                     fill(cell.color.r, cell.color.g, cell.color.b);
                     noStroke();
                     rect(cell.x, cell.y, cell.width, cell.height);
                  }
               }
            }
         }
      }
      for (let i = 0; i < 3; i++) {
         if (ability.shoot.value[i] === true) {
            let cell = ability.shoot.spore[i];
            for (let j = 0; j < src.orgs.length; j++) {
               if (src.orgs[j].player === ability.player) {
                  if (src.orgs[j].skin === 'circles') {
                     fill(cell.color.r, cell.color.g, cell.color.b);
                     noStroke();
                     ellipse(cell.x, cell.y, cell.width / 2 * .8, cell.height / 2 * .8); // .8 (default) size of spore (so as to differentiate between the two)
                  } else if (src.orgs[j].skin === 'ghost') {
                     noFill();
                     stroke(cell.color.r, cell.color.g, cell.color.b);
                     strokeWeight(1);
                     rect(cell.x, cell.y, cell.width * .8, cell.height * .8);
                  } else {
                     fill(cell.color.r, cell.color.g, cell.color.b);
                     noStroke();
                     rect(cell.x, cell.y, cell.width * .8, cell.height * .8);
                  }
               }
            }
         }
      }
   }

   static renderSecretions(ability) {
      let src = getSrc();
      for (let i = 0; i < src.orgs.length; i++) {
         if (ability.player === src.orgs[i].player) { // Identify org of ability
            if (ability.secrete.value === true) {
               for (let j = 0; j < ability.spore.count; j++) {
                  let spore = ability.spore.spores[j];
                  if (src.orgs[i].skin === 'ghost') {
                     noFill();
                     stroke(ability.secrete.color.r, ability.secrete.color.g, ability.secrete.color.b);
                     strokeWeight(2);
                     ellipse(spore.x, spore.y, ability.secrete.radius);
                  } else {
                     fill(ability.secrete.color.r, ability.secrete.color.g, ability.secrete.color.b);
                     noStroke();
                     ellipse(spore.x, spore.y, ability.secrete.radius);
                  }
               }
            }
            for (let j = 0; j < ability.shoot.value.length; j++) {
               if (ability.shoot.secrete[j].value === true) {
                  let spore = ability.shoot.spore[j];
                  if (src.orgs[i].skin === 'ghost') {
                     noFill();
                     stroke(ability.shoot.secrete[j].color.r, ability.shoot.secrete[j].color.g, ability.shoot.secrete[j].color.b);
                     strokeWeight(2);
                     ellipse(spore.x, spore.y, ability.shoot.secrete[j].radius);
                  } else {
                     fill(ability.shoot.secrete[j].color.r, ability.shoot.secrete[j].color.g, ability.shoot.secrete[j].color.b);
                     noStroke();
                     ellipse(spore.x, spore.y, ability.shoot.secrete[j].radius);
                  }
               }
            }
            break;
         }
      }
   }

   static cooldown(type) { // type is {Ability}._____
      if (typeof type.value === 'boolean') { // If type is not shoot, value is a boolean
         if (type.cooling === true) { // If abilitY is cooling down
            let current = new Date(); // Get current time
            if (current - type.end >= type.cooldown) { // If cooldown has passed
               type.can = true; // Re-enable abilitY
               type.cooling = false;
               if (Game.state !== 'tutorial') connection.emit('ability', ability); // Server does not store ability for tutorial
            }
         }
      } else { // If type is shoot, value is an array of booleans
         for (let i = 0; i < type.value.length; i++) {
            if (type.cooling[i] === true) { // If abilitY is cooling down
               let current = new Date(); // Get current time
               if (current - type.end[i] >= type.cooldown[i]) { // If cooldown has passed
                  type.can[i] = true; // Re-enable abilitY
                  type.cooling[i] = false;
                  if (Game.state !== 'tutorial') connection.emit('ability', ability); // Server does not store ability for tutorial
               }
            }
         }
      }
   }

   static reset(ability) {
      for (let a in ability) { // Reset Ability Cooldowns
         if (ability[a].hasOwnProperty('activated')) { // Avoid reference error by checking if ability[a] is an activatable ability
            if (ability[a].activated !== undefined && ability[a].activated === true) { // If is a usable ability
               clearTimeout(ability[a].timeout);
               ability[a].value = false;
               ability[a].can = true;
               ability[a].cooling = false;
               ability[a].start = undefined;
               ability[a].end = undefined;
            }
         }
      }
      for (let i = 0; i < 3; i++) { // Reset shoots
         clearTimeout(ability.shoot.timeout[i]);
         ability.shoot.value[i] = false;
         ability.shoot.can[i] = true;
         ability.shoot.spore[i] = undefined;
         ability.shoot.secrete[i] = {};
         ability.shoot.start[i] = undefined;
         ability.shoot.end[i] = undefined;
      }
      connection.emit('ability', ability);
   }
}
