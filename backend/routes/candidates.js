const express = require('express');
const router = express.Router();
const { runQuery, getOne, getAll } = require('../db/database');
const { authenticateToken } = require('../middleware/auth');

// GET all candidates
router.get('/', async (req, res) => {
  try {
    const candidates = await getAll('SELECT * FROM candidates ORDER BY name');

    // Fetch related data for each candidate
    const candidatesWithDetails = await Promise.all(
      candidates.map(async (candidate) => {
        const [education, experience, endorsements, policies, socialMedia, recentPosts] = await Promise.all([
          getAll('SELECT * FROM education WHERE candidate_id = ?', [candidate.id]),
          getAll('SELECT * FROM experience WHERE candidate_id = ?', [candidate.id]),
          getAll('SELECT organization FROM endorsements WHERE candidate_id = ?', [candidate.id]),
          getAll('SELECT title, description, priority FROM policies WHERE candidate_id = ?', [candidate.id]),
          getOne('SELECT * FROM social_media WHERE candidate_id = ?', [candidate.id]),
          getAll('SELECT * FROM recent_posts WHERE candidate_id = ? ORDER BY date DESC', [candidate.id])
        ]);

        return {
          id: candidate.id.toString(),
          name: candidate.name,
          position: candidate.position,
          party: candidate.party,
          photoUrl: candidate.photo_url,
          biography: candidate.biography,
          education: education.map(e => `${e.degree || ''} ${e.institution} ${e.year || ''}`.trim()),
          experience: experience.map(e => e.title),
          endorsements: endorsements.map(e => e.organization),
          policies: policies,
          socialMedia: socialMedia || {},
          recentPosts: recentPosts || []
        };
      })
    );

    res.json(candidatesWithDetails);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ error: 'Failed to fetch candidates' });
  }
});

// GET single candidate by ID
router.get('/:id', async (req, res) => {
  try {
    const candidate = await getOne('SELECT * FROM candidates WHERE id = ?', [req.params.id]);

    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    const [education, experience, endorsements, policies, socialMedia, recentPosts] = await Promise.all([
      getAll('SELECT * FROM education WHERE candidate_id = ?', [candidate.id]),
      getAll('SELECT * FROM experience WHERE candidate_id = ?', [candidate.id]),
      getAll('SELECT organization FROM endorsements WHERE candidate_id = ?', [candidate.id]),
      getAll('SELECT title, description, priority FROM policies WHERE candidate_id = ?', [candidate.id]),
      getOne('SELECT * FROM social_media WHERE candidate_id = ?', [candidate.id]),
      getAll('SELECT * FROM recent_posts WHERE candidate_id = ? ORDER BY date DESC', [candidate.id])
    ]);

    const candidateWithDetails = {
      id: candidate.id.toString(),
      name: candidate.name,
      position: candidate.position,
      party: candidate.party,
      photoUrl: candidate.photo_url,
      biography: candidate.biography,
      education: education.map(e => `${e.degree || ''} ${e.institution} ${e.year || ''}`.trim()),
      experience: experience.map(e => e.title),
      endorsements: endorsements.map(e => e.organization),
      policies: policies,
      socialMedia: socialMedia || {},
      recentPosts: recentPosts || []
    };

    res.json(candidateWithDetails);
  } catch (error) {
    console.error('Error fetching candidate:', error);
    res.status(500).json({ error: 'Failed to fetch candidate' });
  }
});

// POST create new candidate
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, position, party, photoUrl, biography, education, experience, endorsements, policies, socialMedia, recentPosts, electionInfo } = req.body;

    // Insert candidate
    const result = await runQuery(
      'INSERT INTO candidates (name, position, party, photo_url, biography) VALUES (?, ?, ?, ?, ?)',
      [name, position, party, photoUrl, biography]
    );

    const candidateId = result.id;

    // Insert related data
    if (education && education.length > 0) {
      for (const edu of education) {
        await runQuery(
          'INSERT INTO education (candidate_id, institution) VALUES (?, ?)',
          [candidateId, edu]
        );
      }
    }

    if (experience && experience.length > 0) {
      for (const exp of experience) {
        await runQuery(
          'INSERT INTO experience (candidate_id, title) VALUES (?, ?)',
          [candidateId, exp]
        );
      }
    }

    if (endorsements && endorsements.length > 0) {
      for (const endorsement of endorsements) {
        await runQuery(
          'INSERT INTO endorsements (candidate_id, organization) VALUES (?, ?)',
          [candidateId, endorsement]
        );
      }
    }

    if (policies && policies.length > 0) {
      for (const policy of policies) {
        await runQuery(
          'INSERT INTO policies (candidate_id, title, description, priority) VALUES (?, ?, ?, ?)',
          [candidateId, policy.title, policy.description, policy.priority || 50]
        );
      }
    }

    if (socialMedia) {
      await runQuery(
        'INSERT INTO social_media (candidate_id, website, email, twitter, facebook, instagram) VALUES (?, ?, ?, ?, ?, ?)',
        [candidateId, socialMedia.website, socialMedia.email, socialMedia.twitter, socialMedia.facebook, socialMedia.instagram]
      );
    }

    if (recentPosts && recentPosts.length > 0) {
      for (const post of recentPosts) {
        await runQuery(
          'INSERT INTO recent_posts (candidate_id, date, platform, content, link) VALUES (?, ?, ?, ?, ?)',
          [candidateId, post.date, post.platform, post.content, post.link]
        );
      }
    }

    // Handle election assignment
    if (electionInfo && electionInfo.district && electionInfo.office && electionInfo.zipcodes && electionInfo.zipcodes.length > 0) {
      // Check if election exists, if not create it
      let election = await getOne(
        'SELECT id FROM elections WHERE district = ? AND office = ?',
        [electionInfo.district, electionInfo.office]
      );

      if (!election) {
        // Create new election
        const electionResult = await runQuery(
          'INSERT INTO elections (office, district, description) VALUES (?, ?, ?)',
          [electionInfo.office, electionInfo.district, `Election for ${electionInfo.office}`]
        );
        election = { id: electionResult.id };

        // Add zipcodes to election
        for (const zipcode of electionInfo.zipcodes) {
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

    res.status(201).json({ id: candidateId, message: 'Candidate created successfully' });
  } catch (error) {
    console.error('Error creating candidate:', error);
    res.status(500).json({ error: 'Failed to create candidate' });
  }
});

// PUT update candidate
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const candidateId = req.params.id;
    const { name, position, party, photoUrl, biography, education, experience, endorsements, policies, socialMedia, recentPosts, electionInfo } = req.body;

    // Update candidate
    await runQuery(
      'UPDATE candidates SET name = ?, position = ?, party = ?, photo_url = ?, biography = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [name, position, party, photoUrl, biography, candidateId]
    );

    // Delete and re-insert related data (simpler than updating)
    await runQuery('DELETE FROM education WHERE candidate_id = ?', [candidateId]);
    await runQuery('DELETE FROM experience WHERE candidate_id = ?', [candidateId]);
    await runQuery('DELETE FROM endorsements WHERE candidate_id = ?', [candidateId]);
    await runQuery('DELETE FROM policies WHERE candidate_id = ?', [candidateId]);
    await runQuery('DELETE FROM recent_posts WHERE candidate_id = ?', [candidateId]);

    // Re-insert related data
    if (education && education.length > 0) {
      for (const edu of education) {
        await runQuery(
          'INSERT INTO education (candidate_id, institution) VALUES (?, ?)',
          [candidateId, edu]
        );
      }
    }

    if (experience && experience.length > 0) {
      for (const exp of experience) {
        await runQuery(
          'INSERT INTO experience (candidate_id, title) VALUES (?, ?)',
          [candidateId, exp]
        );
      }
    }

    if (endorsements && endorsements.length > 0) {
      for (const endorsement of endorsements) {
        await runQuery(
          'INSERT INTO endorsements (candidate_id, organization) VALUES (?, ?)',
          [candidateId, endorsement]
        );
      }
    }

    if (policies && policies.length > 0) {
      for (const policy of policies) {
        await runQuery(
          'INSERT INTO policies (candidate_id, title, description, priority) VALUES (?, ?, ?, ?)',
          [candidateId, policy.title, policy.description, policy.priority || 50]
        );
      }
    }

    // Update or insert social media
    if (socialMedia) {
      const existing = await getOne('SELECT id FROM social_media WHERE candidate_id = ?', [candidateId]);
      if (existing) {
        await runQuery(
          'UPDATE social_media SET website = ?, email = ?, twitter = ?, facebook = ?, instagram = ? WHERE candidate_id = ?',
          [socialMedia.website, socialMedia.email, socialMedia.twitter, socialMedia.facebook, socialMedia.instagram, candidateId]
        );
      } else {
        await runQuery(
          'INSERT INTO social_media (candidate_id, website, email, twitter, facebook, instagram) VALUES (?, ?, ?, ?, ?, ?)',
          [candidateId, socialMedia.website, socialMedia.email, socialMedia.twitter, socialMedia.facebook, socialMedia.instagram]
        );
      }
    }

    if (recentPosts && recentPosts.length > 0) {
      for (const post of recentPosts) {
        await runQuery(
          'INSERT INTO recent_posts (candidate_id, date, platform, content, link) VALUES (?, ?, ?, ?, ?)',
          [candidateId, post.date, post.platform, post.content, post.link]
        );
      }
    }

    // Update election assignment
    if (electionInfo && electionInfo.district && electionInfo.office && electionInfo.zipcodes && electionInfo.zipcodes.length > 0) {
      // Remove old election associations
      await runQuery('DELETE FROM election_candidates WHERE candidate_id = ?', [candidateId]);

      // Check if election exists, if not create it
      let election = await getOne(
        'SELECT id FROM elections WHERE district = ? AND office = ?',
        [electionInfo.district, electionInfo.office]
      );

      if (!election) {
        // Create new election
        const electionResult = await runQuery(
          'INSERT INTO elections (office, district, description) VALUES (?, ?, ?)',
          [electionInfo.office, electionInfo.district, `Election for ${electionInfo.office}`]
        );
        election = { id: electionResult.id };

        // Add zipcodes to election
        for (const zipcode of electionInfo.zipcodes) {
          await runQuery(
            'INSERT INTO zipcodes (election_id, zipcode) VALUES (?, ?)',
            [election.id, zipcode]
          );
        }
      } else {
        // Update zipcodes for existing election
        await runQuery('DELETE FROM zipcodes WHERE election_id = ?', [election.id]);
        for (const zipcode of electionInfo.zipcodes) {
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

    res.json({ message: 'Candidate updated successfully' });
  } catch (error) {
    console.error('Error updating candidate:', error);
    res.status(500).json({ error: 'Failed to update candidate' });
  }
});

// DELETE candidate
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await runQuery('DELETE FROM candidates WHERE id = ?', [req.params.id]);
    res.json({ message: 'Candidate deleted successfully' });
  } catch (error) {
    console.error('Error deleting candidate:', error);
    res.status(500).json({ error: 'Failed to delete candidate' });
  }
});

module.exports = router;
