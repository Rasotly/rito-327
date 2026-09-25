const fs = require('fs');

fetch('https://valorant-api.com/v1/weapons?language=tr-TR')
  .then(r => r.json())
  .then(d => {
    // Categorize and clean up data
    const categoryMap = {
      'EEquippableCategory::Sidearm': 'Beylik Silahlar',
      'EEquippableCategory::SMG': 'Hafif Makineli',
      'EEquippableCategory::Shotgun': 'Pompalı',
      'EEquippableCategory::Rifle': 'Taarruz Tüfeği',
      'EEquippableCategory::Sniper': 'Keskin Nişancı',
      'EEquippableCategory::Heavy': 'Ağır Silah',
      'EEquippableCategory::Melee': 'Yakın Dövüş'
    };

    const res = d.data.map(w => ({
      name: w.displayName,
      category: categoryMap[w.category] || w.category,
      image: w.displayIcon,
      cost: w.shopData ? w.shopData.cost : 0,
      stats: w.weaponStats ? {
        fireRate: w.weaponStats.fireRate,
        magazineSize: w.weaponStats.magazineSize,
        equipTimeSeconds: w.weaponStats.equipTimeSeconds,
        reloadTimeSeconds: w.weaponStats.reloadTimeSeconds
      } : null
    }));

    fs.writeFileSync('weapons_data.js', 'const OFFICIAL_WEAPONS = ' + JSON.stringify(res, null, 2) + ';\n\n');
    console.log("Weapons data written!");
  });
