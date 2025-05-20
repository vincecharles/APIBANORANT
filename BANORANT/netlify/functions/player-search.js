import fetch from 'node-fetch';

export const handler = async (event) => {
  const { name, tag } = event.queryStringParameters;
  const apiKey = process.env.VALORANT_API_KEY;

  if (!name || !tag) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing name or tag' }),
    };
  }

  const url = `https://public-api.tracker.gg/v2/valorant/standard/profile/riot/${encodeURIComponent(name)}%23${encodeURIComponent(tag)}`;

  try {
    const response = await fetch(url, {
      headers: { 'TRN-Api-Key': apiKey }
    });
    const data = await response.json();
    console.log('Tracker.gg API response:', data);

    if (!data?.data) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Player not found' })
      };
    }

    // Extract relevant info
    const { platformInfo = {}, segments = [], matches = [] } = data.data;
    const stats = segments.find(s => s.type === 'overview')?.stats ?? {};
    const competitiveSegment = segments.find(s => s.metadata?.tierName);
    const lastAct = segments.find(s => s.metadata?.seasonName);

    // Build response object
    const result = {
      name: platformInfo.platformUserHandle ?? name,
      tag,
      region: platformInfo.region ?? 'N/A',
      account_level: platformInfo.level ?? 'N/A',
      card: {
        small: platformInfo.avatarUrl ?? '', 
      },
      stats: {
        kills: stats.kills?.value ?? 'N/A',
        deaths: stats.deaths?.value ?? 'N/A',
        assists: stats.assists?.value ?? 'N/A',
        score: stats.score?.value ?? 'N/A',
        kd: stats.kd?.displayValue ?? 'N/A',
        winRate: stats.winRate?.displayValue ?? 'N/A',
        matchesPlayed: stats.matchesPlayed?.value ?? 'N/A',
      },
      current_rank: competitiveSegment?.metadata.tierName ?? 'N/A',
      last_act: lastAct?.metadata.seasonName ?? 'N/A',
      match_history: matches.map(match => ({
        id: match.id,
        map: match.metadata.mapName,
        mode: match.metadata.modeName,
        result: match.metadata.result,
        roundsPlayed: match.metadata.roundsPlayed,
        roundsWon: match.metadata.roundsWon,
        roundsLost: match.metadata.roundsLost,
        kills: match.stats.kills,
        deaths: match.stats.deaths,
        assists: match.stats.assists,
        score: match.stats.score,
        date: match.metadata.timestamp,
      }))
    };

    return {
      statusCode: 200,
      body: JSON.stringify({ data: result })
    };
  } catch (error) {
    console.error('Error fetching player data:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'API error' })
    };
  }
};