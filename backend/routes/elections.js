const express = require('express');
const router = express.Router();
const { runQuery, getOne, getAll } = require('../db/database');

// GET all elections
router.get('/', async (req, res) => {
  try {
    const elections = await getAll('SELECT * FROM elections ORDER BY district, office');

    const electionsWithDetails = await Promise.all(
      elections.map(async (election) => {
        const [zipcodes, candidates] = await Promise.all([
          getAll('SELECT zipcode FROM zipcodes WHERE election_id = ?', [election.id]),
          getAll(`
            SELECT c.id, c.name, c.position, c.party
            FROM candidates c
            INNER JOIN election_candidates ec ON c.id = ec.candidate_id
            WHERE ec.election_id = ?
          `, [election.id])
        ]);

        return {
          id: election.id,
          office: election.office,
          description: election.description,
          district: election.district,
          electionDate: election.election_date,
          zipcodes: zipcodes.map(z => z.zipcode),
          candidates: candidates
        };
      })
    );

    res.json(electionsWithDetails);
  } catch (error) {
    console.error('Error fetching elections:', error);
    res.status(500).json({ error: 'Failed to fetch elections' });
  }
});

// GET elections by zipcode
router.get('/zipcode/:zipcode', async (req, res) => {
  try {
    const { zipcode } = req.params;

    const elections = await getAll(`
      SELECT DISTINCT e.*
      FROM elections e
      INNER JOIN zipcodes z ON e.id = z.election_id
      WHERE z.zipcode = ?
      ORDER BY e.district, e.office
    `, [zipcode]);

    const electionsWithDetails = await Promise.all(
      elections.map(async (election) => {
        const candidates = await getAll(`
          SELECT c.id, c.name, c.position, c.party, c.photo_url
          FROM candidates c
          INNER JOIN election_candidates ec ON c.id = ec.candidate_id
          WHERE ec.election_id = ?
        `, [election.id]);

        return {
          id: election.id,
          office: election.office,
          description: election.description,
          district: election.district,
          electionDate: election.election_date,
          candidates: candidates
        };
      })
    );

    res.json(electionsWithDetails);
  } catch (error) {
    console.error('Error fetching elections by zipcode:', error);
    res.status(500).json({ error: 'Failed to fetch elections' });
  }
});

// POST create new election
router.post('/', async (req, res) => {
  try {
    const { office, description, district, electionDate, zipcodes, candidateIds } = req.body;

    // Insert election
    const result = await runQuery(
      'INSERT INTO elections (office, description, district, election_date) VALUES (?, ?, ?, ?)',
      [office, description, district, electionDate]
    );

    const electionId = result.id;

    // Insert zipcodes
    if (zipcodes && zipcodes.length > 0) {
      for (const zipcode of zipcodes) {
        await runQuery(
          'INSERT INTO zipcodes (election_id, zipcode) VALUES (?, ?)',
          [electionId, zipcode]
        );
      }
    }

    // Link candidates
    if (candidateIds && candidateIds.length > 0) {
      for (const candidateId of candidateIds) {
        await runQuery(
          'INSERT INTO election_candidates (election_id, candidate_id) VALUES (?, ?)',
          [electionId, candidateId]
        );
      }
    }

    res.status(201).json({ id: electionId, message: 'Election created successfully' });
  } catch (error) {
    console.error('Error creating election:', error);
    res.status(500).json({ error: 'Failed to create election' });
  }
});

// PUT update election
router.put('/:id', async (req, res) => {
  try {
    const electionId = req.params.id;
    const { office, description, district, electionDate, zipcodes, candidateIds } = req.body;

    // Update election
    await runQuery(
      'UPDATE elections SET office = ?, description = ?, district = ?, election_date = ? WHERE id = ?',
      [office, description, district, electionDate, electionId]
    );

    // Delete and re-insert zipcodes and candidates
    await runQuery('DELETE FROM zipcodes WHERE election_id = ?', [electionId]);
    await runQuery('DELETE FROM election_candidates WHERE election_id = ?', [electionId]);

    if (zipcodes && zipcodes.length > 0) {
      for (const zipcode of zipcodes) {
        await runQuery(
          'INSERT INTO zipcodes (election_id, zipcode) VALUES (?, ?)',
          [electionId, zipcode]
        );
      }
    }

    if (candidateIds && candidateIds.length > 0) {
      for (const candidateId of candidateIds) {
        await runQuery(
          'INSERT INTO election_candidates (election_id, candidate_id) VALUES (?, ?)',
          [electionId, candidateId]
        );
      }
    }

    res.json({ message: 'Election updated successfully' });
  } catch (error) {
    console.error('Error updating election:', error);
    res.status(500).json({ error: 'Failed to update election' });
  }
});

// DELETE election
router.delete('/:id', async (req, res) => {
  try {
    await runQuery('DELETE FROM elections WHERE id = ?', [req.params.id]);
    res.json({ message: 'Election deleted successfully' });
  } catch (error) {
    console.error('Error deleting election:', error);
    res.status(500).json({ error: 'Failed to delete election' });
  }
});

module.exports = router;
