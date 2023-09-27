## Game

#### [game.DTOs.ts](..%2Fbackend%2Fsrc%2Fgame%2Fgame.DTOs.ts)

From user

| what                        | Message       | takes          |
|-----------------------------|---------------|----------------|
| To join game queue          | 'joinQueue'   | JoinGameDTO    |
| To send an update for plank | 'updatePLank' | PlankUpdateDTO |

To user

| what                                            | Message      | takes                                                                    |
|-------------------------------------------------|--------------|--------------------------------------------------------------------------|
| Receive the confirmation that queue was entered | queueConfirm | text 'Confirm' or 'InvalidID' or 'Already in queue' or 'Already in game' |
| Receive the the data to render new match        | newRound     | NewRoundDTO                                                              |
| Receive an update while rendering               | gameUpdate   | GameUpdateDTO                                                            |

## Chat

[chat.DTOs.ts](..%2Fbackend%2Fsrc%2Fchat%2Fchat.DTOs.ts)

From User

| what                                     | Message        | takes               |
|------------------------------------------|----------------|---------------------|
| Connect to gateway and get online status | connectMessage | EstablishConnectDTO |
| Send message to chat room                | sendMessage    | SendMessageDTO      |

To user

| what                        | Message       | takes          |
|-----------------------------|---------------|----------------|
| get a new message just sent | updateMessage | SendMessageDTO |

For creating a dm chat name format is name1:name2