export const SelectTravelesList = [
  {
    id: 1,
    title: 'Just Me',
    desc: 'A solo traveler exploring new places',
    icon: '✈️',
    people: '1'
  },
  {
    id: 2,
    title: 'A Couple',
    desc: 'Two travelers in tandem',
    icon: '🥂',
    people: '2 People'
  },
  {
    id: 3,
    title: 'Family',
    desc: 'A group of fun loving adventurers',
    icon: '🏡',
    people: '3 to 5 People'
  },
  {
    id: 4,
    title: 'Friends',
    desc: 'A bunch of thrill-seekers',
    icon: '⛵',
    people: '5 to 10 People'
  }
]

export const SelectBudgetOptions = [
  {
    id: 1,
    title: 'Cheap',
    desc: 'Stay conscious of costs',
    icon: '💵'
  },
  {
    id: 2,
    title: 'Moderate',
    desc: 'Keep cost on the average side',
    icon: '💰'
  },
  {
    id: 3,
    title: 'Luxury',
    desc: 'Dont worry about cost',
    icon: '💎'
  }
]



export const AI_PROMPT = `Generate a detailed travel plan for the following requirements:

Location: {location}
Duration: {days} days
Budget: {budget}
Number of travelers: {people}

IMPORTANT: Respond with ONLY valid JSON. Do not include any markdown formatting, code blocks, or additional text. Return a pure JSON object.

Please provide a comprehensive travel plan in JSON format with the following structure:
{
  "destination": "destination name",
  "duration": "number of days",
  "budget": "budget level",
  "travelers": "number of people",
  "bestTimeToVisit": "recommended time period",
  "itinerary": [
    {
      "day": 1,
      "activities": [
        {
          "time": "morning/afternoon/evening",
          "activity": "activity description",
          "location": "specific location",
          "cost": "estimated cost"
        }
      ]
    }
  ],
  "accommodation": {
    "recommendations": ["hotel suggestions"],
    "priceRange": "price range per night"
  },
  "transportation": {
    "local": "local transport options",
    "estimated_cost": "transport budget"
  },
  "totalEstimatedCost": "overall trip cost estimate"
}`;
