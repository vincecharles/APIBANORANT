export const formatPlayerStats = (stats) => {
    return {
        kills: stats.kills || 0,
        deaths: stats.deaths || 0,
        assists: stats.assists || 0,
        score: stats.score || 0,
        elo: stats.elo || 'N/A',
    };
};

export const formatAgentDescription = (agent) => {
    return {
        name: agent.displayName,
        description: agent.description,
        role: agent.role,
        abilities: agent.abilities.map(ability => ability.displayName).join(', '),
    };
};

export const handleApiError = (error) => {
    console.error('API Error:', error);
    return { error: 'An error occurred while fetching data. Please try again later.' };
};