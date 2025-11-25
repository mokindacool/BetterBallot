const { runQuery, getAll, getOne } = require('./database');

const candidatesData = [
  {
    id: '1',
    name: 'Kate Harrison',
    position: 'Mayor',
    party: 'Democrat',
    photoUrl: null,
    biography: 'Kate Harrison has served on the Berkeley City Council since 2017, representing Downtown Berkeley and the UC Berkeley campus area in District 4. She has been a strong advocate for affordable housing, climate action, and progressive policies.',
    education: [
      'UC Berkeley, Master of Public Policy',
      'Yale University, BA in Political Science'
    ],
    experience: [
      'Berkeley City Council, District 4 (2017-Present)',
      'Budget and Finance Policy Committee Chair',
      'Public Works Commission (2012-2016)',
      'Senior Analyst, Berkeley City Auditors Office (2008-2012)'
    ],
    endorsements: [
      'Berkeley Progressive Alliance',
      'Berkeley Tenants Union',
      'Sierra Club',
      'Berkeley Citizens Action'
    ],
    policies: [
      {
        title: 'Affordable Housing',
        description: 'Expand affordable housing by requiring higher inclusionary percentages in new developments and protecting existing tenants from displacement.',
        priority: 90
      },
      {
        title: 'Climate Action',
        description: 'Implement Berkeleys Climate Action Plan to achieve carbon neutrality by 2030, including electrification of buildings and transportation.',
        priority: 85
      },
      {
        title: 'Public Safety',
        description: 'Reform police practices and invest in community-based crisis response for mental health emergencies and non-violent incidents.',
        priority: 80
      },
      {
        title: 'Homelessness',
        description: 'Expand shelter capacity and permanent supportive housing while providing comprehensive services to address root causes of homelessness.',
        priority: 95
      }
    ],
    socialMedia: {
      website: 'https://www.kateharrison.info',
      email: 'kate@kateharrison.info',
      twitter: 'https://twitter.com/KateHarrisonD4',
      facebook: 'https://facebook.com/KateHarrisonD4',
      instagram: 'https://instagram.com/KateHarrisonD4'
    },
    recentPosts: [
      {
        date: 'October 12, 2024',
        platform: 'Twitter',
        content: 'Join us this Saturday for our campaign kickoff at Civic Center Park! Well be discussing our vision for Berkeleys future.',
        link: 'https://twitter.com/KateHarrisonD4/status/1447'
      },
      {
        date: 'October 8, 2024',
        platform: 'Facebook',
        content: 'Today the City Council unanimously passed our proposal to expand affordable housing requirements. This is a big win for working families in Berkeley!',
        link: 'https://facebook.com/KateHarrisonD4/posts/2345'
      }
    ],
    electionInfo: {
      district: 'Citywide',
      zipcodes: ['94701', '94702', '94703', '94704', '94705', '94707', '94708', '94709', '94710', '94720'],
      office: 'Mayor'
    }
  },
  {
    id: '2',
    name: 'Terry Taplin',
    position: 'City Council District 2',
    party: 'Democrat',
    photoUrl: null,
    biography: 'Terry Taplin is a poet, community organizer, and transit advocate who has lived in West Berkeley for over 15 years. As a renter and public transit rider, he understands the challenges facing working-class residents.',
    education: [
      'UC Berkeley, BA in English Literature',
      'City College of San Francisco, AA in Humanities'
    ],
    experience: [
      'Berkeley Transportation Commission (2018-2022)',
      'Berkeley Poetry Festival Organizer (2016-2020)',
      'West Berkeley Neighborhood Association Board Member'
    ],
    endorsements: [
      'Berkeley Democratic Club',
      'East Bay Young Democrats',
      'Former Mayor Tom Bates'
    ],
    policies: [
      {
        title: 'Transportation',
        description: 'Improve public transit, expand bike lanes, and create a more walkable West Berkeley with better connections to the waterfront.',
        priority: 90
      },
      {
        title: 'Housing',
        description: 'Increase housing production along transit corridors while protecting existing affordable units and preventing displacement.',
        priority: 85
      }
    ],
    socialMedia: {
      website: 'https://www.terrytaplin.com',
      email: 'info@terrytaplin.com',
      twitter: 'https://twitter.com/TerryTaplin',
      facebook: 'https://facebook.com/TerryTaplinForBerkeley'
    },
    recentPosts: [],
    electionInfo: {
      district: 'District 2',
      zipcodes: ['94702', '94703'],
      office: 'City Council District 2'
    }
  },
  {
    id: '9',
    name: "Shoshana O'Keefe",
    position: 'City Council District 5',
    party: 'Democrat',
    photoUrl: null,
    biography: "Shoshana O'Keefe is a housing advocate and community organizer focused on affordability and climate action in Berkeley.",
    education: [
      'UC Berkeley, Master in City Planning',
      'Brown University, BA in Urban Studies'
    ],
    experience: [
      'Berkeley Housing Advisory Commission (2019-Present)',
      'Climate Action Coalition Coordinator (2018-2022)',
      'Affordable Housing Developer (2015-Present)'
    ],
    endorsements: [
      'Berkeley Tenants Union',
      'Sierra Club',
      'Berkeley Progressive Alliance'
    ],
    policies: [
      {
        title: 'Affordable Housing',
        description: 'Create more affordable housing for working families, seniors, and students through inclusive zoning and anti-displacement policies.',
        priority: 95
      },
      {
        title: 'Climate Justice',
        description: 'Implement Berkeleys Climate Action Plan with an emphasis on equity and ensuring environmental benefits reach all neighborhoods.',
        priority: 90
      },
      {
        title: 'Transit and Mobility',
        description: 'Improve public transit access, expand bike infrastructure, and make North Berkeley more walkable and accessible.',
        priority: 85
      }
    ],
    socialMedia: {
      website: 'https://www.shoshanaokeefe.org',
      email: 'shoshana@shoshanaokeefe.org',
      twitter: 'https://twitter.com/ShoshanaOKeefe',
      instagram: 'https://instagram.com/shoshana4berkeley',
      facebook: 'https://facebook.com/ShoshanaOKeefeForBerkeley'
    },
    recentPosts: [
      {
        date: 'October 15, 2024',
        platform: 'Instagram',
        content: 'Thanks to everyone who joined our community forum on housing affordability last night! Great discussion on practical solutions for Berkeley.',
        link: 'https://instagram.com/p/shoshana4berkeley/12345'
      },
      {
        date: 'October 10, 2024',
        platform: 'Twitter',
        content: 'Excited to announce our endorsement from the Berkeley Tenants Union! Looking forward to working together to protect renters and expand affordable housing.',
        link: 'https://twitter.com/ShoshanaOKeefe/status/54321'
      }
    ],
    electionInfo: {
      district: 'District 5',
      zipcodes: ['94707', '94708', '94709'],
      office: 'City Council District 5'
    }
  },
  {
    id: '6',
    name: 'Logan Bowle',
    position: 'Mayor',
    party: 'Independent',
    photoUrl: null,
    biography: 'Logan Bowle is a community organizer and housing advocate with extensive experience working with nonprofit organizations. His campaign focuses on affordable housing solutions and community-led development.',
    education: [],
    experience: [],
    endorsements: [],
    policies: [],
    socialMedia: {
      website: 'https://www.loganbowle.org',
      email: 'logan@loganbowle.org',
      twitter: 'https://twitter.com/LoganBowle'
    },
    recentPosts: [],
    electionInfo: {
      district: 'Citywide',
      zipcodes: ['94701', '94702', '94703', '94704', '94705', '94707', '94708', '94709', '94710', '94720'],
      office: 'Mayor'
    }
  },
  {
    id: '3',
    name: 'Ben Bartlett',
    position: 'City Council District 3',
    party: 'Democrat',
    photoUrl: null,
    biography: 'Ben Bartlett is the incumbent City Councilmember for District 3, representing South Berkeley. A third-generation Berkeley resident, he has focused on affordable housing, environmental justice, and economic opportunity during his first term.',
    education: [],
    experience: [],
    endorsements: [],
    policies: [],
    socialMedia: {
      website: 'https://www.benbartlett.com',
      email: 'info@benbartlett.com'
    },
    recentPosts: [],
    electionInfo: {
      district: 'District 3',
      zipcodes: ['94703', '94704'],
      office: 'City Council District 3'
    }
  },
  {
    id: '8',
    name: 'Nilang Gor',
    position: 'City Council District 5',
    party: 'Democrat',
    photoUrl: null,
    biography: 'Nilang Gor is a scientist and educator committed to environmental justice and community-led solutions to Berkeleys challenges.',
    education: [],
    experience: [],
    endorsements: [],
    policies: [],
    socialMedia: {
      website: 'https://www.nilanggor.com',
      email: 'nilang@nilanggor.com',
      facebook: 'https://facebook.com/NilangGorForBerkeley'
    },
    recentPosts: [],
    electionInfo: {
      district: 'District 5',
      zipcodes: ['94707', '94708', '94709'],
      office: 'City Council District 5'
    }
  },
  {
    id: '11',
    name: 'Brent Blackaby',
    position: 'City Council District 6',
    party: 'Democrat',
    photoUrl: null,
    biography: 'Brent Blackaby is a nonprofit executive and parent who has lived in Berkeley for over 20 years. He is focused on public safety, supporting local businesses, and improving city services.',
    education: [],
    experience: [],
    endorsements: [],
    policies: [],
    socialMedia: {
      website: 'https://www.brentblackaby.com',
      email: 'brent@brentblackaby.com',
      facebook: 'https://facebook.com/BlackabyForBerkeley'
    },
    recentPosts: [],
    electionInfo: {
      district: 'District 6',
      zipcodes: ['94707', '94708'],
      office: 'City Council District 6'
    }
  },
  {
    id: '12',
    name: 'Andy Katz',
    position: 'City Council District 6',
    party: 'Democrat',
    photoUrl: null,
    biography: 'Andy Katz is an environmental attorney and public health advocate who has served on the East Bay Municipal Utility District Board since 2006. He is focused on infrastructure, climate resilience, and public health.',
    education: [],
    experience: [],
    endorsements: [],
    policies: [],
    socialMedia: {
      website: 'https://www.andykatz.org',
      email: 'andy@andykatz.org',
      twitter: 'https://twitter.com/AndyKatzBerkeley'
    },
    recentPosts: [],
    electionInfo: {
      district: 'District 6',
      zipcodes: ['94707', '94708'],
      office: 'City Council District 6'
    }
  }
];

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    // Check if candidates already exist
    const existingCandidates = await getAll('SELECT COUNT(*) as count FROM candidates');
    if (existingCandidates[0].count > 0) {
      console.log('Database already contains candidates. Skipping seed.');
      return;
    }

    // Insert candidates
    for (const candidate of candidatesData) {
      console.log(`Inserting candidate: ${candidate.name}`);

      // Insert candidate
      const result = await runQuery(
        'INSERT INTO candidates (name, position, party, photo_url, biography) VALUES (?, ?, ?, ?, ?)',
        [candidate.name, candidate.position, candidate.party, candidate.photoUrl, candidate.biography]
      );

      const candidateId = result.id;

      // Insert education
      for (const edu of candidate.education || []) {
        await runQuery(
          'INSERT INTO education (candidate_id, institution) VALUES (?, ?)',
          [candidateId, edu]
        );
      }

      // Insert experience
      for (const exp of candidate.experience || []) {
        await runQuery(
          'INSERT INTO experience (candidate_id, title) VALUES (?, ?)',
          [candidateId, exp]
        );
      }

      // Insert endorsements
      for (const endorsement of candidate.endorsements || []) {
        await runQuery(
          'INSERT INTO endorsements (candidate_id, organization) VALUES (?, ?)',
          [candidateId, endorsement]
        );
      }

      // Insert policies
      for (const policy of candidate.policies || []) {
        await runQuery(
          'INSERT INTO policies (candidate_id, title, description, priority) VALUES (?, ?, ?, ?)',
          [candidateId, policy.title, policy.description, policy.priority]
        );
      }

      // Insert social media
      if (candidate.socialMedia) {
        await runQuery(
          'INSERT INTO social_media (candidate_id, website, email, twitter, facebook, instagram) VALUES (?, ?, ?, ?, ?, ?)',
          [candidateId, candidate.socialMedia.website, candidate.socialMedia.email, candidate.socialMedia.twitter, candidate.socialMedia.facebook, candidate.socialMedia.instagram]
        );
      }

      // Insert recent posts
      for (const post of candidate.recentPosts || []) {
        await runQuery(
          'INSERT INTO recent_posts (candidate_id, date, platform, content, link) VALUES (?, ?, ?, ?, ?)',
          [candidateId, post.date, post.platform, post.content, post.link]
        );
      }

      // Handle election assignment
      if (candidate.electionInfo && candidate.electionInfo.district && candidate.electionInfo.office && candidate.electionInfo.zipcodes && candidate.electionInfo.zipcodes.length > 0) {
        // Check if election exists, if not create it
        let election = await getOne(
          'SELECT id FROM elections WHERE district = ? AND office = ?',
          [candidate.electionInfo.district, candidate.electionInfo.office]
        );

        if (!election) {
          // Create new election
          const electionResult = await runQuery(
            'INSERT INTO elections (office, district, description) VALUES (?, ?, ?)',
            [candidate.electionInfo.office, candidate.electionInfo.district, `Election for ${candidate.electionInfo.office}`]
          );
          election = { id: electionResult.id };

          // Add zipcodes to election
          for (const zipcode of candidate.electionInfo.zipcodes) {
            await runQuery(
              'INSERT INTO zipcodes (election_id, zipcode) VALUES (?, ?)',
              [election.id, zipcode]
            );
          }
        }

        // Link candidate to election
        await runQuery(
          'INSERT OR IGNORE INTO election_candidates (election_id, candidate_id) VALUES (?, ?)',
          [election.id, candidateId]
        );
      }
    }

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

// Run seed if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Seed script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seed script failed:', error);
      process.exit(1);
    });
}

module.exports = { seedDatabase };
