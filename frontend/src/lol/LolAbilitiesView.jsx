import React, { useState } from 'react';

/**
 * Formats a raw ability description with syntax-colored keywords
 * Identical to League Wiki style (physical damage, AD, AP, true damage, status effects)
 */
function FormattedDescription({ text }) {
  if (!text) return null;

  // Split text by recognized token boundaries and highlight
  // Regex looks for:
  // 1. INNATE:, ACTIVE:, PASSIVE:, HEADSHOT: etc.
  // 2. Damage types: physical damage, magic damage, true damage
  // 3. Stat scalings: (+ ... % AD), (+ ... % AP), bonus AD, AD, AP, critical strike chance
  // 4. Status conditions: uncancellable windup, rooted, slows, sight, revealed
  
  // Safe HTML replacement approach
  const formattedHtml = text
    // Header labels (Innate:, Active:, etc.)
    .replace(/\b(Innate|Active|Passive|Headshot):/gi, '<strong class="wiki-kw-label">$1:</strong>')
    // Damage types
    .replace(/\b(physical damage|bonus physical damage)\b/gi, '<span class="wiki-kw-phys">$1</span>')
    .replace(/\b(magic damage)\b/gi, '<span class="wiki-kw-magic">$1</span>')
    .replace(/\b(true damage)\b/gi, '<span class="wiki-kw-true">$1</span>')
    // Stat types
    .replace(/\b(bonus AD|AD bonus)\b/g, '<span class="wiki-kw-ad">$1</span>')
    .replace(/\bAD\b/g, '<span class="wiki-kw-ad">AD</span>')
    .replace(/\b(bonus AP|AP bonus)\b/g, '<span class="wiki-kw-ap">$1</span>')
    .replace(/\bAP\b/g, '<span class="wiki-kw-ap">AP</span>')
    .replace(/\b(critical strike chance)\b/gi, '<span class="wiki-kw-crit">$1</span>')
    .replace(/\b(based on level)\b/gi, '<span class="wiki-kw-level">$1</span>')
    // Status effects
    .replace(/\b(uncancellable windup)\b/gi, '<span class="wiki-kw-status windup">🛡️ $1</span>')
    .replace(/\b(rooted|roots)\b/gi, '<span class="wiki-kw-status root">⚓ $1</span>')
    .replace(/\b(slowed|slows)\b/gi, '<span class="wiki-kw-status slow">❄️ $1</span>')
    .replace(/\b(stunned|stuns)\b/gi, '<span class="wiki-kw-status stun">⚡ $1</span>')
    .replace(/\b(revealed|sight of)\b/gi, '<span class="wiki-kw-status sight">👁️ $1</span>')
    .replace(/\b(untargetable)\b/gi, '<span class="wiki-kw-status untargetable">✨ $1</span>');

  return (
    <div 
      className="wiki-effect-paragraph"
      dangerouslySetInnerHTML={{ __html: formattedHtml }}
    />
  );
}

/**
 * Single Ability Card (Exact visual clone of the official LoL Wiki Ability card)
 */
export function AbilityCard({ ability, abilityKey }) {
  const [collapsed, setCollapsed] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Meta row items
  const metaItems = [];
  if (ability.cost) {
    metaItems.push({ label: 'COST', value: ability.cost });
  }
  if (ability.rechargeRate) {
    metaItems.push({ label: 'RECHARGE', value: ability.rechargeRate });
  }
  if (ability.cooldown) {
    metaItems.push({ label: 'COOLDOWN', value: `${ability.cooldown} saniye` });
  }
  if (ability.castTime) {
    metaItems.push({ label: 'CAST TIME', value: `${ability.castTime} s` });
  }
  if (ability.range) {
    metaItems.push({ label: 'RANGE', value: ability.range, icon: '🎯' });
  }
  if (ability.width) {
    metaItems.push({ label: 'WIDTH', value: ability.width });
  }
  if (ability.speed) {
    metaItems.push({ label: 'SPEED', value: ability.speed });
  }
  if (ability.collisionRadius) {
    metaItems.push({ label: 'COLLISION RADIUS', value: ability.collisionRadius });
  }

  const isPassive = abilityKey === 'P';

  return (
    <div className={`wiki-ability-card ${collapsed ? 'collapsed' : ''}`}>
      
      {/* Background Stylized Watermark Letter (Q, W, E, R, P) */}
      <div className="ability-card-watermark">{abilityKey}</div>

      {/* Top Header Row */}
      <div className="ability-card-header">
        <div className="ability-card-header-left">
          <h3 className="ability-card-name">
            {ability.name}
            {ability.trName && ability.trName !== ability.name && (
              <span className="ability-tr-name">({ability.trName})</span>
            )}
          </h3>
          {/* For passive, if speed is present right next to it */}
          {isPassive && ability.speed && (
            <span className="ability-header-speed">SPEED: {ability.speed}</span>
          )}
        </div>

        {/* Header Right: Edit & Source Badge */}
        <div className="ability-card-header-right">
          <span className="ability-wiki-badge">LoL Wiki & Meraki API</span>
          <span className="ability-edit-tag">V14.24+</span>
        </div>
      </div>

      {/* Metadata Bar (Cost, Cooldown, Cast Time, Range, Speed, etc.) */}
      {!isPassive && metaItems.length > 0 && (
        <div className="ability-meta-bar">
          {metaItems.map((meta, i) => (
            <div key={i} className="meta-stat-pill">
              <span className="meta-stat-lbl">
                {meta.icon && <span className="meta-reticle-icon">{meta.icon}</span>}
                {meta.label}:
              </span>
              <span className="meta-stat-val">{meta.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Card Content Area (Left: Icon & Description, Right: Tactical Damage Boxes) */}
      {!collapsed && (
        <div className="ability-card-content-grid">
          
          {/* Left Column: Icon + Detailed Descriptions */}
          <div className="ability-left-body">
            <div className="ability-icon-wrapper">
              <img 
                src={ability.icon} 
                alt={ability.name} 
                className="ability-square-art"
                loading="lazy"
              />
              <span className={`ability-key-pip ${abilityKey.toLowerCase()}`}>
                {abilityKey}
              </span>
            </div>

            <div className="ability-effects-column">
              {ability.effects && ability.effects.map((eff, effIdx) => (
                <div key={effIdx} className="effect-block">
                  <FormattedDescription text={eff.description} />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Tactical Damage & Scaling Boxes (Physical Damage >>, Trap Duration, etc.) */}
          {ability.levelingBoxes && ability.levelingBoxes.length > 0 && (
            <div className="ability-right-tactical-boxes">
              {ability.levelingBoxes.map((box, bIdx) => (
                <div 
                  key={bIdx} 
                  className="tactical-damage-card"
                  style={{ borderLeftColor: box.color }}
                >
                  <div className="tactical-damage-header" style={{ color: box.color }}>
                    <span>{box.attribute.toUpperCase()}: &gt;&gt;</span>
                  </div>
                  <div className="tactical-damage-value">
                    {box.formatted}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* Additional Wiki Mechanical Notes (Collapsible) */}
      {showDetails && ability.notes && (
        <div className="ability-notes-drawer">
          <div className="notes-header">
            <span className="notes-icon">⚙️</span>
            <span>Mekanik İpuçları & Oyun İçi Kurallar</span>
          </div>
          <p className="notes-text">{ability.notes}</p>
        </div>
      )}

      {/* Card Footer Bar: Hide, Details, Video */}
      <div className="ability-card-footer">
        <button 
          type="button" 
          className="footer-action-link"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? '▼ Göster' : '▲ Gizle (Hide)'}
        </button>

        <span className="footer-link-divider">•</span>

        <button 
          type="button" 
          className={`footer-action-link ${showDetails ? 'active' : ''}`}
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? 'Mekanikleri Kapat' : 'Mekanik Detayları (Details)'}
        </button>

        <span className="footer-link-divider">•</span>

        <span className="footer-action-badge">
          Hedefleme: {ability.targeting}
        </span>
      </div>

    </div>
  );
}

/**
 * Main Full Abilities Component
 */
export default function LolAbilitiesView({ abilitiesData, championName }) {
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'P' | 'Q' | 'W' | 'E' | 'R'

  if (!abilitiesData || !abilitiesData.abilities) {
    return (
      <div className="abilities-loading-state">
        <div className="lol-spinner"></div>
        <p>Şampiyon beceri seti, tam formüller ve bekleme süreleri çekiliyor...</p>
      </div>
    );
  }

  const { abilities } = abilitiesData;
  const keysToRender = activeFilter === 'all' ? ['P', 'Q', 'W', 'E', 'R'] : [activeFilter];

  return (
    <div className="lol-wiki-abilities-section">
      
      {/* Top Abilities Header Bar (Matching Wiki style "Abilities 🔗") */}
      <div className="wiki-abilities-topbar">
        <div className="wiki-abilities-title-box">
          <h2 className="wiki-abilities-title">
            <span>Abilities (Yetenek Seti & Tam Hasarlar)</span>
            <span className="wiki-link-chain" title="Oyun İçi Formüller">🔗</span>
          </h2>
          <p className="wiki-abilities-sub">
            {championName} için League Wiki & Meraki API üzerinden çekilen resmi hasar formülleri, AD / AP çarpanları ve seviye ölçekleri.
          </p>
        </div>

        {/* Quick Filter Buttons (Tümü, Pasif, Q, W, E, R) */}
        <div className="wiki-abilities-filter-pills">
          <button 
            type="button" 
            className={`pill-btn ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            Tümü (P+Q+W+E+R)
          </button>
          {['P', 'Q', 'W', 'E', 'R'].map(k => (
            <button
              key={k}
              type="button"
              className={`pill-btn ${activeFilter === k ? 'active' : ''}`}
              onClick={() => setActiveFilter(k)}
            >
              <span className={`pill-key-dot ${k.toLowerCase()}`}>{k}</span>
              <span>{k === 'P' ? 'Pasif' : k}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Cards List */}
      <div className="wiki-abilities-cards-list">
        {keysToRender.map(key => {
          const list = abilities[key] || [];
          return list.map((ability, idx) => (
            <AbilityCard 
              key={`${key}_${idx}`} 
              ability={ability} 
              abilityKey={key} 
            />
          ));
        })}
      </div>

    </div>
  );
}
