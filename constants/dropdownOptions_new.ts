/**
 * Dropdown Options for Matrimonial App
 * Consolidated constants for use throughout the application
 * Similar to Shaadi.com/Tinder style dropdowns
 */

// ============================================================================
// BASIC OPTIONS
// ============================================================================

/** Age options for filter (18-60) */
export const AGE_OPTIONS: string[] = Array.from({ length: 43 }, (_, i) => (i + 18).toString());

/** Height options (4'0" to 7'0") */
export const HEIGHT_OPTIONS: string[] = [
  "4'0\"", "4'1\"", "4'2\"", "4'3\"", "4'4\"", "4'5\"", "4'6\"", "4'7\"", "4'8\"", "4'9\"",
  "5'0\"", "5'1\"", "5'2\"", "5'3\"", "5'4\"", "5'5\"", "5'6\"", "5'7\"", "5'8\"", "5'9\"",
  "6'0\"", "6'1\"", "6'2\"", "6'3\"", "6'4\"", "6'5\"", "6'6\"", "6'7\"", "6'8\"", "6'9\"",
  "7'0\""
];

// ============================================================================
// PERSONAL DETAILS
// ============================================================================

/** Religion options */
export const RELIGION_OPTIONS: string[] = [
  "Hindu", "Muslim", "Christian", "Sikh", "Buddhist", "Jain", "Parsi",
  "Jewish", "Bahai", "Other"
];

/** Caste/Community options */
export const CASTE_OPTIONS: string[] = [
  "General", "OBC", "SC", "ST", "Vaishya", "Kshatriya", "Brahmin",
  "Rajput", "Yadav", "Gujjar", "Jat", "Maheshwari", "Oswal", 
  "Aggarwal", "Khatri", "Arora", "Sindhi", "Saraswat", "Kumaoni",
  "Garhwali", "Other"
];

// ============================================================================
// EDUCATION & CAREER
// ============================================================================

/** Education options */
export const EDUCATION_OPTIONS: string[] = [
  "Below 10th", "10th Pass", "12th Pass", "Diploma", "ITI",
  "Bachelor's Degree", "Master's Degree", "Doctorate/PhD",
  "Professional Degree (CA/CS/CMA)", "Other"
];

/** Occupation options */
export const OCCUPATION_OPTIONS: string[] = [
  "Engineer", "Doctor", "Teacher", "Software Developer", "Business Owner",
  "Manager", "Accountant", "Nurse", "Architect", "Lawyer", "Banker",
  "Chef", "Designer", "Marketing", "Sales", "HR Professional",
  "Civil Services", "Defense", "Police", "Consultant", "Writer",
  "Journalist", "Artist", "Musician", "Actor", "Sports Professional",
  "Self Employed", "Retired", "Student", "Other"
];

/** Income options (annual) */
export const INCOME_OPTIONS: string[] = [
  "No Income", "Below ₹1 Lakh", "₹1-2 Lakh", "₹2-3 Lakh", "₹3-4 Lakh",
  "₹4-5 Lakh", "₹5-7 Lakh", "₹7-10 Lakh", "₹10-15 Lakh", 
  "₹15-20 Lakh", "₹20-25 Lakh", "₹25-50 Lakh", "₹50 Lakh - 1 Crore",
  "Above 1 Crore"
];

// Simplified income options for filters
export const INCOME_FILTER_OPTIONS: string[] = [
  "Below ₹1 LPA", "₹1-3 LPA", "₹3-5 LPA", "₹5-8 LPA", "₹8-10 LPA",
  "₹10-15 LPA", "₹15-20 LPA", "₹20-30 LPA", "₹30-50 LPA", "Above ₹50 LPA"
];

// ============================================================================
// FAMILY INFORMATION
// ============================================================================

/** Siblings count options */
export const SIBLINGS_OPTIONS: string[] = [
  "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"
];

/** Father's occupation options */
export const FATHER_OCCUPATION_OPTIONS: string[] = [
  "Engineer", "Doctor", "Teacher", "Business Owner", "Farmer",
  "Retired Government Employee", "Private Job", "Self Employed",
  "Advocate", "Chartered Accountant", "Architect", "Manager",
  "Pilot", "Armed Forces", "Police", "Politician", "Writer",
  "Consultant", "Driver", "Worker/Laborer", "Not Employed", "Passed Away", "Other"
];

/** Mother's occupation options */
export const MOTHER_OCCUPATION_OPTIONS: string[] = [
  "Housewife", "Teacher", "Doctor", "Nurse", "Business Owner",
  "Government Employee", "Private Job", "Self Employed",
  "Retired Government Employee", "Advocate", "Chartered Accountant",
  "Manager", "Artist", "Writer", "Consultant", "Driver",
  "Worker/Laborer", "Other"
];

/** Family type options */
export const FAMILY_TYPE_OPTIONS: string[] = [
  "Nuclear", "Joint", "Extended Nuclear", "Other"
];

// ============================================================================
// LIFESTYLE
// ============================================================================

/** Diet options */
export const DIET_OPTIONS: string[] = [
  "Vegetarian", "Non-Vegetarian", "Eggetarian", "Vegan", "Jain", 
  "Buddhist", "Halal", "Kosher", "Other"
];

/** Smoking options */
export const SMOKING_OPTIONS: string[] = [
  "No", "Yes", "Occasionally", "Trying to Quit"
];

/** Drinking options */
export const DRINKING_OPTIONS: string[] = [
  "No", "Yes", "Occasionally", "Social Drinker", "Trying to Quit"
];

// ============================================================================
// HOBBIES & INTERESTS (Multi-select)
// ============================================================================

/** Hobbies options (multi-select) */
export const HOBBIES_OPTIONS: string[] = [
  "Reading", "Writing", "Cooking", "Traveling", "Photography",
  "Music", "Dancing", "Singing", "Painting", "Gardening",
  "Fitness", "Yoga", "Running", "Cycling", "Swimming",
  "Trekking", "Gaming", "Movies", "TV Shows", "Shopping",
  "Pets", "Art & Craft", "Fashion", "Technology", "Sports",
  "Volunteering", "Investing", "Health & Wellness"
];

/** Interests options (multi-select) */
export const INTERESTS_OPTIONS: string[] = [
  "Technology", "Sports", "Music", "Movies", "Travel",
  "Fashion", "Cooking", "Fitness", "Reading", "Writing",
  "Photography", "Art", "Dance", "Yoga", "Meditation",
  "Nature", "Adventure", "Gaming", "Business", "Finance",
  "Politics", "Science", "History", "Spirituality", "Social Work",
  "Automobiles", "Food & Dining", "Shopping", "Health & Wellness"
];

// ============================================================================
// KUNDLI / ASTROLOGY
// ============================================================================

/** Manglik status options */
export const MANGLIK_OPTIONS: string[] = [
  "No", "Yes", "Don't Know", "Partial"
];

/** Rashi (Moon Sign) options */
export const RASHI_OPTIONS: string[] = [
  "Mesh (Aries)", "Vrishabh (Taurus)", "Mithun (Gemini)", "Kark (Cancer)",
  "Simha (Leo)", "Kanya (Virgo)", "Tula (Libra)", "Vrishchik (Scorpio)",
  "Dhanu (Sagittarius)", "Makar (Capricorn)", "Kumbh (Aquarius)", "Meen (Pisces)"
];

/** Nakshatra options */
export const NAKSHATRA_OPTIONS: string[] = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", 
  "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", 
  "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha",
  "Shravana", "Dhanishtha", "Shatabhisha", "Purva Bhadrapada", 
  "Uttara Bhadrapada", "Revati"
];

// ============================================================================
// INDIAN CITIES WITH STATES
// ============================================================================

/** Indian cities with states in format "City - State" */
export const LOCATION_OPTIONS: string[] = [
  // Andhra Pradesh
  "Visakhapatnam - Andhra Pradesh", "Vijayawada - Andhra Pradesh", "Guntur - Andhra Pradesh", 
  "Tirupati - Andhra Pradesh", "Nellore - Andhra Pradesh", "Kurnool - Andhra Pradesh",
  "Rajahmundry - Andhra Pradesh", "Kadapa - Andhra Pradesh", "Kakinada - Andhra Pradesh",
  "Anantapur - Andhra Pradesh",
  
  // Arunachal Pradesh
  "Itanagar - Arunachal Pradesh", "Naharlagun - Arunachal Pradesh", "Pasighat - Arunachal Pradesh",
  "Tezu - Arunachal Pradesh", "Roing - Arunachal Pradesh",
  
  // Assam
  "Guwahati - Assam", "Silchar - Assam", "Dibrugarh - Assam", "Jorhat - Assam",
  "Tezpur - Assam", "Bongaigaon - Assam", "Dhubri - Assam", "Nagaon - Assam",
  "Tinsukia - Assam",
  
  // Bihar
  "Patna - Bihar", "Gaya - Bihar", "Bhagalpur - Bihar", "Muzaffarpur - Bihar",
  "Darbhanga - Bihar", "Bihar Sharif - Bihar", "Arrah - Bihar", "Begusarai - Bihar",
  "Katihar - Bihar", "Munger - Bihar", "Purnia - Bihar", "Saharsa - Bihar",
  "Hajipur - Bihar", "Chapra - Bihar", "Danapur - Bihar",
  
  // Chhattisgarh
  "Raipur - Chhattisgarh", "Bhilai - Chhattisgarh", "Bilaspur - Chhattisgarh",
  "Durg - Chhattisgarh", "Rajnandgaon - Chhattisgarh", "Korba - Chhattisgarh",
  "Jagdalpur - Chhattisgarh", "Ambikapur - Chhattisgarh", "Mahasamund - Chhattisgarh",
  "Dhamtari - Chhattisgarh",
  
  // Delhi NCR
  "New Delhi - Delhi NCR", "Old Delhi - Delhi NCR", "South Delhi - Delhi NCR",
  "North Delhi - Delhi NCR", "East Delhi - Delhi NCR", "West Delhi - Delhi NCR",
  "Central Delhi - Delhi NCR", "Dwarka - Delhi NCR", "Rohini - Delhi NCR",
  "Saket - Delhi NCR", "Vasant Kunj - Delhi NCR", "Pitampura - Delhi NCR",
  "Janakpuri - Delhi NCR", "Rajouri Garden - Delhi NCR", "Mayur Vihar - Delhi NCR",
  
  // Goa
  "Panaji - Goa", "Margao - Goa", "Vasco da Gama - Goa", "Mapusa - Goa",
  "Ponda - Goa", "Benaulim - Goa", "Cansaulim - Goa",
  
  // Gujarat
  "Ahmedabad - Gujarat", "Surat - Gujarat", "Vadodara - Gujarat", "Rajkot - Gujarat",
  "Gandhinagar - Gujarat", "Jamnagar - Gujarat", "Junagadh - Gujarat",
  "Bhavnagar - Gujarat", "Nadiad - Gujarat", "Anand - Gujarat", "Morbi - Gujarat",
  "Patan - Gujarat", "Valsad - Gujarat", "Bharuch - Gujarat", "Mehsana - Gujarat",
  "Palanpur - Gujarat", "Himmatnagar - Gujarat", "Godhra - Gujarat", "Kalol - Gujarat",
  "Ankleshwar - Gujarat", "Navsari - Gujarat", "Veraval - Gujarat",
  
  // Haryana
  "Gurgaon - Haryana", "Faridabad - Haryana", "Panipat - Haryana", "Karnal - Haryana",
  "Rohtak - Haryana", "Hisar - Haryana", "Sonipat - Haryana", "Ambala - Haryana",
  "Yamunanagar - Haryana", "Kurukshetra - Haryana", "Panchkula - Haryana",
  "Sirsa - Haryana", "Rewari - Haryana", "Jind - Haryana", "Mahendragarh - Haryana",
  "Bhiwani - Haryana", "Fatehabad - Haryana", "Kaithal - Haryana", "Narnaul - Haryana",
  
  // Himachal Pradesh
  "Shimla - Himachal Pradesh", "Mandi - Himachal Pradesh", "Solan - Himachal Pradesh",
  "Kullu - Himachal Pradesh", "Manali - Himachal Pradesh", "Dharamshala - Himachal Pradesh",
  "Kangra - Himachal Pradesh", "Chamba - Himachal Pradesh", "Bilaspur - Himachal Pradesh",
  "Una - Himachal Pradesh", "Hamirpur - Himachal Pradesh", "Nahan - Himachal Pradesh",
  "Paonta Sahib - Himachal Pradesh",
  
  // Jharkhand
  "Ranchi - Jharkhand", "Jamshedpur - Jharkhand", "Dhanbad - Jharkhand",
  "Bokaro - Jharkhand", "Hazaribagh - Jharkhand", "Deoghar - Jharkhand",
  "Madhupur - Jharkhand", "Giridih - Jharkhand", "Ramgarh - Jharkhand",
  "Chaibasa - Jharkhand", "Dumka - Jharkhand", "Gumla - Jharkhand",
  
  // Karnataka
  "Bangalore - Karnataka", "Mysore - Karnataka", "Hubli - Karnataka", "Mangalore - Karnataka",
  "Belgaum - Karnataka", "Dharwad - Karnataka", "Bellary - Karnataka", "Tumkur - Karnataka",
  "Shimoga - Karnataka", "Udupi - Karnataka", "Hassan - Karnataka", "Bidar - Karnataka",
  "Chitradurga - Karnataka", "Manipal - Karnataka", "Davanagere - Karnataka",
  "Raichur - Karnataka", "Kolar - Karnataka", "Mandya - Karnataka", "Chikmagalur - Karnataka",
  "Haveri - Karnataka", "Bagalkot - Karnataka", "Bijapur - Karnataka",
  
  // Kerala
  "Thiruvananthapuram - Kerala", "Kochi - Kerala", "Kozhikode - Kerala",
  "Thrissur - Kerala", "Kollam - Kerala", "Palakkad - Kerala", "Alappuzha - Kerala",
  "Kannur - Kerala", "Kottayam - Kerala", "Malappuram - Kerala", "Ernakulam - Kerala",
  "Idukki - Kerala", "Wayanad - Kerala", "Kasaragod - Kerala", "Pathanamthitta - Kerala",
  
  // Madhya Pradesh
  "Bhopal - Madhya Pradesh", "Indore - Madhya Pradesh", "Jabalpur - Madhya Pradesh",
  "Gwalior - Madhya Pradesh", "Ujjain - Madhya Pradesh", "Sagar - Madhya Pradesh",
  "Dewas - Madhya Pradesh", "Satna - Madhya Pradesh", "Ratlam - Madhya Pradesh",
  "Rewa - Madhya Pradesh", "Burhanpur - Madhya Pradesh", "Khandwa - Madhya Pradesh",
  "Chhindwara - Madhya Pradesh", "Guna - Madhya Pradesh", "Jhansi - Madhya Pradesh",
  "Mandsaur - Madhya Pradesh", "Neemuch - Madhya Pradesh", "Pithampur - Madhya Pradesh",
  "Mhow - Madhya Pradesh", "Narsinghpur - Madhya Pradesh",
  
  // Maharashtra
  "Mumbai - Maharashtra", "Pune - Maharashtra", "Nagpur - Maharashtra", "Thane - Maharashtra",
  "Nashik - Maharashtra", "Aurangabad - Maharashtra", "Solapur - Maharashtra",
  "Kolhapur - Maharashtra", "Navi Mumbai - Maharashtra", "Sangli - Maharashtra",
  "Amravati - Maharashtra", "Palghar - Maharashtra", "Jalgaon - Maharashtra",
  "Ahmednagar - Maharashtra", "Akola - Maharashtra", "Latur - Maharashtra",
  "Dhule - Maharashtra", "Chandrapur - Maharashtra", "Parbhani - Maharashtra",
  "Panvel - Maharashtra", "Nanded - Maharashtra", "Satara - Maharashtra",
  "Ratnagiri - Maharashtra", "Sindhudurg - Maharashtra", "Wardha - Maharashtra",
  "Gadchiroli - Maharashtra", "Buldhana - Maharashtra", "Washim - Maharashtra",
  "Hingoli - Maharashtra", "Osmanabad - Maharashtra",
  
  // Manipur
  "Imphal - Manipur", "Thoubal - Manipur", "Bishnupur - Manipur",
  "Churachandpur - Manipur", "Kakching - Manipur", "Ukhrul - Manipur",
  "Tamenglong - Manipur", "Chandel - Manipur",
  
  // Meghalaya
  "Shillong - Meghalaya", "Tura - Meghalaya", "Jowai - Meghalaya",
  "Nongstoin - Meghalaya", "Baghmara - Meghalaya", "Williamnagar - Meghalaya",
  "Cherrapunji - Meghalaya",
  
  // Mizoram
  "Aizawl - Mizoram", "Lunglei - Mizoram", "Champhai - Mizoram",
  "Kolasib - Mizoram", "Serchhip - Mizoram", "Lawngtlai - Mizoram",
  "Mamit - Mizoram",
  
  // Nagaland
  "Kohima - Nagaland", "Dimapur - Nagaland", "Mokokchung - Nagaland",
  "Tuensang - Nagaland", "Wokha - Nagaland", "Zunheboto - Nagaland",
  "Phek - Nagaland", "Kiphire - Nagaland",
  
  // Odisha
  "Bhubaneswar - Odisha", "Cuttack - Odisha", "Rourkela - Odisha",
  "Brahmapur - Odisha", "Puri - Odisha", "Sambalpur - Odisha",
  "Balasore - Odisha", "Berhampur - Odisha", "Kendrapara - Odisha",
  "Jajpur - Odisha", "Bhadrak - Odisha", "Balangir - Odisha",
  "Jharsuguda - Odisha", "Baragarh - Odisha", "Angul - Odisha",
  
  // Punjab
  "Ludhiana - Punjab", "Amritsar - Punjab", "Jalandhar - Punjab", "Patiala - Punjab",
  "Bathinda - Punjab", "Mohali - Punjab", "Hoshiarpur - Punjab", "Firozpur - Punjab",
  "Kapurthala - Punjab", "Moga - Punjab", "Pathankot - Punjab", "Abohar - Punjab",
  "Malerkotla - Punjab", "Khanna - Punjab", "Phagwara - Punjab", "Muktsar - Punjab",
  "Fatehgarh Sahib - Punjab", "Sangrur - Punjab", "Tarn Taran - Punjab",
  
  // Rajasthan
  "Jaipur - Rajasthan", "Jodhpur - Rajasthan", "Udaipur - Rajasthan", "Kota - Rajasthan",
  "Bikaner - Rajasthan", "Ajmer - Rajasthan", "Pilani - Rajasthan", "Bhilwara - Rajasthan",
  "Alwar - Rajasthan", "Bharatpur - Rajasthan", "Sikar - Rajasthan",
  "Sri Ganganagar - Rajasthan", "Pali - Rajasthan", "Jhunjhunu - Rajasthan",
  "Chittorgarh - Rajasthan", "Dungarpur - Rajasthan", "Banswara - Rajasthan",
  "Dholpur - Rajasthan", "Kotputali - Rajasthan", "Beawar - Rajasthan",
  "Baran - Rajasthan", "Hanumangarh - Rajasthan", "Jaisalmer - Rajasthan",
  "Jalore - Rajasthan",
  
  // Sikkim
  "Gangtok - Sikkim", "Namchi - Sikkim", "Gyalshing - Sikkim",
  "Soreng - Sikkim", "Pakyong - Sikkim", "Jorethang - Sikkim",
  "Rangpo - Sikkim", "Singtam - Sikkim",
  
  // Tamil Nadu
  "Chennai - Tamil Nadu", "Coimbatore - Tamil Nadu", "Madurai - Tamil Nadu",
  "Tiruchirappalli - Tamil Nadu", "Salem - Tamil Nadu", "Tiruppur - Tamil Nadu",
  "Vellore - Tamil Nadu", "Erode - Tamil Nadu", "Tirunelveli - Tamil Nadu",
  "Thoothukudi - Tamil Nadu", "Dindigul - Tamil Nadu", "Thanjavur - Tamil Nadu",
  "Nagercoil - Tamil Nadu", "Kanchipuram - Tamil Nadu", "Karur - Tamil Nadu",
  "Cuddalore - Tamil Nadu", "Tiruvannamalai - Tamil Nadu", "Ramanathapuram - Tamil Nadu",
  "Virudhunagar - Tamil Nadu", "Namakkal - Tamil Nadu", "Theni - Tamil Nadu",
  "Ariyalur - Tamil Nadu", "Perambalur - Tamil Nadu", "Nagapattinam - Tamil Nadu",
  
  // Telangana
  "Hyderabad - Telangana", "Warangal - Telangana", "Karimnagar - Telangana",
  "Khammam - Telangana", "Secunderabad - Telangana", "Nizamabad - Telangana",
  "Ramagundam - Telangana", "Mahbubnagar - Telangana", "Suryapet - Telangana",
  "Jagtial - Telangana", "Siddipet - Telangana", "Miryalaguda - Telangana",
  "Koratla - Telangana", "Kothakota - Telangana", "Kamareddy - Telangana",
  
  // Tripura
  "Agartala - Tripura", "Udaipur - Tripura", "Dharmanagar - Tripura",
  "Kailasahar - Tripura", "Belonia - Tripura", "Sabroom - Tripura",
  "Ranir Bazar - Tripura",
  
  // Uttar Pradesh
  "Lucknow - Uttar Pradesh", "Kanpur - Uttar Pradesh", "Ghaziabad - Uttar Pradesh",
  "Agra - Uttar Pradesh", "Varanasi - Uttar Pradesh", "Meerut - Uttar Pradesh",
  "Allahabad - Uttar Pradesh", "Aligarh - Uttar Pradesh", "Bareilly - Uttar Pradesh",
  "Moradabad - Uttar Pradesh", "Saharanpur - Uttar Pradesh", "Gorakhpur - Uttar Pradesh",
  "Noida - Uttar Pradesh", "Firozabad - Uttar Pradesh", "Jhansi - Uttar Pradesh",
  "Mathura - Uttar Pradesh", "Rampur - Uttar Pradesh", "Muzaffarnagar - Uttar Pradesh",
  "Shahjahanpur - Uttar Pradesh", "Ayodhya - Uttar Pradesh", "Azamgarh - Uttar Pradesh",
  "Bulandshahr - Uttar Pradesh", "Etawah - Uttar Pradesh", "Fatehpur - Uttar Pradesh",
  "Gonda - Uttar Pradesh", "Hapur - Uttar Pradesh", "Hardoi - Uttar Pradesh",
  "Jaunpur - Uttar Pradesh", "Raebareli - Uttar Pradesh", "Sultanpur - Uttar Pradesh",
  
  // Uttarakhand
  "Dehradun - Uttarakhand", "Haridwar - Uttarakhand", "Roorkee - Uttarakhand",
  "Haldwani - Uttarakhand", "Rudrapur - Uttarakhand", "Kashipur - Uttarakhand",
  "Rishikesh - Uttarakhand", "Nainital - Uttarakhand", "Almora - Uttarakhand",
  "Mussoorie - Uttarakhand", "Kotdwar - Uttarakhand", "Lansdowne - Uttarakhand",
  "Chamoli - Uttarakhand", "Tehri - Uttarakhand", "Uttarkashi - Uttarakhand",
  "Ranikhet - Uttarakhand", "Kausani - Uttarakhand", "Bageshwar - Uttarakhand",
  
  // West Bengal
  "Kolkata - West Bengal", "Asansol - West Bengal", "Siliguri - West Bengal",
  "Durgapur - West Bengal", "Bardhaman - West Bengal", "Malda - West Bengal",
  "Kharagpur - West Bengal", "Howrah - West Bengal", "Darjeeling - West Bengal",
  "Berhampore - West Bengal", "Baharampur - West Bengal", "Krishnanagar - West Bengal",
  "Kalyani - West Bengal", "Haldia - West Bengal", "Bongaon - West Bengal",
  "Shibpur - West Bengal", "Murshidabad - West Bengal", "North 24 Parganas - West Bengal",
  "South 24 Parganas - West Bengal", "Hooghly - West Bengal", "Purba Medinipur - West Bengal",
  "Paschim Medinipur - West Bengal", "Nadia - West Bengal", "Birbhum - West Bengal",
  "Bankura - West Bengal", "Purulia - West Bengal", "Jhargram - West Bengal",
  
  // Union Territories
  "Chandigarh - Chandigarh", "Puducherry - Pondicherry", "Lakshadweep - Lakshadweep",
  "Andaman & Nicobar - Andaman & Nicobar Islands", "Srinagar - Jammu & Kashmir",
  "Jammu - Jammu & Kashmir", "Leh - Ladakh", "Shimla - Himachal Pradesh",
  "Daman - Daman & Diu", "Diu - Daman & Diu"
];

// ============================================================================
// UNIFIED EXPORT - All Options Object
// ============================================================================

/**
 * All dropdown options consolidated into a single object
 * For easy import and use throughout the application
 */
export const DROPDOWN_OPTIONS = {
  // Basic
  age: AGE_OPTIONS,
  height: HEIGHT_OPTIONS,
  
  // Personal
  religion: RELIGION_OPTIONS,
  caste: CASTE_OPTIONS,
  
  // Location
  location: LOCATION_OPTIONS,
  
  // Education & Career
  education: EDUCATION_OPTIONS,
  occupation: OCCUPATION_OPTIONS,
  income: INCOME_OPTIONS,
  
  // Family
  siblings: SIBLINGS_OPTIONS,
  fatherOccupation: FATHER_OCCUPATION_OPTIONS,
  motherOccupation: MOTHER_OCCUPATION_OPTIONS,
  familyType: FAMILY_TYPE_OPTIONS,
  
  // Lifestyle
  diet: DIET_OPTIONS,
  smoking: SMOKING_OPTIONS,
  drinking: DRINKING_OPTIONS,
  
  // Hobbies & Interests
  hobbies: HOBBIES_OPTIONS,
  interests: INTERESTS_OPTIONS,
  
  // Kundli/Astrology
  manglik: MANGLIK_OPTIONS,
  rashi: RASHI_OPTIONS,
  nakshatra: NAKSHATRA_OPTIONS,
} as const;

/** Type for dropdown option keys */
export type DropdownOptionKey = keyof typeof DROPDOWN_OPTIONS;
