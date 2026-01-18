import { useEffect, useState } from 'react';
import { playerApi } from '../api/services';
import type { PlayerInfo, CharacterInfo } from '../api/generated/player-info';

export function HomePage() {
    const [player, setPlayer] = useState<PlayerInfo | null>(null);
    const [characters, setCharacters] = useState<CharacterInfo[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [playerRes, charactersRes] = await Promise.all([
                    playerApi.getCurrentPlayer(),
                    playerApi.getCharacters(),
                ]);
                setPlayer(playerRes.data);
                setCharacters(charactersRes.data);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">MementoMori Dashboard</h1>

            {/* Player Info */}
            {player && (
                <div className="bg-card rounded-lg border p-6 mb-6">
                    <h2 className="text-2xl font-semibold mb-4">Player Information</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                            <div className="text-sm text-muted-foreground">Name</div>
                            <div className="text-lg font-medium">{player.name}</div>
                        </div>
                        <div>
                            <div className="text-sm text-muted-foreground">Level</div>
                            <div className="text-lg font-medium">{player.level}</div>
                        </div>
                        <div>
                            <div className="text-sm text-muted-foreground">VIP</div>
                            <div className="text-lg font-medium">VIP {player.vip}</div>
                        </div>
                        <div>
                            <div className="text-sm text-muted-foreground">Gold</div>
                            <div className="text-lg font-medium">{player.gold.toLocaleString()}</div>
                        </div>
                        <div>
                            <div className="text-sm text-muted-foreground">Diamond</div>
                            <div className="text-lg font-medium">{player.diamond.toLocaleString()}</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Characters */}
            <div className="bg-card rounded-lg border p-6">
                <h2 className="text-2xl font-semibold mb-4">Characters</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {characters.map((char) => (
                        <div key={char.guid} className="border rounded-lg p-4 hover:bg-accent transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <div className="font-medium">Character {char.characterId}</div>
                                    <div className="text-sm text-muted-foreground">Lv. {char.level}</div>
                                </div>
                                <div className={`px-2 py-1 rounded text-xs font-semibold ${char.rarity === 8 ? 'bg-yellow-500 text-black' :
                                        char.rarity === 4 ? 'bg-purple-500 text-white' :
                                            char.rarity === 2 ? 'bg-blue-500 text-white' :
                                                'bg-gray-500 text-white'
                                    }`}>
                                    {char.rarity === 8 ? 'SSR' : char.rarity === 4 ? 'SR' : char.rarity === 2 ? 'R' : 'N'}
                                </div>
                            </div>
                            <div className="text-sm">
                                <div className="text-muted-foreground">Battle Power</div>
                                <div className="text-lg font-bold">{char.battlePower.toLocaleString()}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
