const express = require("express");
const app = express();
app.use(express.json());
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;

const convertDbObjectToResponseObject = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  };
};

const startDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is running fine.");
    });
  } catch (e) {
    console.log(`DB error ${e.message}`);
    process.exit(1);
  }
};

startDBAndServer();

app.get("/players/", async (request, response) => {
  const listOfPlayers = `
    select * from cricket_team
    `;
  const players = await db.all(listOfPlayers);
  const finalPlayers = [];
  for (let i of players) {
    finalPlayers.push(convertDbObjectToResponseObject(i));
  }
  response.send(finalPlayers);
});

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  console.log(playerId);
  const listOfPlayers = `
    select * 
    from cricket_team 
    where player_id=${playerId};
    `;
  const players = await db.get(listOfPlayers);
  finalPlayer = convertDbObjectToResponseObject(players);
  console.log(players);
  console.log(finalPlayer);
  response.send(finalPlayer);
});

app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  console.log(playerDetails.playerName);
  const player_name = playerDetails.playerName;
  const jersey_number = playerDetails.jerseyNumber;
  const role = playerDetails.role;
  const player_id = 12;
  console.log(player_id);
  const insertPlayer = `
    insert into cricket_team(player_id,player_name,jersey_number,role)
    values ('${player_id}','${player_name}','${jersey_number}','${role}')
    `;
  const dbResponse = await db.run(insertPlayer);
  response.send("Player Added to Team");
});

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  console.log(playerId);
  const playerDetails = request.body;
  console.log(playerDetails);
  const player_name = playerDetails.playerName;
  const jersey_number = playerDetails.jerseyNumber;
  const role = playerDetails.role;
  console.log(player_name);
  const updatePlayerQuery = `
  UPDATE
    cricket_team
  SET
    player_name = player_name,
    jersey_number = jersey_number,
    role = role
  WHERE
    player_id = ${playerId};
    `;
  await db.run(updatePlayerQuery);
  response.send("Player Details Updated");
});

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deleteQuery = `
    DELETE
      cricket_team
    WHERE
      player_id = ${playerId};`;

  response.send("Player Removed");
});

module.exports = app;
