import { LolAssets } from './lolAssets.jsx';

// In-memory cache for champion full ability data
const abilitiesCache = new Map();

/**
 * Format leveling modifier items into exact Wiki strings
 * e.g. 50 / 90 / 130 / 170 / 210 (+ 125 / 145 / 165 / 185 / 205% AD)
 */
export function formatLevelingItem(item) {
  if (!item || !Array.isArray(item.modifiers) || item.modifiers.length === 0) return '';
  
  const parts = [];
  item.modifiers.forEach((mod, idx) => {
    if (!mod || !Array.isArray(mod.values) || mod.values.length === 0) return;
    
    // Check if all values in the array are identical
    const allSame = mod.values.every(v => v === mod.values[0]);
    // For base numbers, keep rank progression if there are multiple ranks; for ratios (+ 30% bonus AD), collapse if identical
    const valStr = (allSame && idx > 0) ? String(mod.values[0]) : mod.values.join(' / ');
    const unit = mod.units?.[0] || '';
    
    if (idx === 0) {
      parts.push(valStr + unit);
    } else {
      parts.push(`(+ ${valStr}${unit})`);
    }
  });

  return parts.join(' ');
}

/**
 * Format stat values (cost, cooldown, rechargeRate, range, etc.)
 */
export function formatStatValue(statObj, defaultUnit = '') {
  if (!statObj && statObj !== 0) return null;
  if (typeof statObj === 'string' || typeof statObj === 'number') {
    return String(statObj);
  }
  if (Array.isArray(statObj)) {
    return statObj.join(' / ');
  }
  if (statObj.modifiers && Array.isArray(statObj.modifiers) && statObj.modifiers[0]) {
    const mod = statObj.modifiers[0];
    if (Array.isArray(mod.values)) {
      const allSame = mod.values.every(v => v === mod.values[0]);
      const val = allSame ? mod.values[0] : mod.values.join(' / ');
      const unit = mod.units?.[0] || defaultUnit;
      return `${val}${unit ? ' ' + unit.trim() : ''}`;
    }
  }
  return null;
}

/**
 * Fetch and build official detailed Wiki abilities for any LoL champion
 * Source: Meraki Analytics CDN (extracted directly from League game files + LoL Wiki)
 * Fallback: Riot Data Dragon CDN
 */
export async function getChampionAbilitiesData(championId, fallbackDetail = null) {
  if (!championId) return null;

  const cacheKey = String(championId).toLowerCase();
  if (abilitiesCache.has(cacheKey)) {
    return abilitiesCache.get(cacheKey);
  }

  // Check sessionStorage
  try {
    const stored = sessionStorage.getItem(`lol_abilities_${cacheKey}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      abilitiesCache.set(cacheKey, parsed);
      return parsed;
    }
  } catch (_) {}

  // Name normalization for Meraki API (matches champion.id)
  let merakiName = championId;
  if (merakiName === 'FiddleSticks') merakiName = 'Fiddlesticks';
  if (merakiName === 'Wukong') merakiName = 'MonkeyKing';

  let rawData = null;

  // 1. Try Meraki Analytics CDN
  try {
    const res = await fetch(`https://cdn.merakianalytics.com/riot/lol/resources/latest/en-US/champions/${merakiName}.json`);
    if (res.ok) {
      rawData = await res.json();
    }
  } catch (err) {
    console.warn(`Meraki abilities fetch failed for ${merakiName}:`, err);
  }

  // 2. Parse and normalize abilities
  const keys = ['P', 'Q', 'W', 'E', 'R'];
  const abilities = {};

  keys.forEach((key, keyIdx) => {
    const spellList = rawData?.abilities?.[key];
    const ddSpell = key === 'P' ? fallbackDetail?.passive : fallbackDetail?.spells?.[keyIdx - 1];

    if (Array.isArray(spellList) && spellList.length > 0) {
      // Champion has official Meraki Wiki data
      abilities[key] = spellList.map((ability, subIdx) => {
        // Collect all leveling tactical boxes
        const levelingBoxes = [];
        if (Array.isArray(ability.effects)) {
          ability.effects.forEach(eff => {
            if (Array.isArray(eff.leveling)) {
              eff.leveling.forEach(lev => {
                if (lev && lev.attribute) {
                  const formatted = formatLevelingItem(lev);
                  if (formatted) {
                    const attrLower = lev.attribute.toLowerCase();
                    let color = '#38bdf8'; // Default cyan
                    if (attrLower.includes('physical')) color = '#fb923c'; // Orange
                    else if (attrLower.includes('magic')) color = '#38bdf8'; // Cyan
                    else if (attrLower.includes('true')) color = '#f8fafc'; // White
                    else if (attrLower.includes('heal') || attrLower.includes('shield')) color = '#34d399'; // Green
                    else if (attrLower.includes('headshot') || attrLower.includes('damage')) color = '#fb923c';
                    else if (attrLower.includes('trap') || attrLower.includes('duration') || attrLower.includes('number')) color = '#818cf8';

                    levelingBoxes.push({
                      attribute: lev.attribute,
                      formatted,
                      color
                    });
                  }
                }
              });
            }
          });
        }

        // Cost and resource
        const resourceType = ability.resource || (fallbackDetail?.partype || 'MANA').toUpperCase();
        let costStr = formatStatValue(ability.cost, resourceType);
        if (!costStr && ddSpell?.costBurn && ddSpell.costBurn !== '0') {
          costStr = `${ddSpell.costBurn} ${resourceType}`;
        }

        // Cooldown
        let cooldownStr = formatStatValue(ability.cooldown);
        if (!cooldownStr && ddSpell?.cooldownBurn) {
          cooldownStr = ddSpell.cooldownBurn;
        }

        // Range
        let rangeStr = formatStatValue(ability.range || ability.targetRange);
        if (!rangeStr && ddSpell?.rangeBurn && ddSpell.rangeBurn !== 'self') {
          rangeStr = ddSpell.rangeBurn;
        }

        // Icon
        const iconUrl = ability.icon || 
          (key === 'P' 
            ? `https://ddragon.leagueoflegends.com/cdn/${LolAssets.getVersion()}/img/passive/${fallbackDetail?.passive?.image?.full}`
            : `https://ddragon.leagueoflegends.com/cdn/${LolAssets.getVersion()}/img/spell/${ddSpell?.image?.full}`);

        return {
          key,
          subIdx,
          name: ability.name || ddSpell?.name || `${key} Yeteneği`,
          trName: ddSpell?.name || ability.name,
          icon: iconUrl,
          speed: formatStatValue(ability.speed || ability.missileSpeed),
          width: formatStatValue(ability.width),
          range: rangeStr,
          castTime: formatStatValue(ability.castTime),
          collisionRadius: formatStatValue(ability.collisionRadius),
          rechargeRate: formatStatValue(ability.rechargeRate),
          cost: costStr,
          cooldown: cooldownStr,
          targeting: ability.targeting || (key === 'P' ? 'Passive' : 'Direction'),
          resource: resourceType,
          damageType: ability.damageType || null,
          effects: ability.effects || [{ description: ddSpell?.description || '' }],
          levelingBoxes,
          notes: ability.notes || null,
          blurb: ability.blurb || null
        };
      });
    } else {
      // Fallback directly to Data Dragon if Meraki failed
      const iconUrl = key === 'P'
        ? `https://ddragon.leagueoflegends.com/cdn/${LolAssets.getVersion()}/img/passive/${fallbackDetail?.passive?.image?.full}`
        : `https://ddragon.leagueoflegends.com/cdn/${LolAssets.getVersion()}/img/spell/${ddSpell?.image?.full}`;

      abilities[key] = [{
        key,
        subIdx: 0,
        name: ddSpell?.name || `${key} Yeteneği`,
        trName: ddSpell?.name || `${key} Yeteneği`,
        icon: iconUrl,
        speed: null,
        width: null,
        range: ddSpell?.rangeBurn || null,
        castTime: null,
        collisionRadius: null,
        rechargeRate: null,
        cost: ddSpell?.costBurn && ddSpell.costBurn !== '0' ? `${ddSpell.costBurn} ${fallbackDetail?.partype || 'MANA'}` : null,
        cooldown: ddSpell?.cooldownBurn || null,
        targeting: key === 'P' ? 'Passive' : 'Active',
        resource: fallbackDetail?.partype || 'MANA',
        damageType: null,
        effects: [{ description: ddSpell?.description || '' }],
        levelingBoxes: [],
        notes: null,
        blurb: null
      }];
    }
  });

  const result = {
    championId,
    abilities,
    hasMerakiData: !!rawData
  };

  abilitiesCache.set(cacheKey, result);
  try {
    sessionStorage.setItem(`lol_abilities_${cacheKey}`, JSON.stringify(result));
  } catch (_) {}

  return result;
}
