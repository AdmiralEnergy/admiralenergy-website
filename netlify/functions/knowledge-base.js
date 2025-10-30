// netlify/functions/knowledge-base.js
// Knowledge base for The Admiral - NC Solar & Battery Info

const KNOWLEDGE_BASE = {
  powerpair: {
    keywords: ['powerpair', 'battery', 'cost', 'price', 'how much'],
    content: `Duke Energy PowerPair Backup System:
- Cost: Approximately $15,000 installed (before incentives)
- Federal Tax Credit: 30% (reduces cost to ~$10,500)
- Capacity: 13.5 kWh usable energy storage
- Power Output: 5 kW continuous, 7 kW peak
- Coverage: Powers essential loads (fridge, lights, wifi, phone chargers) for 1-2 days
- Warranty: 10 years
- Eligibility: Available to Duke Energy NC customers
- Installation Timeline: 4-6 weeks after approval
- Qualifies for federal ITC even without solar panels`
  },
  
  solar_roi: {
    keywords: ['solar', 'save', 'roi', 'payback', 'worth it', 'cost'],
    content: `Solar ROI in North Carolina:
- Average Payback Period: 8-12 years
- Factors Affecting ROI:
  * Monthly usage (>1200 kWh/month = better ROI)
  * Roof orientation (south-facing ideal)
  * Shading (minimal shade required)
  * Roof age (should have 15+ years remaining)
  * Utility rates (Duke Energy averages $0.11-0.13/kWh)
- NC Solar Incentives:
  * Federal ITC: 30% tax credit
  * Duke Energy net metering: 1:1 credit for excess production
  * Property tax exemption for solar equipment
- When Solar Makes Sense: High usage, good roof, long-term ownership
- When It Doesn't: Low usage, heavy shade, roof replacement needed soon`
  },
  
  interconnection: {
    keywords: ['interconnection', 'duke', 'approval', 'timeline', 'process', 'how long'],
    content: `Duke Energy Interconnection Process:
- Initial Application Review: 15-30 days
- Engineering Review: 30-45 days
- Permission to Operate (PTO): 45-90 days total from application
- Required Documents:
  * Interconnection application
  * System design/specs
  * Electrical diagrams
  * Installer certifications
- Common Delays:
  * Incomplete applications (most common)
  * Utility grid capacity issues (rare in residential)
  * Permit corrections
- Tips for Faster Approval:
  * Use Duke-approved equipment
  * Complete application accurately
  * Work with experienced installer (Admiral Energy handles this)
  * Submit during off-peak season (avoid summer rush)`
  },
  
  battery_coverage: {
    keywords: ['outage', 'backup', 'run', 'power', 'coverage', 'how long', 'what can'],
    content: `Battery Backup Coverage (13.5 kWh PowerPair):
Essential Loads (1-2 days):
- Refrigerator: 150-200W
- LED lighting: 50-100W
- WiFi router: 10W
- Phone chargers: 10-20W
- TV: 100-200W
- Laptop: 50-100W
- Total: ~500W = 27 hours of runtime

Moderate Loads (8-12 hours):
- Add: Window AC unit (1000W)
- Or: Electric water heater (partial use)
- Or: Well pump (running periodically)
- Total: ~1200W = 11 hours

Heavy Loads (Not Recommended):
- Central AC, Electric range, Dryer, Pool pumps
- These drain battery in 2-4 hours

Solar + Battery:
- During outage with sun: Can recharge during day, extend runtime indefinitely
- Duke PowerPair can be paired with solar for continuous backup power

Runtime Formula: 13.5 kWh ÷ (Your Load in kW) = Hours`
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
