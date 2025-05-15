import fetch from 'node-fetch';


exports.handler = async function(event) {
  const { name, tag, apiKey } = event.queryStringParameters;

  if (!name || !tag || !apiKey) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing name, tag, or API key' }),
    };
  }

  const url = `https://public-api.tracker.gg/v2/valorant/standard/profile/riot/${encodeURIComponent(name)}%23${encodeURIComponent(tag)}`;

  try {
    const response = await fetch(url, {
      headers: { 'TRN-Api-Key': apiKey }
    });
    const data = await response.json();
    console.log('Tracker.gg API response:', data);


    if (!data || !data.data) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Player not found' })
      };
    }

    // Extract relevant info
    const playerData = data.data;
    const platformInfo = playerData.platformInfo || {};
    const segments = playerData.segments || [];
    const stats = playerData.segments?.find(s => s.type === 'overview')?.stats || {};
    const matches = playerData.matches || [];

    // Find current rank 
    const competitiveSegment = segments.find(s => s.metadata && s.metadata.tierName);

    // Last act 
    const lastAct = segments.find(s => s.metadata && s.metadata.seasonName);

    // Build response object
    const result = {
      name: platformInfo.platformUserHandle || name,
      tag: tag,
      region: platformInfo.region || 'N/A',
      account_level: platformInfo.level || 'N/A',
      card: {
        small: platformInfo.avatarUrl || '', 
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
      current_rank: competitiveSegment ? competitiveSegment.metadata.tierName : 'N/A',
      last_act: lastAct ? lastAct.metadata.seasonName : 'N/A',
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
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'API error' })
    };
  }
};