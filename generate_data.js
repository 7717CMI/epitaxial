const fs = require('fs');
const path = require('path');

// Years: 2021-2033
const years = [2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033];

// Geographies with their region grouping
const regions = {
  "North America": ["U.S.", "Canada"],
  "Europe": ["U.K.", "Germany", "Italy", "France", "Spain", "Russia", "Rest of Europe"],
  "Asia Pacific": ["China", "India", "Japan", "South Korea", "ASEAN", "Australia", "Rest of Asia Pacific"],
  "Latin America": ["Brazil", "Argentina", "Mexico", "Rest of Latin America"],
  "Middle East & Africa": ["GCC", "South Africa", "Rest of Middle East & Africa"]
};

// Segment definitions with market share splits (proportions within each segment type)
const segmentTypes = {
  "By Material Platform": {
    "Silicon (Si) Epitaxial Wafers": 0.35,
    "Silicon Carbide (SiC) Epitaxial Wafers": 0.25,
    "Gallium Nitride (GaN) Epitaxial Wafers": 0.18,
    "Gallium Arsenide (GaAs) Epitaxial Wafers": 0.14,
    "Indium Phosphide (InP) Epitaxial Wafers": 0.08
  },
  "By Wafer Diameter": {
    "Less than Equal to 100mm (2\" and 4\")": 0.15,
    "150mm (6\")": 0.25,
    "200mm (8\")": 0.35,
    "300mm (12\")": 0.25
  },
  "By Device Category": {
    "Power Devices (MOSFET, IGBT, Diode)": 0.28,
    "Logic Devices (CPU, GPU, ASIC)": 0.22,
    "Memory Devices (DRAM, NAND)": 0.18,
    "RF Devices (Amplifiers, RF Front-End)": 0.12,
    "Optoelectronic Devices (LED, Laser, Photonics)": 0.12,
    "Sensors & MEMS": 0.08
  },
  "By Customer Type": {
    "Integrated Device Manufacturers (IDMs)": 0.45,
    "Foundries": 0.35,
    "Pure-Play Power Device Manufacturers": 0.20
  },
  "By Application": {
    "Automotive": 0.22,
    "Consumer Electronics": 0.24,
    "Industrial & Energy": 0.18,
    "Telecommunications": 0.12,
    "Data Center & Computing": 0.11,
    "Medical Devices": 0.07,
    "Aerospace & Defense": 0.06
  }
};

// Application sub-segments (share within parent)
const applicationSubSegments = {
  "Automotive": {
    "EV Traction Inverters, OBC, DC-DC": 0.40,
    "ADAS / Autonomous Systems": 0.28,
    "Automotive Infotainment": 0.18,
    "Automotive Lighting": 0.14
  },
  "Consumer Electronics": {
    "Smartphones": 0.30,
    "Laptops & PCs": 0.22,
    "Tablets": 0.12,
    "Wearables": 0.10,
    "Gaming Devices": 0.14,
    "Fast Chargers / Adapters": 0.12
  },
  "Industrial & Energy": {
    "Industrial Motor Drives": 0.22,
    "Factory Automation": 0.18,
    "Robotics": 0.15,
    "Renewable Energy Inverters (Solar/Wind)": 0.20,
    "Smart Grid Infrastructure": 0.13,
    "Energy Storage Systems": 0.12
  },
  "Telecommunications": {
    "5G / 6G Base Stations": 0.35,
    "Satellite Communication": 0.25,
    "Fiber Optic Networks": 0.22,
    "Radar Systems": 0.18
  },
  "Data Center & Computing": {
    "Servers": 0.30,
    "AI Accelerators": 0.30,
    "GPUs": 0.25,
    "Power Supply Units": 0.15
  },
  "Medical Devices": {
    "Diagnostic Imaging Equipment": 0.28,
    "Surgical Systems": 0.22,
    "Implantable Electronics": 0.20,
    "Monitoring Devices": 0.17,
    "Laboratory Equipment": 0.13
  },
  "Aerospace & Defense": {
    "Military Radar": 0.30,
    "Avionics": 0.28,
    "Secure Communication Systems": 0.24,
    "Electronic Warfare": 0.18
  }
};

// Regional base values (USD Million) for 2021 - total market per region
// Global Epitaxial Wafer market ~$4.5B in 2021, growing ~9% CAGR
const regionBaseValues = {
  "North America": 900,
  "Europe": 750,
  "Asia Pacific": 2200,
  "Latin America": 200,
  "Middle East & Africa": 150
};

// Country share within region (must sum to ~1.0)
const countryShares = {
  "North America": { "U.S.": 0.82, "Canada": 0.18 },
  "Europe": { "U.K.": 0.15, "Germany": 0.25, "Italy": 0.10, "France": 0.15, "Spain": 0.08, "Russia": 0.10, "Rest of Europe": 0.17 },
  "Asia Pacific": { "China": 0.32, "India": 0.08, "Japan": 0.25, "South Korea": 0.15, "ASEAN": 0.10, "Australia": 0.04, "Rest of Asia Pacific": 0.06 },
  "Latin America": { "Brazil": 0.45, "Argentina": 0.15, "Mexico": 0.25, "Rest of Latin America": 0.15 },
  "Middle East & Africa": { "GCC": 0.45, "South Africa": 0.25, "Rest of Middle East & Africa": 0.30 }
};

// Growth rates (CAGR) per region
const regionGrowthRates = {
  "North America": 0.088,
  "Europe": 0.082,
  "Asia Pacific": 0.105,
  "Latin America": 0.092,
  "Middle East & Africa": 0.078
};

// Segment-specific growth multipliers (relative to regional base CAGR)
const segmentGrowthMultipliers = {
  "By Material Platform": {
    "Silicon (Si) Epitaxial Wafers": 0.85,
    "Silicon Carbide (SiC) Epitaxial Wafers": 1.35,
    "Gallium Nitride (GaN) Epitaxial Wafers": 1.40,
    "Gallium Arsenide (GaAs) Epitaxial Wafers": 0.95,
    "Indium Phosphide (InP) Epitaxial Wafers": 1.15
  },
  "By Wafer Diameter": {
    "Less than Equal to 100mm (2\" and 4\")": 0.75,
    "150mm (6\")": 0.90,
    "200mm (8\")": 1.10,
    "300mm (12\")": 1.25
  },
  "By Device Category": {
    "Power Devices (MOSFET, IGBT, Diode)": 1.20,
    "Logic Devices (CPU, GPU, ASIC)": 1.05,
    "Memory Devices (DRAM, NAND)": 0.90,
    "RF Devices (Amplifiers, RF Front-End)": 1.15,
    "Optoelectronic Devices (LED, Laser, Photonics)": 1.08,
    "Sensors & MEMS": 1.12
  },
  "By Customer Type": {
    "Integrated Device Manufacturers (IDMs)": 0.95,
    "Foundries": 1.10,
    "Pure-Play Power Device Manufacturers": 1.18
  },
  "By Application": {
    "Automotive": 1.30,
    "Consumer Electronics": 0.88,
    "Industrial & Energy": 1.15,
    "Telecommunications": 1.10,
    "Data Center & Computing": 1.25,
    "Medical Devices": 1.05,
    "Aerospace & Defense": 0.95
  }
};

// Sub-segment growth multipliers (relative to parent application growth)
const subSegmentGrowthMultipliers = {
  "Automotive": {
    "EV Traction Inverters, OBC, DC-DC": 1.15,
    "ADAS / Autonomous Systems": 1.20,
    "Automotive Infotainment": 0.85,
    "Automotive Lighting": 0.90
  },
  "Consumer Electronics": {
    "Smartphones": 0.90,
    "Laptops & PCs": 0.85,
    "Tablets": 0.80,
    "Wearables": 1.25,
    "Gaming Devices": 1.10,
    "Fast Chargers / Adapters": 1.30
  },
  "Industrial & Energy": {
    "Industrial Motor Drives": 0.95,
    "Factory Automation": 1.10,
    "Robotics": 1.25,
    "Renewable Energy Inverters (Solar/Wind)": 1.20,
    "Smart Grid Infrastructure": 1.15,
    "Energy Storage Systems": 1.18
  },
  "Telecommunications": {
    "5G / 6G Base Stations": 1.20,
    "Satellite Communication": 1.10,
    "Fiber Optic Networks": 0.95,
    "Radar Systems": 1.05
  },
  "Data Center & Computing": {
    "Servers": 0.90,
    "AI Accelerators": 1.35,
    "GPUs": 1.20,
    "Power Supply Units": 0.85
  },
  "Medical Devices": {
    "Diagnostic Imaging Equipment": 0.95,
    "Surgical Systems": 1.10,
    "Implantable Electronics": 1.15,
    "Monitoring Devices": 1.05,
    "Laboratory Equipment": 0.90
  },
  "Aerospace & Defense": {
    "Military Radar": 1.05,
    "Avionics": 1.00,
    "Secure Communication Systems": 1.10,
    "Electronic Warfare": 1.08
  }
};

// Volume multiplier: wafers per USD Million
const volumePerMillionUSD = 850;

// Seeded pseudo-random for reproducibility
let seed = 42;
function seededRandom() {
  seed = (seed * 16807 + 0) % 2147483647;
  return (seed - 1) / 2147483646;
}

function addNoise(value, noiseLevel = 0.03) {
  return value * (1 + (seededRandom() - 0.5) * 2 * noiseLevel);
}

function roundTo1(val) {
  return Math.round(val * 10) / 10;
}

function roundToInt(val) {
  return Math.round(val);
}

function generateTimeSeries(baseValue, growthRate, roundFn) {
  const series = {};
  for (let i = 0; i < years.length; i++) {
    const year = years[i];
    const rawValue = baseValue * Math.pow(1 + growthRate, i);
    series[year] = roundFn(addNoise(rawValue));
  }
  return series;
}

function generateData(isVolume) {
  const data = {};
  const roundFn = isVolume ? roundToInt : roundTo1;
  const multiplier = isVolume ? volumePerMillionUSD : 1;

  // Generate data for each region and country
  for (const [regionName, countries] of Object.entries(regions)) {
    const regionBase = regionBaseValues[regionName] * multiplier;
    const regionGrowth = regionGrowthRates[regionName];

    // Region-level data
    data[regionName] = {};
    for (const [segType, segments] of Object.entries(segmentTypes)) {
      data[regionName][segType] = {};

      if (segType === "By Application") {
        // For Application, generate hierarchical data with sub-segments
        // Parent nodes get aggregated year data + child objects
        for (const [segName, share] of Object.entries(segments)) {
          const segGrowth = regionGrowth * segmentGrowthMultipliers[segType][segName];
          const segBase = regionBase * share;
          // Generate parent-level aggregated time series first
          const parentSeries = generateTimeSeries(segBase, segGrowth, roundFn);
          // Start parent node with year data (aggregated)
          data[regionName][segType][segName] = { ...parentSeries, _aggregated: true, _level: 2 };
          const subSegs = applicationSubSegments[segName];
          for (const [subName, subShare] of Object.entries(subSegs)) {
            const subGrowth = segGrowth * subSegmentGrowthMultipliers[segName][subName];
            const subBase = segBase * subShare;
            data[regionName][segType][segName][subName] = generateTimeSeries(subBase, subGrowth, roundFn);
          }
        }
      } else {
        for (const [segName, share] of Object.entries(segments)) {
          const segGrowth = regionGrowth * segmentGrowthMultipliers[segType][segName];
          const segBase = regionBase * share;
          data[regionName][segType][segName] = generateTimeSeries(segBase, segGrowth, roundFn);
        }
      }
    }

    // Add "By Country" for each region
    data[regionName]["By Country"] = {};
    for (const country of countries) {
      const cShare = countryShares[regionName][country];
      const countryGrowthVariation = 1 + (seededRandom() - 0.5) * 0.06;
      const countryBase = regionBase * cShare;
      const countryGrowth = regionGrowth * countryGrowthVariation;
      data[regionName]["By Country"][country] = generateTimeSeries(countryBase, countryGrowth, roundFn);
    }

    // Country-level data
    for (const country of countries) {
      const cShare = countryShares[regionName][country];
      const countryBase = regionBase * cShare;
      const countryGrowthVariation = 1 + (seededRandom() - 0.5) * 0.04;
      const countryGrowth = regionGrowth * countryGrowthVariation;

      data[country] = {};
      for (const [segType, segments] of Object.entries(segmentTypes)) {
        data[country][segType] = {};

        if (segType === "By Application") {
          for (const [segName, share] of Object.entries(segments)) {
            const segGrowth = countryGrowth * segmentGrowthMultipliers[segType][segName];
            const segBase = countryBase * share;
            const shareVariation = 1 + (seededRandom() - 0.5) * 0.1;
            // Generate parent-level aggregated time series
            const parentSeries = generateTimeSeries(segBase * shareVariation, segGrowth, roundFn);
            data[country][segType][segName] = { ...parentSeries, _aggregated: true, _level: 2 };
            const subSegs = applicationSubSegments[segName];
            for (const [subName, subShare] of Object.entries(subSegs)) {
              const subGrowth = segGrowth * subSegmentGrowthMultipliers[segName][subName];
              const subBase = segBase * shareVariation * subShare;
              data[country][segType][segName][subName] = generateTimeSeries(subBase, subGrowth, roundFn);
            }
          }
        } else {
          for (const [segName, share] of Object.entries(segments)) {
            const segGrowth = countryGrowth * segmentGrowthMultipliers[segType][segName];
            const segBase = countryBase * share;
            const shareVariation = 1 + (seededRandom() - 0.5) * 0.1;
            data[country][segType][segName] = generateTimeSeries(segBase * shareVariation, segGrowth, roundFn);
          }
        }
      }
    }
  }

  return data;
}

// Generate both datasets
seed = 42;
const valueData = generateData(false);
seed = 7777;
const volumeData = generateData(true);

// Write files
const outDir = path.join(__dirname, 'public', 'data');
fs.writeFileSync(path.join(outDir, 'value.json'), JSON.stringify(valueData, null, 2));
fs.writeFileSync(path.join(outDir, 'volume.json'), JSON.stringify(volumeData, null, 2));

console.log('Generated value.json and volume.json successfully');
console.log('Value geographies:', Object.keys(valueData).length);
console.log('Volume geographies:', Object.keys(volumeData).length);
console.log('Segment types:', Object.keys(valueData['North America']));
console.log('Sample - North America, By Material Platform:', JSON.stringify(valueData['North America']['By Material Platform'], null, 2));
