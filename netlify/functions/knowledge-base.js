// netlify/functions/knowledge-base.js
// Knowledge base for The Admiral - NC Solar & Battery Info

const KNOWLEDGE_BASE = {
  powerpair: {
    keywords: ['powerpair', 'battery', 'cost', 'price', 'how much', 'incentive', 'battery control'],
    content: `Duke Energy PowerPair Pilot Program:
- Upfront Incentive: $9,000 total ($3,600 solar credit at $0.36/watt up to 10kW + $5,400 battery at $400/kWh up to 13.5kWh)
- Battery Control Program: Additional $552/year for 10 years ($46/month credit) for letting Duke dispatch battery during 30-36 peak events annually
- Total 10-year value: $9,000 upfront + $5,520 Battery Control = $14,520 in Duke incentives
- Plus 30% Federal ITC on full system cost
- Capacity: 13.5 kWh usable (Tesla Powerwall 2 or equivalent)
- Power: 5kW continuous, 7kW peak
- Availability: First-come first-served, capacity limited
- Eligibility: New solar+storage systems in Duke NC territory
- Battery must charge 75%+ from solar to qualify for federal ITC`
  },
  
  solar_roi: {
    keywords: ['solar', 'save', 'roi', 'payback', 'worth it', 'cost', 'savings'],
    content: `Solar ROI in Charlotte/Duke Energy Carolinas Territory:
- Bridge Rate Program: 11-12 year payback, saves ~$1,410+ annually vs Solar Choice
- Solar Choice (Time of Use): 15+ year payback without battery, requires TOU rate management
- Legacy Net Metering (grandfathered until Oct 1, 2027): Best economics - 85-88% bill reduction at retail rate
- Duke Energy Carolinas Rates: ~14¢/kWh retail, $22/month minimum
- Federal ITC: 30% through 2032, then 26% (2033), 22% (2034)
- Property Tax Exemption: Solar adds ~$15,000 home value but exempt from property tax assessment
- System Sizing: 10-12kW typical for average homes on Bridge Rate; 12-15kW for Solar Choice with battery
- Payback increased post-2023: Installations fell 15% due to reduced economics vs old net metering`
  },
  
  interconnection: {
    keywords: ['interconnection', 'duke', 'approval', 'timeline', 'process', 'how long', 'pto', 'permission'],
    content: `Duke Energy Interconnection Timeline (Charlotte/NC):
- Total Timeline: 3-6 months from application to Permission to Operate (PTO)
- Three Steps Required:
  1. Pre-Application Report ($300 nonrefundable fee)
  2. Interconnection Request ($100 processing fee)
  3. Report of Proposed Construction filed with NCUC for docket number
- Duke installs disconnect switch and sets meters after local electrical inspection passes
- Bridge Rate Capacity: First-come first-served, may exhaust before Oct 1, 2027 deadline
- PowerPair Capacity: Also first-come first-served, no guarantee of future availability
- Coordination needed: Installer, Duke, local inspectors, NCUC staff
- Critical: Apply early in 2025-2027 for Bridge Rate enrollment to secure capacity`
  },
  
  battery_coverage: {
    keywords: ['outage', 'backup', 'run', 'power', 'coverage', 'how long', 'what can', 'tou', 'arbitrage', 'time of use'],
    content: `PowerPair Battery Strategy & Coverage:
Time of Use Arbitrage (Solar Choice customers):
- Summer Strategy: Charge from solar 9AM-5PM (off-peak), discharge 6-9PM (on-peak at $0.21-0.22/kWh)
- Winter Strategy: Discharge 6-9AM morning peak, charge from solar midday discount period (11AM-4PM)
- Annual arbitrage value: $250-350 from time-shifting alone
- Combined with Battery Control ($552/year): batteries become essential economic optimization tools

Backup Power Coverage (13.5kWh):
- Essential Loads: 1-2 days (refrigerator, lights, wifi, phone, TV, laptop = ~500W = 27 hours)
- Moderate Loads: 8-12 hours (add window AC or well pump = ~1200W)
- Heavy Loads NOT recommended: Central AC, electric range, dryer drain in 2-4 hours
- Battery Control Program: Maintains 20% minimum charge during Duke's 30-36 annual dispatch events
- With Solar: Can recharge during outages with sun, extend runtime indefinitely`
  },
  
  company_info: {
    keywords: ['admiral energy', 'company', 'contact', 'who', 'about'],
    content: `Admiral Energy - North Carolina Solar & Battery Experts:
- Location: Serving all of North Carolina
- Specialty: Battery-first backup power solutions (not solar-pushy)
- Approach: Math-first, honest guidance - we'll tell you when solar doesn't make sense
- Duke PowerPair Certified Installer
- Free Consultations: No pressure, just numbers
- Contact: 
  * Website: admiralenergy.ai
  * Phone: (980) 209-2101
  * Email: david@admiralenergy.ai
- Services:
  * PowerPair battery backup installation
  * Solar + storage systems
  * Energy audits
  * ROI analysis
  * Duke interconnection assistance
- Philosophy: We focus on what makes financial sense for YOUR home, not commission`
  },

  when_solar_doesnt_work: {
    keywords: ['not worth', 'doesn\'t make sense', 'bad idea', 'avoid'],
    content: `When Solar Doesn't Make Sense in NC:
1. Low Energy Usage (<600 kWh/month):
   - Payback period extends to 15+ years
   - Better to focus on efficiency first

2. Shading Issues:
   - Trees blocking >50% of roof during peak sun hours
   - Even partial shade dramatically reduces output
   - Trimming may not be feasible/allowed

3. Roof Condition:
   - Less than 10 years remaining lifespan
   - Would need removal/reinstallation during replacement
   - Adds $3-5k to future roof cost

4. Short-Term Ownership:
   - Planning to sell within 3-5 years
   - Solar adds resale value but not 1:1 with cost
   - Better for 10+ year ownership plans

5. Unfavorable Roof Orientation:
   - North-facing only roof
   - East/west can work but reduces production 15-25%

Alternative: Consider PowerPair battery backup WITHOUT solar:
- Provides outage protection
- Qualifies for 30% tax credit
- No roof/shade concerns
- Can add solar later if situation changes`
  },

  duke_programs: {
    keywords: ['duke', 'program', 'bridge rate', 'solar choice', 'legacy', 'net metering', 'which program'],
    content: `Duke Energy NC Solar Programs (Charlotte/DEC Territory):
Legacy Net Metering (BEST - but ended Oct 2023):
- Retail rate credit for excess (1:1 billing), grandfathered through Oct 1, 2027
- 85-88% bill reduction, automatic transition to Bridge Rate in 2027

Bridge Rate (RECOMMENDED through 2027):
- 15-year rate protection, excess credited at avoided cost $0.034/kWh
- Simplified billing, ~$1,410+ more annual savings than Solar Choice
- Capacity limited, first-come first-served
- May exhaust before Oct 2027 deadline - apply early!

Solar Choice (Time of Use - mandatory after Bridge exhausts):
- Period-specific credits: Summer on-peak 6-9PM weekdays ($0.21-0.22/kWh), off-peak rest ($0.10-0.13/kWh)
- Solar produces during LOW-value off-peak, consumption during HIGH-value on-peak
- 15+ year payback without battery, requires TOU management
- Battery essential to capture value through arbitrage`
  },

  duke_territories: {
    keywords: ['dec', 'dep', 'charlotte', 'territory', 'carolinas', 'progress', 'kings mountain'],
    content: `Duke Energy Territory Differences in NC:
Duke Energy Carolinas (DEC) - Charlotte/Kings Mountain Area:
- Retail Rate: ~14¢/kWh (slightly lower than DEP)
- Monthly Minimum: $22
- Service Area: Charlotte, Greater Mecklenburg, Kings Mountain, western NC

Duke Energy Progress (DEP) - Eastern NC:
- Retail Rate: ~15.5¢/kWh
- Monthly Minimum: $28
- Service Area: Raleigh, Triangle, eastern NC

Key Difference: Charlotte falls under DEC territory = better economics
Admiral Energy operates in DEC territory (Kings Mountain, Cleveland County)
Rate difference creates modestly better solar ROI for Charlotte customers vs eastern NC`
  },

  hoa_solar_rights: {
    keywords: ['hoa', 'homeowners association', 'condo', 'restrictions', 'approval'],
    content: `NC Solar Rights & HOA Restrictions (Belmont v. Farwig 2022):
NC Supreme Court Ruling (June 2022):
- HOAs CANNOT prohibit solar unless governing documents have explicit solar restrictions
- Even explicit restrictions cannot prevent "reasonable use"
- General architectural authority or "improvements" clauses DO NOT allow solar denial
- Restriction forcing rear-roof placement reducing production >10% likely invalid
- NC General Statute § 22B-20 prohibits deed restrictions with "effect of prohibiting" solar

Practical HOA Navigation:
1. Review HOA documents for explicit solar restrictions BEFORE design
2. Engage HOA boards early with property value data, renderings, installer credentials
3. HOAs must allow reasonable placement - south-facing roofs optimal, cannot force north-facing
4. ~40% of NC homeowners in HOAs - this ruling provides strong solar rights

Edge Cases:
- Stacked condos: HOAs can prohibit (no exclusive roof rights)
- Townhomes: Case-specific, depends on exclusive roof access
- Detached homes: Strong solar rights, HOAs can only impose reasonable placement requirements`
  }

};

// Search function
function searchKnowledge(query) {
  const queryLower = query.toLowerCase();
  const matches = [];
  
  for (const [key, section] of Object.entries(KNOWLEDGE_BASE)) {
    // Check if any keywords match
    const matchScore = section.keywords.filter(kw => queryLower.includes(kw)).length;
    if (matchScore > 0) {
      matches.push({ key, content: section.content, score: matchScore });
    }
  }
  
  // Sort by relevance
  matches.sort((a, b) => b.score - a.score);
  
  // Return top 2 most relevant sections
  return matches.slice(0, 2).map(m => m.content).join('\n\n---\n\n');
}

module.exports = { KNOWLEDGE_BASE, searchKnowledge };
