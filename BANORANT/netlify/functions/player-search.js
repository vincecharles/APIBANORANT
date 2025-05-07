const fetch = require('node-fetch');

exports.handler = async function(event) {
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
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'API error' })
    };
  }
};