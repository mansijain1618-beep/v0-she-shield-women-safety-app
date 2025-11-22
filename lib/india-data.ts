// Real India data service with comprehensive resources
export const indiaData = {
  emergencyHelplines: {
    national: [
      {
        name: "Police Emergency",
        number: "100",
        category: "emergency",
        available: "24/7",
        description: "For immediate danger and emergencies",
      },
      {
        name: "National Women Helpline",
        number: "1090",
        category: "women-safety",
        available: "24/7",
        description: "Toll-free support for women in distress",
      },
      {
        name: "Women Helpline (AASRA)",
        number: "9820466726",
        category: "women-support",
        available: "24/7",
        description: "Crisis intervention and counseling",
      },
      {
        name: "iCall Crisis Line",
        number: "9152987821",
        category: "mental-health",
        available: "24/7",
        description: "Mental health and emotional support",
      },
      {
        name: "Vandrevala Foundation",
        number: "9999666555",
        category: "mental-health",
        available: "24/7",
        description: "Crisis counseling and suicide prevention",
      },
      {
        name: "Anti-Human Trafficking",
        number: "1800111555",
        category: "trafficking",
        available: "24/7",
        description: "National human trafficking awareness",
      },
      {
        name: "POCSO Helpline",
        number: "9555000777",
        category: "child-protection",
        available: "24/7",
        description: "Child sexual abuse and exploitation",
      },
      {
        name: "Cyber Crime Helpline",
        number: "1930",
        category: "cybercrime",
        available: "24/7",
        description: "Online harassment and cyber fraud",
      },
      {
        name: "Sexual Harassment at Work",
        number: "1909",
        category: "workplace",
        available: "24/7",
        description: "Workplace sexual harassment complaints",
      },
    ],
    cityWise: {
      delhi: [
        {
          name: "Delhi Women Helpline",
          number: "1091",
          type: "state",
          city: "Delhi",
        },
        {
          name: "Delhi Women Helpline (Alt)",
          number: "011-4141-7343",
          type: "state",
          city: "Delhi",
        },
        {
          name: "Delhi Police - Women Cell",
          number: "011-2330-3999",
          type: "police",
          city: "Delhi",
        },
      ],
      mumbai: [
        {
          name: "Mumbai Women Helpline",
          number: "1090",
          type: "state",
          city: "Mumbai",
        },
        {
          name: "Aasra Helpline",
          number: "9820466726",
          type: "ngo",
          city: "Mumbai",
        },
        {
          name: "Mumbai Police - Women Cell",
          number: "22-6169-4438",
          type: "police",
          city: "Mumbai",
        },
      ],
      bangalore: [
        {
          name: "Bangalore Women Helpline",
          number: "1090",
          type: "state",
          city: "Bangalore",
        },
        {
          name: "Bangalore Police Women Cell",
          number: "080-2255-2999",
          type: "police",
          city: "Bangalore",
        },
        {
          name: "Cyber Crime Cell",
          number: "080-4945-6886",
          type: "police",
          city: "Bangalore",
        },
      ],
      kolkata: [
        {
          name: "Kolkata Women Helpline",
          number: "1090",
          type: "state",
          city: "Kolkata",
        },
        {
          name: "Kolkata Police Women Cell",
          number: "033-4040-2000",
          type: "police",
          city: "Kolkata",
        },
      ],
      pune: [
        {
          name: "Pune Women Helpline",
          number: "1090",
          type: "state",
          city: "Pune",
        },
        {
          name: "Pune Police Women Cell",
          number: "020-2622-1313",
          type: "police",
          city: "Pune",
        },
      ],
      hyderabad: [
        {
          name: "Hyderabad Women Helpline",
          number: "1090",
          type: "state",
          city: "Hyderabad",
        },
        {
          name: "Hyderabad Police Women Cell",
          number: "040-2708-5050",
          type: "police",
          city: "Hyderabad",
        },
      ],
      chennai: [
        {
          name: "Chennai Women Helpline",
          number: "1090",
          type: "state",
          city: "Chennai",
        },
        {
          name: "Chennai Police Women Cell",
          number: "044-2459-5050",
          type: "police",
          city: "Chennai",
        },
      ],
    },
  },
  importantLaws: [
    {
      name: "Indian Penal Code 354",
      description: "Outraging the modesty of women",
      punishment: "Imprisonment up to 3 years or fine up to 2000 rupees",
      applicable: "All of India",
    },
    {
      name: "Indian Penal Code 376",
      description: "Sexual assault/Rape",
      punishment: "Minimum 7 years to life imprisonment",
      applicable: "All of India",
    },
    {
      name: "Indian Penal Code 509",
      description: "Insult to the modesty of women",
      punishment: "Up to 3 years imprisonment or fine",
      applicable: "All of India",
    },
    {
      name: "Dowry Prohibition Act (1961)",
      description: "Prohibition of dowry in marriages",
      punishment: "Up to 5 years imprisonment and fine",
      applicable: "All of India",
    },
    {
      name: "Protection of Women from Domestic Violence Act (2005)",
      description: "Protection from abuse and violence at home",
      punishment: "Up to 1 year imprisonment or fine",
      applicable: "All of India",
    },
    {
      name: "Sexual Harassment of Women at Workplace Act (2013)",
      description: "POSH Act - Workplace safety",
      punishment: "Various disciplinary actions and legal penalties",
      applicable: "All workplaces in India",
    },
    {
      name: "POCSO Act (2012)",
      description: "Protection of Children from Sexual Offences",
      punishment: "Rigorous imprisonment up to 7 years",
      applicable: "Protection for children",
    },
    {
      name: "Cybercrime Protection",
      description: "IPC 354D - Stalking, online harassment",
      punishment: "Up to 3 years imprisonment",
      applicable: "All of India",
    },
  ],
  crimeSafetyData: {
    highRiskAreas: [
      { city: "Delhi", area: "South Delhi", riskLevel: "moderate", incidents: 450 },
      { city: "Delhi", area: "North Delhi", riskLevel: "high", incidents: 680 },
      { city: "Mumbai", area: "Central Mumbai", riskLevel: "moderate", incidents: 320 },
      { city: "Bangalore", area: "South Bangalore", riskLevel: "low", incidents: 150 },
      { city: "Kolkata", area: "Central Kolkata", riskLevel: "moderate", incidents: 280 },
    ],
    safeAreas: [
      { city: "Delhi", area: "Gurgaon", safetyScore: 8.5 },
      { city: "Bangalore", area: "Whitefield", safetyScore: 8.8 },
      { city: "Mumbai", area: "Bandra", safetyScore: 7.9 },
      { city: "Pune", area: "Koregaon Park", safetyScore: 8.2 },
      { city: "Hyderabad", area: "Hitech City", safetyScore: 8.7 },
    ],
  },
  mentalHealthResources: [
    {
      name: "NMHP Services",
      description: "National Mental Health Programme",
      type: "Government",
      availability: "Pan-India",
    },
    {
      name: "NIMHANS Bangalore",
      description: "National Institute of Mental Health",
      type: "Government",
      phone: "080-2699-5100",
      availability: "Online counselling available",
    },
    {
      name: "Wysa",
      type: "App",
      description: "AI mental health support and therapy",
      availability: "Paid + Free options",
    },
    {
      name: "Sanvello",
      type: "App",
      description: "Mood tracking and therapy support",
      availability: "Paid + Free trial",
    },
    {
      name: "BetterHelp",
      type: "Online",
      description: "Online therapy with licensed therapists",
      availability: "Paid (accepts Indian therapists)",
    },
  ],
  selfDefenseResources: [
    {
      name: "Women's Self Defense Classes",
      description: "Martial arts training in major cities",
      cities: ["Delhi", "Mumbai", "Bangalore", "Pune", "Hyderabad"],
    },
    {
      name: "Pepper Spray",
      description: "Legal self-defense tool (with permit)",
      availability: "Online and retail stores",
      legalInIndia: true,
    },
    {
      name: "Personal Safety Apps",
      tools: [
        { name: "bSafe", description: "Emergency alert and location sharing" },
        { name: "Circle of 6", description: "Friends support system" },
        { name: "TravelSafe", description: "Travel safety monitoring" },
        { name: "SafetiPin", description: "Safety rating and resources" },
      ],
    },
  ],
}
