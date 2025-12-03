// netlify/functions/nc-policy-data.js
// Knowledge base for NC energy policies and Duke Energy rates

const NC_POLICY_DATA = {
  rates: {
    residential: {
      standard: {
        rate: 0.1247,
        unit: "$/kWh",
        effective: "2025-01-01",
        notes: "Duke Energy Progress (most of NC)"
      },
      netMetering: {
        creditRate: 0.035,
        unit: "$/kWh",
        effective: "2025-01-01",
        notes: "Avoided cost rate - significantly lower than retail"
      },
      timeOfUse: {
        peak: {
          rate: 0.17,
          hours: "4pm-9pm weekdays",
          months: "June-September"
        },
        offPeak: {
          rate: 0.09,
          hours: "All other times"
        }
      }
    }
  },
  
  policies: {
    netMetering: {
      status: "Available but limited",
      creditType: "Avoided cost (wholesale rate)",
      monthlyRollover: true,
      annualPayout: "April, at avoided cost rate",
      notes: "Not favorable for solar-only systems. Battery storage helps capture full retail value."
    },
    
    interconnection: {
      timeline: "60-120 days typical",
      steps: [
        "Submit application to Duke Energy",
        "Engineering review (30-45 days)",
        "Approval and agreement",
        "Installation",
        "Final inspection and PTO (Permission to Operate)"
      ],
      fees: {
        application: 150,
        inspection: 0,
        notes: "Fees for systems under 20kW"
      }
    },
    
    incentives: {
      federal: {
        itc: {
          rate: 0.30,
          expires: "2032",
          notes: "30% tax credit for solar + battery systems"
        }
      },
      state: {
        rebates: "None currently available",
        notes: "NC state solar incentives ended in 2024"
      },
      utility: {
        powerPair: {
          credit: 1000,
          requirements: [
            "Approved battery system",
            "Duke Energy customer",
            "Enroll in PowerPair program"
          ],
          notes: "Battery must participate in grid services. Additional wear on system."
        }
      }
    }
  },
  
  programs: {
    powerPair: {
      provider: "Duke Energy",
      credit: 1000,
      requirements: [
        "13.5+ kWh battery capacity",
        "Must allow Duke to discharge battery during peak demand",
        "Maintain system availability"
      ],
      paymentPeriods: "Typically 5-10 events per year",
      paymentAmount: "$20-50 per event",
      concerns: [
        "Additional battery cycling reduces lifespan",
        "Loss of autonomy during grid events",
        "Program terms can change",
        "May not be worth it long-term"
      ],
      recommendation: "Usually not recommended - battery backup value > small payments"
    }
  },
  
  calculations: {
    breakEven: {
      batteryOnly: {
        cost: "$10,000-15,000",
        savingsPerYear: "$0 (backup only)",
        breakEven: "Never - pure insurance",
        notes: "Value is in backup power, not ROI"
      },
      solarPlusBattery: {
        cost: "$25,000-35,000 (10kW solar + 13kWh battery)",
        federalTaxCredit: "$7,500-10,500 (30%)",
        netCost: "$17,500-24,500",
        savingsPerYear: "$1,200-1,800",
        breakEven: "10-14 years",
        notes: "Depends on usage, orientation, shading"
      }
    },
    
    typicalHome: {
      monthlyUsage: "1,000-1,200 kWh",
      monthlyBill: "$125-150",
      annualCost: "$1,500-1,800"
    }
  },
  
  lastUpdated: "2025-11-03"
};

/**
 * Search knowledge base for relevant information based on keywords
 */
function searchPolicies(query) {
  const lowerQuery = query.toLowerCase();
  const results = [];
  
  // Rate questions
  if (lowerQuery.match(/rate|cost|price|kwh|bill/)) {
    results.push({
      topic: "Current Rates",
      data: NC_POLICY_DATA.rates.residential
    });
  }
  
  // Net metering
  if (lowerQuery.match(/net meter|credit|sell back|excess/)) {
    results.push({
      topic: "Net Metering",
      data: NC_POLICY_DATA.policies.netMetering
    });
  }
  
  // Interconnection
  if (lowerQuery.match(/interconnect|timeline|approval|pto|permission/)) {
    results.push({
      topic: "Interconnection Process",
      data: NC_POLICY_DATA.policies.interconnection
    });
  }
  
  // Incentives
  if (lowerQuery.match(/incentive|rebate|credit|tax|itc/)) {
    results.push({
      topic: "Incentives & Tax Credits",
      data: NC_POLICY_DATA.policies.incentives
    });
  }
  
  // PowerPair
  if (lowerQuery.match(/powerpair|power pair|duke program/)) {
    results.push({
      topic: "Duke PowerPair Program",
      data: NC_POLICY_DATA.programs.powerPair
    });
  }
  
  // Break-even / ROI
  if (lowerQuery.match(/worth it|save|roi|break even|payback/)) {
    results.push({
      topic: "Cost & Savings Analysis",
      data: NC_POLICY_DATA.calculations
    });
  }
  
  return results;
}

/**
 * Format knowledge for inclusion in system prompt
 */
function formatContext(results) {
  if (results.length === 0) return "";
  
  let context = "\n\nRELEVANT NC POLICY DATA:\n";
  results.forEach(result => {
    context += `\n${result.topic}:\n${JSON.stringify(result.data, null, 2)}\n`;
  });
  
  return context;
}

module.exports = {
  NC_POLICY_DATA,
  searchPolicies,
  formatContext
};
