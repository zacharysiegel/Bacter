class BoardEntry {
    constructor(id, name) {
        this.id = id; // ID of player
        this.name = name; // Screen name of player
        this.kills = 0; // Kills as defined by number of enemy cells killed
        this.deaths = 0; // Deaths as defined by number of org deaths
        this.ratio = NaN; // Ratio of kills to deaths
        this.score = 0; // Flag captures (ctf), time score (kth)
        this.wins = 0; // Round wins (srv, ctf, inf, kth)
    }
}
